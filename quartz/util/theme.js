const DEFAULT_SANS_SERIF = 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
const DEFAULT_MONO = "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace";
export function getFontSpecificationName(spec) {
    if (typeof spec === "string") {
        return spec;
    }
    return spec.name;
}
function formatFontSpecification(type, spec) {
    if (typeof spec === "string") {
        spec = { name: spec };
    }
    const defaultIncludeWeights = type === "header" ? [400, 700] : [400, 600];
    const defaultIncludeItalic = type === "body";
    const weights = spec.weights ?? defaultIncludeWeights;
    const italic = spec.includeItalic ?? defaultIncludeItalic;
    const features = [];
    if (italic) {
        features.push("ital");
    }
    if (weights.length > 1) {
        const weightSpec = italic
            ? weights
                .flatMap((w) => [`0,${w}`, `1,${w}`])
                .sort()
                .join(";")
            : weights.join(";");
        features.push(`wght@${weightSpec}`);
    }
    if (features.length > 0) {
        return `${spec.name}:${features.join(",")}`;
    }
    return spec.name;
}
export function googleFontHref(theme) {
    const { header, body, code } = theme.typography;
    const headerFont = formatFontSpecification("header", header);
    const bodyFont = formatFontSpecification("body", body);
    const codeFont = formatFontSpecification("code", code);
    return `https://fonts.googleapis.com/css2?family=${headerFont}&family=${bodyFont}&family=${codeFont}&display=swap`;
}
export function googleFontSubsetHref(theme, text) {
    const title = theme.typography.title || theme.typography.header;
    const titleFont = formatFontSpecification("title", title);
    return `https://fonts.googleapis.com/css2?family=${titleFont}&text=${encodeURIComponent(text)}&display=swap`;
}
const fontMimeMap = {
    truetype: "ttf",
    woff: "woff",
    woff2: "woff2",
    opentype: "otf",
};
export async function processGoogleFonts(stylesheet, baseUrl) {
    const fontSourceRegex = /url\((https:\/\/fonts.gstatic.com\/.+(?:\/|(?:kit=))(.+?)[.&].+?)\)\sformat\('(\w+?)'\);/g;
    const fontFiles = [];
    let processedStylesheet = stylesheet;
    let match;
    while ((match = fontSourceRegex.exec(stylesheet)) !== null) {
        const url = match[1];
        const filename = match[2];
        const extension = fontMimeMap[match[3].toLowerCase()];
        const staticUrl = `https://${baseUrl}/static/fonts/${filename}.${extension}`;
        processedStylesheet = processedStylesheet.replace(url, staticUrl);
        fontFiles.push({ url, filename, extension });
    }
    return { processedStylesheet, fontFiles };
}
export function joinStyles(theme, ...stylesheet) {
    return `
${stylesheet.join("\n\n")}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};
  --textHighlight: ${theme.colors.lightMode.textHighlight};

  --titleFont: "${getFontSpecificationName(theme.typography.title || theme.typography.header)}", ${DEFAULT_SANS_SERIF};
  --headerFont: "${getFontSpecificationName(theme.typography.header)}", ${DEFAULT_SANS_SERIF};
  --bodyFont: "${getFontSpecificationName(theme.typography.body)}", ${DEFAULT_SANS_SERIF};
  --codeFont: "${getFontSpecificationName(theme.typography.code)}", ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
  --textHighlight: ${theme.colors.darkMode.textHighlight};
}
`;
}
