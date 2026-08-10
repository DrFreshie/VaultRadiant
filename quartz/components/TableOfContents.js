import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import legacyStyle from "./styles/legacyToc.scss";
import modernStyle from "./styles/toc.scss";
import { classNames } from "../util/lang";
// @ts-ignore
import script from "./scripts/toc.inline";
import { i18n } from "../i18n";
import OverflowListFactory from "./OverflowList";
import { concatenateResources } from "../util/resources";
const defaultOptions = {
    layout: "modern",
};
let numTocs = 0;
export default ((opts) => {
    const layout = opts?.layout ?? defaultOptions.layout;
    const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory();
    const TableOfContents = ({ fileData, displayClass, cfg, }) => {
        if (!fileData.toc) {
            return null;
        }
        const id = `toc-${numTocs++}`;
        return (_jsxs("div", { class: classNames(displayClass, "toc"), children: [_jsxs("button", { type: "button", class: fileData.collapseToc ? "collapsed toc-header" : "toc-header", "aria-controls": id, "aria-expanded": !fileData.collapseToc, children: [_jsx("h3", { children: i18n(cfg.locale).components.tableOfContents.title }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "fold", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) })] }), _jsx(OverflowList, { id: id, class: fileData.collapseToc ? "collapsed toc-content" : "toc-content", children: fileData.toc.map((tocEntry) => (_jsx("li", { class: `depth-${tocEntry.depth}`, children: _jsx("a", { href: `#${tocEntry.slug}`, "data-for": tocEntry.slug, children: tocEntry.text }) }, tocEntry.slug))) })] }));
    };
    TableOfContents.css = modernStyle;
    TableOfContents.afterDOMLoaded = concatenateResources(script, overflowListAfterDOMLoaded);
    const LegacyTableOfContents = ({ fileData, cfg }) => {
        if (!fileData.toc) {
            return null;
        }
        return (_jsxs("details", { class: "toc", open: !fileData.collapseToc, children: [_jsx("summary", { children: _jsx("h3", { children: i18n(cfg.locale).components.tableOfContents.title }) }), _jsx("ul", { children: fileData.toc.map((tocEntry) => (_jsx("li", { class: `depth-${tocEntry.depth}`, children: _jsx("a", { href: `#${tocEntry.slug}`, "data-for": tocEntry.slug, children: tocEntry.text }) }, tocEntry.slug))) })] }));
    };
    LegacyTableOfContents.css = legacyStyle;
    return layout === "modern" ? TableOfContents : LegacyTableOfContents;
});
