# The Future Is Written — English C

`the-future-is-written.pdf` contains all nine dated lessons in chronological order, a unit front page, a contents page and a Worksheets section (31 pages total). The editable source is `the-future-is-written.tex`.

Rebuild from the repository root:

```sh
node scripts/build_course_pdf.mjs
```

Requires the repository's Node dependencies, LuaLaTeX, Noto Sans and EB Garamond. The print design uses the Quartz light palette with serif headings and sans-serif body text; the fonts are local substitutes for the site's web fonts.

Images are bundled in `assets/`. The five distinct worksheet PDFs are imported in full using `\\includepdf` in a final Worksheets section. Lesson worksheet links jump internally to the first imported page and show its booklet page number. A clickable worksheet index is included. Original worksheet layouts are retained at 90% scale, with booklet headers and page numbers added.

Readings and non-worksheet Materials entries are plain text, without hyperlinks. A separate readings PDF is deferred. Referenced local PDFs are still copied into `materials/` for a later readings collection. Retain both `assets/` and `materials/` to compile the LaTeX source; the compiled booklet needs no companion files for its worksheets.

YouTube embeds are replaced by plain-text video titles, verified using YouTube oEmbed and cached in `scripts/course_video_titles.json`. Decorative emoji are omitted in print. Worksheet navigation stays clickable. Other inline web resources and the Markdown analysis guide retain their links.

Hidden Obsidian comments and teacher notes are omitted. Lesson content is otherwise retained from the Markdown sources. No source lessons are modified by the build.
