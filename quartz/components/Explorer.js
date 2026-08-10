import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "./styles/explorer.scss";
// @ts-ignore
import script from "./scripts/explorer.inline";
import { classNames } from "../util/lang";
import { i18n } from "../i18n";
import OverflowListFactory from "./OverflowList";
import { concatenateResources } from "../util/resources";
const defaultOptions = {
    folderDefaultState: "collapsed",
    folderClickBehavior: "link",
    useSavedState: true,
    mapFn: (node) => {
        return node;
    },
    sortFn: (a, b) => {
        // Sort order: folders first, then files. Sort folders and files alphabeticall
        if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
            // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
            // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
            return a.displayName.localeCompare(b.displayName, undefined, {
                numeric: true,
                sensitivity: "base",
            });
        }
        if (!a.isFolder && b.isFolder) {
            return 1;
        }
        else {
            return -1;
        }
    },
    filterFn: (node) => node.slugSegment !== "tags",
    order: ["filter", "map", "sort"],
};
let numExplorers = 0;
export default ((userOpts) => {
    const opts = { ...defaultOptions, ...userOpts };
    const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory();
    const Explorer = (props) => {
        const { cfg, displayClass } = props;
        const id = `explorer-${numExplorers++}`;
        const resolvedTitle = typeof opts.title === "function" ? opts.title(props) : opts.title;
        return (_jsxs("div", { class: classNames(displayClass, "explorer"), "data-behavior": opts.folderClickBehavior, "data-collapsed": opts.folderDefaultState, "data-savestate": opts.useSavedState, "data-data-fns": JSON.stringify({
                order: opts.order,
                sortFn: opts.sortFn.toString(),
                filterFn: opts.filterFn.toString(),
                mapFn: opts.mapFn.toString(),
            }), children: [_jsx("button", { type: "button", class: "explorer-toggle mobile-explorer hide-until-loaded", "data-mobile": true, "aria-controls": id, children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide-menu", children: [_jsx("line", { x1: "4", x2: "20", y1: "12", y2: "12" }), _jsx("line", { x1: "4", x2: "20", y1: "6", y2: "6" }), _jsx("line", { x1: "4", x2: "20", y1: "18", y2: "18" })] }) }), _jsxs("button", { type: "button", class: "title-button explorer-toggle desktop-explorer", "data-mobile": false, "aria-expanded": true, children: [_jsx("h2", { children: resolvedTitle ?? i18n(cfg.locale).components.explorer.title }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "5 8 14 8", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "fold", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) })] }), _jsx("div", { id: id, class: "explorer-content", "aria-expanded": false, role: "group", children: _jsx(OverflowList, { class: "explorer-ul" }) }), _jsx("template", { id: "template-file", children: _jsx("li", { children: _jsx("a", { href: "#" }) }) }), _jsx("template", { id: "template-folder", children: _jsxs("li", { children: [_jsxs("div", { class: "folder-container", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "5 8 14 8", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "folder-icon", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) }), _jsx("div", { children: _jsx("button", { class: "folder-button", children: _jsx("span", { class: "folder-title" }) }) })] }), _jsx("div", { class: "folder-outer", children: _jsx("ul", { class: "content" }) })] }) })] }));
    };
    Explorer.css = style;
    Explorer.afterDOMLoaded = concatenateResources(script, overflowListAfterDOMLoaded);
    return Explorer;
});
