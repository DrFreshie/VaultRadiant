---
title: AGENTS.md
type: instructions
---

# AGENTS.md

This file defines the default content-generation workflows and conventions for OpenCode agents in this repo.

## Math Exercise Template (Default)

When generating a math exercise sheet in LaTeX, base it on `content/semestre/s26/ressourcer/matematik_opgave_template.tex` unless the user asks otherwise.

- Replace `__TITLE__` in the template with the exact title from the user prompt
- Keep the visual style and preamble from the template
- Structure the body with `\subsection{}` blocks only; do not add section titles
- Put each group of subproblems inside `\begin{enumerate} ... \end{enumerate}`
- Place the finished file at `content/semestre/s26/ressourcer/<titel>/<titel>.tex`
- Use the same normalized name for folder and file: convert the title to a filesystem-safe name and replace spaces with underscores
- Keep the displayed title in the document header human-readable, even if the folder name is normalized

Use Danish and simple æ, ø, å in instructions.

## Plotting Standard (Default)

When generating math plots for teaching material, use `gnuplot` with this visual style unless the user asks otherwise:

- Output: PNG (`pngcairo`), `2000x1400`, font `Helvetica,26`
- Background: white
- Grid: single grid type only, major gridlines every `1` on both axes
- Axes: black `x`/`y` axes through `(0,0)` with arrowheads
- Curve color: green (`#2d9b4c`), line width `3.6`
- Default range: `x in [-5.2, 5.2]`, `y in [-10.5, 10.5]`
- No title unless explicitly requested

## Titles

If the user requests "forskrift", use English label "formula" in communication, and set the plot title to the function expression, e.g.:

- `f(x) = 2x^{2} - 3x - 5`

## Piecewise Conventions

For piecewise plots (if not overridden):

- Keep pieces visually disconnected at breakpoints
- Use endpoint markers to show membership
- Default convention: left piece open circle, right piece filled circle

## File/Folder Conventions

- Put each set in its own folder under `content/semestre/s26/ressourcer/img/`
- Use deterministic names like `q1_grad2.png`, `pw3.png`, etc.
- Build a multipage PDF per set named `<folder>_alle_grafer.pdf`

## Preferred Workflow

1. Create a JSON spec for plots
2. Generate PNGs with `python3 scripts/make_plots.py <spec.json>`
3. Build PDF with `python3 scripts/make_pdf.py <image_dir> <output.pdf>`

Example:

```bash
python3 scripts/make_plots.py tmp/polynomial_spec.json
python3 scripts/make_pdf.py content/semestre/s26/ressourcer/img/polynomier_grad2_3_med_forskrift content/semestre/s26/ressourcer/img/polynomier_grad2_3_med_forskrift_alle_grafer.pdf
```

## LaTeX Skabeloner

```latex
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Skabeloner

% Sidestillet figur
\begin{wrapfigure}[8]{r}{0.2\textwidth}
\vspace{-18pt}
\includegraphics[width=0.3\textwidth]{ovn}
\end{wrapfigure}

% Midterstillet figur
\begin{figure}[h!]
\centering
\includegraphics[width=0.8\textwidth]{abc}
\end{figure}

% Førstillet figur
\begin{figure}[h!]
\centering
\vspace{-15pt}
\includegraphics[width=0.35\textwidth]{stud}
\end{figure}

% Tabel
\begin{figure}[h!]
\centering\renewcommand{\arraystretch}{1.5}
\begin{tabularx}{0.9\textwidth}{|l|b|b|b|b|b|b|}
    \hline \cellcolor{hggreen} Decimaltal & 7\% & -51\% & 13,7\% & 126\% & 456\% & 0,28\%\\\hline
    \cellcolor{hggreen} Procenttal &  &  &  &  &  & \\\hline
\end{tabularx}
\end{figure}

% Forklaringsopgaver
\begin{align*}
&&    &                        &&\underset{\rule{0.8\linewidth}{0pt}}{\textbf{Forklaring:}}\\[1em]
&&    &\frac{(x+2)^2 - 4}{x}         &&\underset{\rule{0.8\linewidth}{0.4pt}}{\text{Udtrykket skrives op.}}\\[2em]
&&    =&\ \frac{x^2 + 4 + 4x - 4}{x}    &&\underset{\rule{0.8\linewidth}{0.4pt}}{\text{}}\\[2em]
&&    =&\ \frac{x^2 + 4x}{x}            &&\underset{\rule{0.8\linewidth}{0.4pt}}{\text{}}\\[2em]
&&    =&\ x + 4                    &&\underset{\rule{0.8\linewidth}{0.4pt}}{\text{}}\\[2em]
\end{align*}
```
