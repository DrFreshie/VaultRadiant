import random, os, subprocess, textwrap
words = [
    "FATHER", "DAUGHTER", "AUNT", "BLOUSE", "JOURNEY", "WEST", "MAMMOTH", "BONES", "NEWSPAPER", "RIVER",
    "MOUNTAINS", "COMPASS", "TRINKETS", "PIROGUE", "FRONTIER", "WILDERNESS", "TRADER", "LETTERS", "STOVEPIPE", "HORSE"
]
# sort long first but retain original ids
items = list(enumerate(words, start=1))
items_sorted = sorted(items, key=lambda x: -len(x[1]))

def cells_for(word, x, y, d):
    return [(x+i if d=='A' else x, y if d=='A' else y-i, ch) for i,ch in enumerate(word)]

def valid(place, grid, placements):
    idx, word, x, y, d = place
    cs = cells_for(word,x,y,d)
    coords = {(a,b):ch for a,b,ch in cs}
    for a,b,ch in cs:
        if (a,b) in grid and grid[(a,b)] != ch: return False
    # prevent same-direction touching before/after
    if d=='A':
        if (x-1,y) in grid or (x+len(word),y) in grid: return False
    else:
        if (x,y+1) in grid or (x,y-len(word)) in grid: return False
    # prevent adjacent letters forming accidental strings parallel to word, except crossing cells
    for a,b,ch in cs:
        is_cross = (a,b) in grid
        if d=='A' and not is_cross:
            if (a,b+1) in grid or (a,b-1) in grid: return False
        if d=='D' and not is_cross:
            if (a-1,b) in grid or (a+1,b) in grid: return False
    return True

def add(place, grid):
    idx, word, x, y, d = place
    for a,b,ch in cells_for(word,x,y,d): grid[(a,b)] = ch

def remove(place, grid, placements):
    # rebuild simpler
    grid.clear()
    for p in placements: add(p, grid)

def candidates(item, grid):
    idx, word = item
    if not grid:
        return [(idx, word, 0, 0, 'A')]
    cands=[]
    for i,ch in enumerate(word):
        for (gx,gy),gch in grid.items():
            if ch!=gch: continue
            # place across crossing at i
            cands.append((idx,word,gx-i,gy,'A'))
            # place down crossing at i (y decreases)
            cands.append((idx,word,gx,gy+i,'D'))
    random.shuffle(cands)
    return cands

def area(pls):
    xs=[]; ys=[]
    for idx,w,x,y,d in pls:
        for a,b,ch in cells_for(w,x,y,d): xs.append(a); ys.append(b)
    return (max(xs)-min(xs)+1)*(max(ys)-min(ys)+1), max(xs)-min(xs)+1, max(ys)-min(ys)+1

best=None
for seed in range(2000):
    random.seed(seed)
    grid={}; placements=[]
    rest=items_sorted[:]
    add((rest[0][0], rest[0][1], 0, 0, 'A'), grid); placements.append((rest[0][0],rest[0][1],0,0,'A'))
    ok=True
    for item in rest[1:]:
        cands = [c for c in candidates(item, grid) if valid(c, grid, placements)]
        if not cands:
            ok=False; break
        # choose candidate minimizing area and balancing dims
        scored=[]
        for c in cands[:]:
            tg=grid.copy(); add(c,tg)
            # temp placements
            temp=placements+[c]
            ar,wid,hei=area(temp)
            scored.append((ar+abs(wid-hei)*3,wid,hei,c))
        scored.sort()
        c=scored[0][3]
        add(c,grid); placements.append(c)
    if ok:
        ar,wid,hei=area(placements)
        score=ar+abs(wid-hei)*5
        if best is None or score<best[0]: best=(score,seed,placements.copy())
        if wid<=24 and hei<=32: break

score,seed,placements=best
# normalize coords to positive, invert? keep y positive after min shift
allcells=[]
for p in placements:
    allcells += cells_for(p[1],p[2],p[3],p[4])
minx=min(a for a,b,ch in allcells); miny=min(b for a,b,ch in allcells)
placements=[(idx,w,x-minx,y-miny,d) for idx,w,x,y,d in placements]
# numbers assigned reading top-to-bottom, left-to-right start cells
# actually use original ids as word numbers for clear partner prompts
nums=[(x,y,idx) for idx,w,x,y,d in placements]
# grid letters by all placements
solution={}
for p in placements:
    for a,b,ch in cells_for(p[1],p[2],p[3],p[4]): solution[(a,b)] = ch

visible_A={idx for idx,w in items if idx%2==1}  # odd words filled for A

def page_cells(visible):
    out=[]
    for y in sorted({b for a,b in solution}, reverse=True):
        for x in sorted({a for a,b in solution if b==y}):
            # Determine if this coordinate belongs to any visible word (if multiple, visible if any visible word contains it)
            letter=solution[(x,y)]
            show=False
            for idx,w,px,py,d in placements:
                if (x,y,letter) in cells_for(w,px,py,d) and idx in visible:
                    show=True; break
            fill='knowncell' if show else 'white'
            txt=letter if show else ''
            out.append(f"  \\cell{{{x}}}{{{y}}}{{{fill}}}{{{txt}}}")
    return '\n'.join(out)

def num_cells():
    out=[]
    for x,y,idx in nums:
        out.append(f"  \\num{{{x}}}{{{y}}}{{{idx}}}")
    return '\n'.join(out)

wordlist=', '.join([w.title() for _,w in items])
tex = r'''
\documentclass[a4paper,11pt]{article}
\usepackage[margin=14mm]{geometry}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{lmodern}
\usepackage{xcolor}
\usepackage{tikz}
\usetikzlibrary{calc}
\pagestyle{empty}
\setlength{\parindent}{0pt}
\renewcommand{\familydefault}{\sfdefault}
\definecolor{knowncell}{HTML}{EAF4FF}
\definecolor{letterblue}{HTML}{006EB6}
\newcommand{\cellsize}{0.56}
\newcommand{\cell}[4]{%
  \draw[fill=#3, draw=black, line width=0.55pt] (#1*\cellsize,#2*\cellsize) rectangle ++(\cellsize,\cellsize);
  \node[font=\bfseries\footnotesize, text=letterblue] at (#1*\cellsize+0.5*\cellsize,#2*\cellsize+0.47*\cellsize) {#4};
}
\newcommand{\num}[3]{%
  \node[anchor=north west, font=\scriptsize, inner sep=0.45pt] at (#1*\cellsize+0.015,#2*\cellsize+\cellsize-0.015) {#3};
}
\newcommand{\studentpage}[3]{%
{\large\textbf{Student #1:}} You and your partner have different parts of the same crossword puzzle. Fill in the missing words by asking your partner for clues.\par\medskip
Take turns asking questions like: \textbf{What's 3 across?} or \textbf{What's 5 down?} Answer by describing the word without saying it. Multi-word answers are written without spaces in the grid.\par\medskip
\textit{Theme: the opening quarter of Carys Davies' \emph{West} --- Bellman's journey, Bess at home, and the search for giant beasts.}\par\vspace{4mm}
\begin{center}
\begin{tikzpicture}[x=1cm,y=1cm]
#2
#3
\end{tikzpicture}
\end{center}
\newpage
}
\begin{document}
\studentpage{A}{%
'''
tex += page_cells(visible_A) + "\n}{%\n" + num_cells() + "\n}\n"
tex += r'''
\studentpage{B}{%
'''
tex += page_cells(set(range(1,21))-visible_A) + "\n}{%\n" + num_cells() + "\n}\n"
tex += "\\end{document}\n"
outdir='content/materials/West_Half_Crossword'
os.makedirs(outdir, exist_ok=True)
with open(os.path.join(outdir,'west_half_crossword.tex'),'w') as f: f.write(tex)
print('seed', seed, 'score', score)
print('placements')
for p in sorted(placements): print(p)
print('words:', wordlist)
