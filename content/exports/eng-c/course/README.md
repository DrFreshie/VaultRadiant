# English C — course lessons

`english-c-course.pdf` combines:

1. **Identity** — eight lessons, 13 August–10 September 2026; Edith Finch cover (`wroef.jpg`).
2. **Voice** — seven lessons, 14 September–8 October 2026; doll’s-house cover (`dolls-house-button.png`).
3. **The Future Is Written** — nine lessons, 19 October–23 November 2026; science-fiction train cover.
4. **Worksheets** — 19 distinct PDFs imported in full, indexed by chapter.
5. **Notes** — eight guides/models: How to analyse, cinematic techniques, FLIRT, ACE, Bloom’s taxonomy, rhetorical situation, rhetorical devices and modes of appeal. Includes a clickable index and internal page references from lessons and between guides. The draft writing progression plan is excluded.

Each unit opens with its illustrated chapter front page, followed by its full description, texts and materials, and key terms. Contents, worksheet references and the worksheet index provide internal navigation. Reading references are plain text; a separate readings PDF is deferred. YouTube videos appear as verified titles, with segment times preserved where specified. Hangman activities show hints and word lengths rather than revealing answers. Hidden teacher notes are omitted. Source Markdown is unchanged.

Rebuild from the repository root:

```sh
node scripts/build_course_pdf.mjs --course
```

Requires installed repository dependencies, LuaLaTeX, Noto Sans and EB Garamond. The script uses cached YouTube metadata in `scripts/course_video_titles.json` and makes no network requests.

The editable LaTeX source is `english-c-course.tex`. Keep `assets/` and `materials/` beside it to recompile. The finished PDF is self-contained for images and worksheets; readings are not appended. Web tools and other non-reading resources may retain external links.

The earlier standalone unit PDF remains in `../the-future-is-written/`.
