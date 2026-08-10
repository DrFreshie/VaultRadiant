import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { htmlToJsx } from "../util/jsx";
import { resolveRelative } from "../util/path";
import { formatDate, getDate } from "./Date";
import styles from "./styles/LessonLayout.scss";
function isElement(node) {
    return node.type === "element";
}
function textContent(node) {
    if (node.type === "text")
        return node.value;
    if (!isElement(node) || !node.children)
        return "";
    return node.children.map((child) => textContent(child)).join("");
}
function stripLeadingLessonTitle(tree, theme) {
    const children = [...tree.children];
    const titleIndex = children.findIndex((node) => isElement(node) && node.tagName === "h1");
    if (titleIndex === -1)
        return tree;
    children.splice(titleIndex, 1);
    for (let i = titleIndex; i < children.length; i++) {
        const node = children[i];
        if (isElement(node) && node.tagName === "hr") {
            children.splice(i, 1);
            break;
        }
        if (node.type === "text" && node.value.trim() === "") {
            continue;
        }
        break;
    }
    if (theme) {
        for (let i = titleIndex; i < children.length; i++) {
            const node = children[i];
            if (node.type === "text" && node.value.trim() === "") {
                continue;
            }
            if (isElement(node) && node.tagName === "p" && textContent(node).trim().toLowerCase() == theme.trim().toLowerCase()) {
                children.splice(i, 1);
            }
            break;
        }
    }
    return { ...tree, children };
}
export default (() => {
    function LessonLayout({ cfg, fileData, tree }) {
        const date = fileData.dates ? getDate(cfg, fileData) : undefined;
        const theme = fileData.frontmatter?.theme;
        const themeSlug = fileData.slug ? fileData.slug.split("/").slice(0, -1).join("/") : undefined;
        const themeHref = fileData.slug && themeSlug ? resolveRelative(fileData.slug, themeSlug) : undefined;
        const contentTree = tree.type === "root" ? stripLeadingLessonTitle(tree, typeof theme === "string" ? theme : undefined) : tree;
        const content = htmlToJsx(fileData.filePath, contentTree);
        return (_jsx("article", { class: "lesson-page", children: _jsx("section", { class: "lesson-section", children: _jsxs("div", { class: "lesson-content popover-hint", children: [fileData.frontmatter?.title ? (_jsxs(_Fragment, { children: [_jsx("h1", { children: fileData.frontmatter.title }), date ? _jsx("p", { class: "lesson-date", children: formatDate(date, cfg.locale) }) : null, _jsx("hr", { class: "lesson-meta-divider" }), theme ? (_jsx("p", { class: "lesson-theme", children: themeHref ? _jsx("a", { href: themeHref, class: "internal", children: theme }) : theme })) : null] })) : null, content] }) }) }));
    }
    LessonLayout.css = styles;
    return LessonLayout;
});
