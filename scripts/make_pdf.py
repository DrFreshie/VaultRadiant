#!/usr/bin/env python3

import re
import sys
from pathlib import Path

from PIL import Image


def natural_key(path: Path):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", path.stem)]


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python3 scripts/make_pdf.py <image_dir> <output.pdf>")
        return 1

    image_dir = Path(sys.argv[1]).resolve()
    out_pdf = Path(sys.argv[2]).resolve()

    images = sorted(image_dir.glob("*.png"), key=natural_key)
    if not images:
        print(f"No PNG files found in {image_dir}")
        return 1

    pil_images = []
    for img_path in images:
        img = Image.open(img_path)
        if img.mode != "RGB":
            img = img.convert("RGB")
        pil_images.append(img)

    first, rest = pil_images[0], pil_images[1:]
    first.save(out_pdf, save_all=True, append_images=rest)

    for img in pil_images:
        img.close()

    print(out_pdf)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
