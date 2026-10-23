#!/usr/bin/env python3
"""Regenerate isolated design experiments from the existing nine LaTeX texts.

Run: python3 content/materials/design_test/build.py (from any directory).
Requires lualatex, pdfseparate, pdfunite; ImageMagick is optional.
"""
from pathlib import Path
import concurrent.futures
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent
MATERIALS = ROOT.parent
# The source metadata is retained, not independently corrected or embellished.
EDITIONS = [
    ('Brave_New_World', 'modernist', 'Fiction / novel excerpt', 'Brave New World'),
    ('The_Dolls_House', 'story', 'Fiction / short story', 'The Doll’s House'),
    ('Have_You_Heard_of_Oscar_Wilde', 'essay', 'Non-fiction / personal essay', 'Have You Heard of Oscar Wilde?'),
    ('The_Adventures_of_Huckleberry_Finn', 'classic', 'Fiction / novel', 'Huckleberry Finn'),
    ('The_Fly_Nobody_Programmed', 'digital', 'Non-fiction / web post', 'The Fly Nobody Programmed'),
    ('The_Kentucky_Derby_is_Decadent_and_Depraved', 'reportage', 'Non-fiction / reportage', 'The Kentucky Derby'),
    ('New_Zealand_Prime_Minister_Addresses_United_Nations_General_Assembly', 'speech', 'Non-fiction / speech', 'United Nations General Assembly'),
    ('Typecast_as_a_Terrorist', 'commentary', 'Non-fiction / personal commentary', 'Typecast as a Terrorist'),
    ('We_Wear_the_Mask', 'poetry', 'Poetry', 'We Wear the Mask'),
]


def generate(edition):
    name, family, genre, running = edition
    target = ROOT / name
    target.mkdir(exist_ok=True)
    original = (MATERIALS / name / f'{name}.tex').read_text()
    text = original
    # None of these texts uses the template's optional underline commands.
    # Omit the unused ulem dependency (not installed on this system).
    text = re.sub(r'\\usepackage(?:\[normalem\])?\{ulem\}', '', text)
    for macro, font, fallback in [
        ('plantinb', 'Plantin MT Pro Bold Condensed', r'\newfontfamily\plantinb[Numbers=OldStyle,BoldFont={EB Garamond},FakeBold=1.5]{EB Garamond}'),
        ('plantin', 'Plantin MT Pro Semibold', r'\newfontfamily\plantin[Numbers=OldStyle,FakeBold=.6]{EB Garamond}'),
    ]:
        declaration = rf'\newfontfamily\{macro}[Numbers=OldStyle]{{{font}}}'
        text = text.replace(declaration, rf'\IfFontExistsTF{{{font}}}{{{declaration}}}{{{fallback}}}')
    # Only presentation commands change; retain every passage and source note.
    text = re.sub(r'(?m)^\s*\\(?:thispagestyle|pagestyle)\{(?:plain|empty)\}\s*$', '', text)
    config = (f'\\newcommand{{\\DesignFamily}}{{{family}}}\n'
              f'\\newcommand{{\\DesignGenre}}{{{genre}}}\n'
              f'\\newcommand{{\\RunningTitle}}{{{running}}}\n'
              '\\input{../anthology-style.tex}\n')
    text = text.replace(r'\begin{document}', config + r'\begin{document}', 1)
    # Local assets are copied so the experiment never changes the originals.
    text = re.sub(r'\\graphicspath\{[^\n]*', r'\\graphicspath{{./img/}}', text)
    for image in re.findall(r'\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}', original):
        candidates = [MATERIALS / name / 'img' / image, MATERIALS / 'img' / image]
        source = next((p for p in candidates if p.is_file()), None)
        if source is None:
            raise FileNotFoundError(image)
        (target / 'img').mkdir(exist_ok=True)
        shutil.copy2(source, target / 'img' / image)
    (target / f'{name}.tex').write_text('% Experimental copy; regenerate with ../build.py. Originals are untouched.\n' + text)
    return target, name


def compile_edition(item):
    target, name = item
    for _ in range(2):
        result = subprocess.run(['lualatex', '-interaction=nonstopmode', '-halt-on-error', f'{name}.tex'], cwd=target, capture_output=True, text=True)
        (target / 'build-output.txt').write_text(result.stdout + result.stderr)
        if result.returncode:
            raise RuntimeError(f'Build failed: {target / "build-output.txt"}')
    print(f'Built {name}', flush=True)
    return target / f'{name}.pdf'


def main():
    generated = [generate(edition) for edition in EDITIONS]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        pdfs = list(executor.map(compile_edition, generated))
    preview = ROOT / 'previews'
    preview.mkdir(exist_ok=True)
    openings = []
    for index, pdf in enumerate(pdfs, 1):
        opening = preview / f'{index:02d}-opening.pdf'
        subprocess.run(['pdfseparate', '-f', '1', '-l', '1', str(pdf), str(preview / f'{index:02d}-page-%d.pdf')], check=True)
        (preview / f'{index:02d}-page-1.pdf').replace(opening)
        openings.append(opening)
    subprocess.run(['pdfunite', *map(str, openings), str(ROOT / 'Opening_pages.pdf')], check=True)
    subprocess.run(['pdfunite', *map(str, pdfs), str(ROOT / 'All_texts.pdf')], check=True)
    if shutil.which('magick'):
        pngs = []
        for index, pdf in enumerate(openings, 1):
            prefix = preview / f'{index:02d}'
            subprocess.run(['pdftoppm', '-f', '1', '-singlefile', '-scale-to', '650', '-png', str(pdf), str(prefix)], check=True)
            pngs.append(str(prefix) + '.png')
        subprocess.run(['magick', 'montage', *pngs, '-tile', '3x3', '-geometry', '+14+14', '-background', '#e5e5e2', str(ROOT / 'Contact_sheet.png')], check=True)
    print(f'Comparison: {ROOT / "Opening_pages.pdf"}')


if __name__ == '__main__':
    main()
