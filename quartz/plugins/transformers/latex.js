import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeMathjax from "rehype-mathjax/svg";
//@ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst";
export const Latex = (opts) => {
    const engine = opts?.renderEngine ?? "katex";
    const macros = opts?.customMacros ?? {};
    return {
        name: "Latex",
        markdownPlugins() {
            return [remarkMath];
        },
        htmlPlugins() {
            switch (engine) {
                case "katex": {
                    return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]];
                }
                case "typst": {
                    return [[rehypeTypst, opts?.typstOptions ?? {}]];
                }
                case "mathjax": {
                    return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]];
                }
                default: {
                    return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]];
                }
            }
        },
        externalResources() {
            switch (engine) {
                case "katex":
                    return {
                        css: [{ content: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" }],
                        js: [
                            {
                                // fix copy behaviour: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/README.md
                                src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",
                                loadTime: "afterDOMReady",
                                contentType: "external",
                            },
                        ],
                    };
            }
        },
    };
};
