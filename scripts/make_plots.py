#!/usr/bin/env python3

import json
import subprocess
import sys
from pathlib import Path


def gp_string(value: str) -> str:
    return '"' + value.replace('\\', '\\\\').replace('"', '\\"') + '"'


def build_gnuplot_script(output_path: Path, expr: str, title: str | None) -> str:
    lines = [
        "set terminal pngcairo size 2000,1400 enhanced font 'Helvetica,26'",
        f"set output {gp_string(str(output_path))}",
        "set xrange [-5.2:5.2]",
        "set yrange [-10.5:10.5]",
        "unset border",
        "unset key",
        "unset xlabel",
        "unset ylabel",
        "unset x2tics",
        "unset y2tics",
        "set style line 1 lc rgb '#9aa4ae' lw 1.8",
        "set style line 2 lc rgb '#222222' lw 1.5",
        "set xtics 1",
        "set ytics 1",
        "unset mxtics",
        "unset mytics",
        "set format x '%g'",
        "set format y '%g'",
        "set tics axis nomirror out scale 0.5,0.3 tc rgb '#2b2b2b'",
        "set grid back xtics ytics ls 1",
        "set xzeroaxis ls 2",
        "set yzeroaxis ls 2",
        "unset arrow",
        "set arrow 101 from graph 1,first 0 to graph 1.012,first 0 head filled size screen 0.010,16,45 lw 1.4 lc rgb '#222222' front",
        "set arrow 102 from first 0,graph 1 to first 0,graph 1.012 head filled size screen 0.010,16,45 lw 1.4 lc rgb '#222222' front",
    ]

    if title:
        lines.append(f"set title {gp_string(title)} tc rgb '#222222' font ',28'")
    else:
        lines.append("unset title")

    lines.append(f"plot {expr} lw 3.6 lc rgb '#2d9b4c'")
    return "\n".join(lines) + "\n"


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/make_plots.py <spec.json>")
        return 1

    spec_path = Path(sys.argv[1]).resolve()
    with spec_path.open("r", encoding="utf-8") as f:
        spec = json.load(f)

    output_dir = Path(spec["output_dir"]).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    plots = spec.get("plots", [])
    if not plots:
        print("No plots in spec")
        return 1

    for plot in plots:
        name = plot["name"]
        expr = plot["expr"]
        title = plot.get("title")
        out_path = output_dir / name

        gp_script = build_gnuplot_script(out_path, expr, title)
        subprocess.run(["gnuplot", "-e", gp_script], check=True)
        print(out_path)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
