Create undervisningsbeskrivelse documents for the class `$ARGUMENTS` at Frederiksberg VUC & STX.

**Context:** This vault lives at `content/semestre/s26/`. Each class has a subfolder, e.g. `content/semestre/s26/6h56Ma/`. Lessons are daily markdown files in `lektioner/`. The output goes in two places: a `.tex` file for printing and a `.md` file for the vault.

---

## Step 1 — Read the class folder

Read all dated lesson files in `content/semestre/s26/$ARGUMENTS/lektioner/` (skip `index.md`). Read them in chronological order and extract:
- What topics were taught each day
- What activities and exercises were used
- What texts, books, or materials were referenced
- Natural groupings into forløb (clusters of related lessons)

Also read `content/semestre/s26/$ARGUMENTS/lektioner/index.md` for any forløb titles already recorded there.

---

## Step 2 — Read the style references

Read both style reference files in full before writing anything:

- **LaTeX style:** `content/semestre/s26/ressourcer/undervisningsbeskrivelse/undervisningsbeskrivelse_6l26en.tex`
- **Markdown style:** `content/semestre/s26/6h56Ma/noter/Undervisningsbeskrivelse.md`

---

## Step 3 — Determine forløb structure

Group the lessons into forløb. For each forløb record:
- **Title** — a short descriptive name
- **Start date** — the date of the first lesson in the forløb (formatted `dd.mm.yy`)
- **Omfang** — number of lessons in the forløb
- **Texts/books** — any books, articles, stories, poems, podcasts or other materials used
- **Arbejdsformer** — how lessons were structured (e.g. opgaveregning, projektarbejde, nærlæsning, gruppearbejde)
- **Fokuspunkter** — the key topics, concepts, and skills covered

---

## Step 4 — Infer course metadata

Determine the `\ubmeta{}` fields from the lesson frontmatter and vault context:
- `fag`: from the `subject:` field in lesson frontmatter — expand to full name + level, e.g. `Engelsk C, HFE` or `Matematik C-B, 2HF`
- `niveau`: the course level (A, B, C…)
- `institution`: always `Frederiksberg VUC \& STX (147248)`
- `hold`: `$ARGUMENTS`
- `termin`: `Juni 2026` (or infer from the last lesson dates)
- `uddannelse`: leave empty `{}` unless you find evidence of a specific programme
- `laerer`: `Anders Ravnholt Thaysen (ART)`

---

## Step 5 — Write the `.tex` file

Write to: `content/semestre/s26/ressourcer/undervisningsbeskrivelse/undervisningsbeskrivelse_$ARGUMENTS.tex`

**Structure:** Copy the full LaTeX preamble from `undervisningsbeskrivelse_6l26en.tex` verbatim (everything from `%! TeX program` through `\makeatother`). Only the comment on line 4, the `\ubmeta{}` block, and the document body need to be customised.

**`forloeb` environment** (use the 3-argument form from the English template):
```latex
\begin{forloeb}{Titel}{dd.mm.yy}{N lektioner}
  \bog{Book or source title}        % one per source; omit if no fixed text
  \kap{Specific chapter or text}    % one per item listed under the source
  \arb{Arbejdsform}                 % repeat for each working method
  \fok{Fokuspunkt}                  % repeat for each key topic
\end{forloeb}
```

- Use `\bog{}` for the main source/book and `\kap{}` for specific texts within it (see how the English reference handles multiple sources with separate `\bog{}` blocks)
- For subjects without a fixed textbook (e.g. a repetition forløb), omit `\bog{}`/`\kap{}` entirely
- Keep `\fok{}` entries concise (2–5 words each)
- Escape special characters: `&` → `\&`, `%` → `\%`, `_` → `\_`, etc.
- Add a one-line comment `%% Engelsk C — 6l26en` (or equivalent) after the opening `%!` block

---

## Step 6 — Write the `.md` file

Write to: `content/semestre/s26/$ARGUMENTS/noter/Undervisningsbeskrivelse.md`

**Frontmatter** — match the pattern of `6h56Ma/noter/Undervisningsbeskrivelse.md`:
```yaml
---
tags:
  - $ARGUMENTS
  - undervisningsbeskrivelse
class: $ARGUMENTS
subject: <subject name>
title: undervisningsbeskrivelse
type: undervisningsbeskrivelse
---
```

**Body** — one `##` section per forløb:
- Write a prose description paragraph (2–5 sentences) grounded in what the lessons actually covered: the progression of topics, specific methods, and what the unit built toward
- Write in the same language as the subject (Danish for Danish/Maths, English for English)
- Follow with a `### Fokuspunkter` bullet list of the key topics

Mirror the register of the existing style references: descriptive and specific, not generic.

---

## Important notes

- Do **not** create the `.tex` file from a blank template — copy the preamble from the reference file
- If `Undervisningsbeskrivelse.md` already exists, overwrite it
- If `undervisningsbeskrivelse_$ARGUMENTS.tex` already exists, overwrite it
- After writing both files, confirm the paths of the two files created
