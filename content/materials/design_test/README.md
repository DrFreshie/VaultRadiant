# Anthology design experiments

Nine complete texts, presented as different parts of the same anthology. Originals in `content/materials/` are untouched.

## Start here

- **Opening_pages.pdf** — nine opening pages, in the order below; easiest comparison.
- **Contact_sheet.png** — all nine openings on one image, read left to right.
- **All_texts.pdf** — all nine complete experimental editions together.
- Each named subfolder contains the individual PDF and editable LaTeX copy.

## Design directions

| Text | Direction |
| --- | --- |
| Brave New World | Architectural, left-aligned modernist opening; strong blue rule; indented prose. |
| The Doll’s House | Quiet, centred short-story opening; no rule; traditional indented prose. |
| Have You Heard of Oscar Wilde? | Literary essay; italic title; spacious block paragraphs. |
| The Adventures of Huckleberry Finn | Classic book opening; centred serif title and short rule; original introductory matter retained. |
| The Fly Nobody Programmed | Web-post texture; sans-serif body and headings; teal accent; original subheadings retained. |
| The Kentucky Derby is Decadent and Depraved | Magazine reportage; large headline; burgundy rule; existing illustration retained. |
| New Zealand Prime Minister Addresses United Nations General Assembly | Formal speech; restrained heading and more generous spoken-paragraph spacing. |
| Typecast as a Terrorist | Newspaper personal commentary; assertive headline, double rule, block paragraphs. |
| We Wear the Mask | Poetry; preserved verse lines and stanza breaks, larger leading, ample white space. |

## Shared foundation

Derived from the existing text template: EB Garamond, Plantin headings where available, deep blue/burgundy, unobtrusive line numbering. Shared margins, publication-date placement, running heads and page numbers bind the designs together. White backgrounds remain printer-friendly. The publication date is visible, but form and voice drive the design rather than rigid historical-period categories.

This is a curated edition, not an imitation of the original publications. Genre labels are editorial navigation, not original text. No standfirsts, quotations or textual subheadings have been invented.

## Editing and rebuilding

Edit **anthology-style.tex** to change the shared design or a particular family. The generated `.tex` files load it with a relative path.

Run from any directory:

```bash
python3 /home/anders/VaultRadiant/content/materials/design_test/build.py
```

Requires LuaLaTeX, the packages used by the original templates, Arial, EB Garamond, and Poppler's `pdfseparate`, `pdfunite`, and `pdftoppm`. ImageMagick creates the optional contact sheet. Plantin uses an EB Garamond fallback if unavailable. The unused `ulem` dependency is omitted in these copies because it is not installed here.

Rebuilding regenerates the experimental `.tex` files from the originals; edit the shared style or `build.py` for lasting changes. Original text, spelling, author/date metadata, source notes and existing image-caption remnants are deliberately not copyedited or fact-checked. In particular, the placeholder source URL in *Typecast as a Terrorist* remains a source-content issue, not a design choice.

## Checks

All nine PDFs compile. The opening-page comparison contains nine A4 pages. The contact sheet was visually inspected; compilation logs contain no overfull boxes or missing-character reports. Some inherited template/font-package warnings remain.
