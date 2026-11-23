#!/usr/bin/env node
// Build a printable LaTeX course book from the English C Markdown lessons.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
const root=process.cwd();
const courseMode=process.argv.includes('--course');
const unitMetadata={
 identity:{title:'Identity',cover:'wroef.jpg',description:'Family, memories, possessions, and the stories we tell. Public and private identities through games, poetry, photography, podcasts, and television.'},
 voice:{title:'Voice',cover:'dolls-house-button.png',description:'Finding your voice and hearing someone else’s. Narrative voices, self-expression, speeches, and the relationship between personal confidence and public responsibility.'},
 'the-future-is-written':{title:'The Future Is Written',cover:'Sci-fi-train.png',description:'Science fiction, memory, artificial intelligence, human relationships, and visions of space exploration.'},
};
const units=courseMode ? Object.keys(unitMetadata).map(slug=>'content/classnotes/eng-c/'+slug) : [process.argv[2] || 'content/classnotes/eng-c/the-future-is-written'];
const lessonCount=units.reduce((sum,unit)=>sum+fs.readdirSync(unit).filter(f=>/^\d.*\.md$/.test(f)).length,0);
const out=path.resolve(courseMode ? 'content/exports/eng-c/course' : (process.argv[3] || 'content/exports/eng-c/the-future-is-written'));
const basename=courseMode ? 'english-c-course' : 'the-future-is-written';
let unitTitle='The Future Is Written';
let inTable=false;
fs.mkdirSync(path.join(out,'assets'),{recursive:true});
fs.mkdirSync(path.join(out,'materials'),{recursive:true});
const esc=s=>String(s).replace(/[\\{}$&#%_~^]/g,c=>({'\\':'\\textbackslash{}','{':'\\{','}':'\\}','$':'\\$','&':'\\&','#':'\\#','%':'\\%','_':'\\_','~':'\\textasciitilde{}','^':'\\textasciicircum{}'}[c]));
const text=n=>n.type==='text'?n.value:(n.children||[]).map(text).join('');
let current; let inMaterials=false; let renderingNotes=false; const missing=[];
// The student-facing guides/models from the notes index; omit unit descriptions
// and the draft teacher progression plan.
const notes=new Map();
if(courseMode) {
 for(const slug of ['how-to-analyse','cinematic-techniques','flirt-model','ace-model','blooms-taxonomy','rhetorical-situation','rhetorical-devices','modes-of-appeal']) {
  const file=path.resolve('content/classnotes/eng-c/notes',slug+'.md');
  const source=fs.readFileSync(file,'utf8').trimStart();
  const frontmatter=source.match(/^---\n([\s\S]*?)\n---\n/);
  const title=frontmatter[1].match(/^title: (.*)$/m)[1];
  notes.set(file,{id:'note-'+slug,title,body:source.slice(frontmatter[0].length)});
 }
}
// Titles verified via YouTube oEmbed; cached so rebuilding needs no network.
const videoTitles=JSON.parse(fs.readFileSync(new URL('./course_video_titles.json',import.meta.url),'utf8'));
function videoTitle(url) {
 const id=url.match(/(?:embed\/|youtu\.be\/|[?&]v=)([\w-]+)/)?.[1];
 if(!id || !videoTitles[id]) throw Error('Missing YouTube title for '+url);
 // Omit decorative emoji unsupported by the print body font.
 let title=videoTitles[id].title.replace(/\p{Extended_Pictographic}/gu,'').replace(/\s+/g,' ').trim();
 const params=new URL(url).searchParams;
 const time=s=>`${Math.floor(Number(s)/60)}:${String(Number(s)%60).padStart(2,'0')}`;
 if(params.has('start')) title+=` (${time(params.get('start'))}${params.has('end')?'–'+time(params.get('end')):' onwards'})`;
 return esc(title);
}
const worksheets=new Map();
function image(src,width='\\linewidth',height='.43\\textheight') {
 const file=path.resolve(root,'content/imgs',path.basename(src));
 if(!fs.existsSync(file)) throw Error('Missing image '+src);
 const name=path.basename(file); fs.copyFileSync(file,path.join(out,'assets',name));
 return `\\includegraphics[width=${width},height=${height},keepaspectratio]{assets/${name}}`;
}
function href(url, label='') {
 if(/^https?:/.test(url)) return url;
 let file=path.resolve(path.dirname(current),url);
 if(!fs.existsSync(file)) file=path.resolve(root,'content',url.replace(/^(\.\.\/)+/,''));
 if(fs.existsSync(file)&&file.endsWith('.pdf')) {
 const name=path.basename(file); fs.copyFileSync(file,path.join(out,'materials',name));
 if(/worksheet|handout|crossword|Mollys_Diary_Entry/i.test(file+' '+label)) {
  if(!worksheets.has(file)) {
   const id='worksheet-'+(worksheets.size+1);
   const title=file.includes('/Identity_worksheets/') || /Mollys_Diary_Entry/.test(file) ? label.replace(/ - handout$/i,'') : path.basename(file,'.pdf').replaceAll('_',' ').replace(/Worksheet$/i,'— Worksheet');
   worksheets.set(file,{id,name,title,unitTitle});
  }
  return '#'+worksheets.get(file).id;
 }
 return 'run:materials/'+name;
 }
 if(notes.has(file)) return '#'+notes.get(file).id;
 // Keep any non-imported local resources linked to their source.
 if(fs.existsSync(file)) return 'run:'+path.relative(out,file);
 missing.push(url); return 'run:'+path.relative(out,path.resolve(path.dirname(current),url));
}
function children(n){
 const a=(n.children||[]).filter(x=>!(x.type==='text'&&!x.value.trim()));
 let s='';
 for(let i=0;i<a.length;i++){
 const x=a[i], next=a[i+1];
 const img=next?.tagName==='p'&&next.children?.find(c=>c.tagName==='img'&&['right','left'].includes(c.properties?.title));
 if(x.tagName==='blockquote'&&img){
 s+=`\n\\noindent\\begin{minipage}[c]{.51\\linewidth}\n${render(x)}\\end{minipage}\\hfill\\begin{minipage}[c]{.44\\linewidth}\\centering\n${image(img.properties.src,'\\linewidth','.47\\textheight')}\\end{minipage}\\par\\medskip\n`;i++;
 }else s+=render(x);
 }
 return s;
}
function render(n){
 if(n.type==='text') return esc(n.value);
 const t=n.tagName, p=n.properties||{};
 if(!t) return children(n);
 if(t==='h1') return '';
 if(/^h[2-6]$/.test(t)) {
  inMaterials=text(n).trim()==='Materials';
  const heading=renderingNotes && t!=='h2' ? 'subsection' : 'section';
  return `\n\\${heading}*{${esc(text(n).replace('⋮⋮ ',''))}}\n`; 
 }
 if(t==='p') return children(n)+'\n\n';
 if(t==='em') return '\\emph{'+children(n)+'}';
 if(t==='strong') return '\\textbf{'+children(n)+'}';
 if(t==='a') {
  if(p.href.startsWith('mailto:')) return children(n);
  const target=href(p.href,text(n));
  if(target.startsWith('#')) return `\\hyperref[${target.slice(1)}]{${children(n)} (p.~\\pageref*{${target.slice(1)}})}`;
  if(/(?:youtube\.com|youtu\.be)/.test(p.href)) return videoTitle(p.href);
  if(target.startsWith('run:materials/') || inMaterials || /\.pdf(?:[?#]|$)/i.test(p.href) || /poetryfoundation\.org|poets\.org|gutenberg\.org|wikisource\.org|wikipedia\.org|jamesmollison\.com|thisamericanlife\.org\/.*transcript/.test(p.href)) return children(n);
  return `\\href{${target.replace(/%/g,'\\%').replace(/#/g,'\\#')}}{${children(n)}}`; 
 }
 if(t==='img') return '\n\\begin{center}'+image(p.src)+'\\end{center}\n';
 if(t==='iframe') return `\n\\par\\noindent\\textbf{Video:} ${videoTitle(p.src)}\\par\\medskip\n`; 
 if(t==='hr') return '\n\\par\\medskip{\\color{rule}\\hrule}\\medskip\n';
 if(t==='ol'||t==='ul') return `\n\\begin{${t==='ol'?'enumerate':'itemize'}}${t==='ol'&&p.start>1?'[start='+p.start+']':''}\n${children(n)}\\end{${t==='ol'?'enumerate':'itemize'}}\n`;
 if(t==='li') return '\\item '+children(n)+'\n';
 if(t==='blockquote') {
 let content=children(n); const m=content.match(/^\s*\[!([\w-]+)\]([^\n]*)\n*/);
 if(m){
 content=content.slice(m[0].length); const label=m[2].trim();
 if(m[1]==='task-columns'||m[1]==='no-slide') return (label?'\\tasktitle{'+label+'}\n':'')+content;
 if(m[1]==='pullquote') return '\\begin{quotebox}\n'+content+'\\end{quotebox}\n';
 return '\\begin{taskbox}\n'+(label?'\\tasktitle{'+label+'}\n':'')+content+'\\end{taskbox}\n';
 }
 return '\\begin{quote}'+content+'\\end{quote}\n';
 }
 if(t==='div') {
 const cls=(p.className||[]).join(' ');
 if(cls.includes('callout-title')) return '\\tasktitle{'+esc(text(n))+'}\n';
 if(/display:\s*flex/.test(p.style||'')) {
 const elems=n.children.filter(c=>c.tagName); return '\n\\noindent\\begin{minipage}[c]{.51\\linewidth}\n'+render(elems[0])+'\\end{minipage}\\hfill\\begin{minipage}[c]{.44\\linewidth}\\centering\n'+image(elems[1].properties.src,'\\linewidth','.4\\textheight')+'\\end{minipage}\\par\\medskip\n';
 }
 return children(n);
 }
 if(t==='pre') {
  const code=n.children?.find(c=>c.tagName==='code');
  if(code?.properties?.className?.includes('language-hangman')) {
   const content=text(code), word=content.match(/^word: (.*)$/m)?.[1]||'';
   const hint=content.match(/^hint: (.*)$/m)?.[1]||'';
   return `\\textbf{Hangman:} ${esc(hint)} (${word.replace(/\s/g,'').length} characters).\\par\\medskip\n`;
  }
  return '\\begin{quote}'+esc(text(n))+'\\end{quote}\n';
 }
 if(t==='audio') return ''; // The lesson already gives the episode and act title.
 if(t==='table') {
  const rows=[];
  function collect(x){if(x.tagName==='tr') rows.push(x); else (x.children||[]).forEach(collect);}
  collect(n);
  const count=rows[0].children.filter(c=>c.tagName==='td'||c.tagName==='th').length;
  inTable=true;
  const body=rows.map(render).join('');
  inTable=false;
  return '\n{\\small\\setlength{\\tabcolsep}{4pt}\\renewcommand{\\arraystretch}{1.3}\\begin{tabularx}{\\linewidth}{@{}'+ '>{\\raggedright\\arraybackslash}X'.repeat(count)+'@{}}\\toprule\n'+body+'\\bottomrule\\end{tabularx}}\\par\\medskip\n';
 }
 if(t==='tr') return n.children.filter(c=>c.tagName==='td'||c.tagName==='th').map(children).join(' & ')+'\\\\\n';
 if(t==='br') return inTable ? '\\newline{}' : '\\\\';
 return children(n);
}
const preamble=String.raw`\documentclass[11pt,a4paper,oneside]{book}
\usepackage[margin=21mm,headheight=16pt]{geometry}
\usepackage{fontspec}
\setmainfont{Noto Sans}
\newfontfamily\displayfont{EB Garamond}
\usepackage{xcolor,graphicx,enumitem,tabularx,booktabs,titlesec,fancyhdr,microtype}
\usepackage[most]{tcolorbox}
\usepackage{pdfpages}
\usepackage{hyperref}
\definecolor{paper}{HTML}{FFFDFA}
\definecolor{ink}{HTML}{2A354B}
\definecolor{navy}{HTML}{08142C}
\definecolor{blue}{HTML}{274B75}
\definecolor{rule}{HTML}{E1DACA}
\pagecolor{paper}\color{ink}
\hypersetup{colorlinks=true,urlcolor=blue,linkcolor=blue,pdftitle={The Future Is Written — English C},pdfauthor={}}
\setlength{\parindent}{0pt}
\setlength{\parskip}{.55em}
\setlength{\emergencystretch}{2em}
\linespread{1.12}
\setlist{leftmargin=*,itemsep=.35em,topsep=.4em,parsep=0pt}
\setlist[enumerate]{label=\textcolor{blue}{\arabic*.}}
\titleformat{\section}{\displayfont\Large\color{navy}}{}{0pt}{}
\titlespacing*{\section}{0pt}{1.2em}{.5em}
\titleformat{\subsection}{\bfseries\color{blue}}{}{0pt}{}
\titlespacing*{\subsection}{0pt}{.9em}{.3em}
\newcommand{\tasktitle}[1]{{\color{blue}\bfseries #1}\par\smallskip}
\newtcolorbox{taskbox}{enhanced,colback=paper,colframe=paper,boxrule=0pt,left=3mm,right=1mm,top=1mm,bottom=1mm,before skip=5pt,after skip=8pt}
\newtcolorbox{quotebox}{enhanced,breakable,colback=paper,colframe=rule,boxrule=0pt,borderline west={2pt}{0pt}{rule},fontupper=\displayfont\large,left=5mm}
\pagestyle{fancy}\fancyhf{}
\fancyhead[L]{\small\color{blue}The Future Is Written}
\fancyhead[R]{\small English C}
\fancyfoot[L]{\footnotesize\nouppercase{\leftmark}}
\fancyfoot[R]{\small\thepage}
\renewcommand{\headrulewidth}{0pt}
\makeatletter
\renewcommand{\@pnumwidth}{2.2em}
\renewcommand{\@tocrmarg}{3em}
\makeatother
\setcounter{tocdepth}{0}
\begin{document}
\begin{titlepage}
\vspace*{12mm}
{\color{blue}\large ENGLISH C\par}
\vspace{8mm}
{\displayfont\color{navy}\fontsize{43}{47}\selectfont The Future\\Is Written\par}
\vspace{12mm}
\includegraphics[width=\linewidth,height=.48\textheight,keepaspectratio]{assets/Sci-fi-train.png}
\vfill
{\large Science fiction, memory, artificial intelligence,\\human relationships, and space exploration.\par}
\vspace{5mm}
{\color{blue}Nine lessons · 19 October–23 November 2026\par}
\end{titlepage}
\tableofcontents
\clearpage
`;
fs.copyFileSync('content/imgs/Sci-fi-train.png',path.join(out,'assets/Sci-fi-train.png'));
let tex=preamble;
if(courseMode) {
 tex=preamble.slice(0,preamble.indexOf('\\begin{titlepage}')).replace('pdftitle={The Future Is Written — English C}','pdftitle={English C — Course Lessons}').replace('\\fancyhead[L]{\\small\\color{blue}The Future Is Written}','\\fancyhead[L]{\\small\\color{blue}Course lessons}').replace('\\setcounter{tocdepth}{0}','\\setcounter{tocdepth}{1}');
 tex+=String.raw`\begin{titlepage}
\vspace*{30mm}
{\color{blue}\large COURSE LESSONS\par}
\vspace{10mm}
{\displayfont\color{navy}\fontsize{48}{52}\selectfont English C\par}
\vspace{12mm}
{\Large Identity\par Voice\par The Future Is Written\par}
\vfill
{\color{blue}__LESSON_COUNT__ lessons · August–November 2026\par}
\end{titlepage}
\tableofcontents
`.replace('__LESSON_COUNT__',String(lessonCount));
}
for(const [chapterIndex,unit] of units.entries()) {
 const metadata=unitMetadata[path.basename(unit)];
 unitTitle=metadata.title;
 if(courseMode) {
  const {cover,description}=metadata;
  tex+=`\n\\clearpage\\phantomsection\\addcontentsline{toc}{chapter}{${chapterIndex+1}. ${unitTitle}}\\markboth{${unitTitle}}{}\\thispagestyle{empty}\n\\fancyhead[L]{\\small\\color{blue}${unitTitle}}\n\\vspace*{12mm}\n{\\color{blue}\\large CHAPTER ${chapterIndex+1}\\par}\\vspace{8mm}\n{\\displayfont\\color{navy}\\fontsize{43}{47}\\selectfont ${unitTitle}\\par}\\vspace{12mm}\n\\begin{center}${image(cover,'\\linewidth','.48\\textheight')}\\end{center}\\vfill\n{\\large ${description}\\par}\\clearpage\n`;
 }
const files=fs.readdirSync(unit).filter(f=>/^\d.*\.md$/.test(f)).sort();
for(let i=0;i<files.length;i++){
 inMaterials=false;
 current=path.resolve(unit,files[i]); let md=fs.readFileSync(current,'utf8').trimStart();
 const fm=md.match(/^---\n([\s\S]*?)\n---\n/); const title=fm[1].match(/^title: (.*)$/m)[1];
 md=md.slice(fm[0].length).replace(/## %%Notes[\s\S]*$/,'').replace(/%%[\s\S]*?%%/g,'').replace(/^\[\[.*\]\]\s*$/gm,'').replace(/^---\s*$/m,'');
 const processor=unified().use(remarkParse).use(remarkGfm).use(remarkRehype,{allowDangerousHtml:true}).use(rehypeRaw);
 const tree=await processor.run(processor.parse(md));
 const date=new Date(files[i].slice(0,10)+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 tex+=`\n\\clearpage\\markboth{${esc(title)}}{}\n\\phantomsection\\addcontentsline{toc}{${courseMode?'section':'chapter'}}{${i+1}. ${esc(title)}}\n{\\color{blue}\\small LESSON ${String(i+1).padStart(2,'0')} \\hfill ${date}\\par}\n\\vspace{4mm}\n{\\displayfont\\color{navy}\\fontsize{30}{34}\\selectfont ${esc(title)}\\par}\\vspace{4mm}\n`+render(tree);
}
}
if(worksheets.size) {
 if(courseMode) tex+='\n\\clearpage\\fancyhead[L]{\\small\\color{blue}Worksheets}\n';
 tex+='\n\\clearpage\\phantomsection\\addcontentsline{toc}{chapter}{Worksheets}\\markboth{Worksheets}{}\n';
 tex+='{\\displayfont\\color{navy}\\fontsize{30}{34}\\selectfont Worksheets\\par}\\vspace{6mm}\n';
 tex+='All worksheets referenced in the lessons are collected below. Click a title or page number to jump to the worksheet.\\par\n';
 let worksheetUnit=worksheets.values().next().value.unitTitle;
 if(courseMode) tex+=`\\tasktitle{${esc(worksheetUnit)}}\n`;
 tex+='\\begin{enumerate}\n';
 for(const {id,title,unitTitle:chapter} of worksheets.values()) {
  if(courseMode && chapter!==worksheetUnit) {
   tex+=`\\end{enumerate}\\tasktitle{${esc(chapter)}}\\begin{enumerate}\n`;
   worksheetUnit=chapter;
  }
  tex+=`\\item \\hyperref[${id}]{${esc(title)}} \\hfill \\hyperref[${id}]{p.~\\pageref*{${id}}}\n`;
 }
 tex+='\\end{enumerate}\n';
 for(const {id,name,title} of worksheets.values()) {
  tex+=`\n\\clearpage\\markboth{${esc(title)}}{}\n\\includepdf[pages=-,scale=.9,pagecommand={\\thispagestyle{fancy}},addtotoc={1,${courseMode?'subsection':'section'},${courseMode?2:1},{${esc(title)}},${id}}]{materials/${name}}\n`; 
 }
}
if(notes.size) {
 tex+='\n\\clearpage\\fancyhead[L]{\\small\\color{blue}Notes}\\markboth{Notes}{}\\phantomsection\\addcontentsline{toc}{chapter}{Notes}\n';
 tex+='{\\displayfont\\color{navy}\\fontsize{30}{34}\\selectfont Notes\\par}\\vspace{6mm}\n';
 tex+='Analysis guides and models. Click a title or page number to open a guide.\\par\n\\begin{enumerate}\n';
 for(const {id,title} of notes.values()) tex+=`\\item \\hyperref[${id}]{${esc(title)}} \\hfill \\hyperref[${id}]{p.~\\pageref*{${id}}}\n`;
 tex+='\\end{enumerate}\n';
 renderingNotes=true;
 for(const [file,{id,title,body}] of notes) {
  current=file; inMaterials=false;
  const processor=unified().use(remarkParse).use(remarkGfm).use(remarkRehype,{allowDangerousHtml:true}).use(rehypeRaw);
  const tree=await processor.run(processor.parse(body.replace(/%%[\s\S]*?%%/g,'')));
  tex+=`\n\\clearpage\\phantomsection\\label{${id}}\\addcontentsline{toc}{section}{${esc(title)}}\\markboth{${esc(title)}}{}\n{\\displayfont\\color{navy}\\fontsize{30}{34}\\selectfont ${esc(title)}\\par}\\vspace{4mm}\n`+render(tree);
 }
 renderingNotes=false;
}
tex+='\n\\end{document}\n';
fs.writeFileSync(path.join(out,basename+'.tex'),tex);
if(missing.length) throw Error('Unresolved links: '+missing.join(', '));
for(let i=0;i<3;i++) {
 try { execFileSync('lualatex',['-interaction=nonstopmode','-halt-on-error',basename+'.tex'],{cwd:out,stdio:'pipe'}); }
 catch(error) { console.error(error.stdout?.toString()); throw error; }
}
console.log(path.join(out,basename+'.pdf'));
