import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import breadcrumbsStyle from "./styles/breadcrumbs.scss";
import { resolveRelative, simplifySlug } from "../util/path";
import { classNames } from "../util/lang";
import { trieFromAllFiles } from "../util/ctx";
const defaultOptions = {
    spacerSymbol: "❯",
    rootName: "Home",
    resolveFrontmatterTitle: true,
    showCurrentPage: true,
};
function formatCrumb(displayName, baseSlug, currentSlug) {
    return {
        displayName: displayName.replaceAll("-", " "),
        path: resolveRelative(baseSlug, currentSlug),
    };
}
export default ((opts) => {
    const options = { ...defaultOptions, ...opts };
    const Breadcrumbs = ({ fileData, allFiles, displayClass, ctx, }) => {
        const trie = (ctx.trie ??= trieFromAllFiles(allFiles));
        const slugParts = fileData.slug.split("/");
        const pathNodes = trie.ancestryChain(slugParts);
        if (!pathNodes) {
            return null;
        }
        const crumbs = pathNodes.map((node, idx) => {
            const crumb = formatCrumb(node.displayName, fileData.slug, simplifySlug(node.slug));
            if (idx === 0) {
                crumb.displayName = options.rootName;
            }
            // For last node (current page), set empty path
            if (idx === pathNodes.length - 1) {
                crumb.path = "";
            }
            return crumb;
        });
        if (!options.showCurrentPage) {
            crumbs.pop();
        }
        return (_jsx("nav", { class: classNames(displayClass, "breadcrumb-container"), "aria-label": "breadcrumbs", children: crumbs.map((crumb, index) => (_jsxs("div", { class: "breadcrumb-element", children: [_jsx("a", { href: crumb.path, children: crumb.displayName }), index !== crumbs.length - 1 && _jsx("p", { children: ` ${options.spacerSymbol} ` })] }))) }));
    };
    Breadcrumbs.css = breadcrumbsStyle;
    return Breadcrumbs;
});
