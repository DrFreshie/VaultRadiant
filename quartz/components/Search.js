import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "./styles/search.scss";
// @ts-ignore
import script from "./scripts/search.inline";
import { classNames } from "../util/lang";
import { i18n } from "../i18n";
const defaultOptions = {
    enablePreview: true,
};
export default ((userOpts) => {
    const Search = ({ displayClass, cfg }) => {
        const opts = { ...defaultOptions, ...userOpts };
        const searchPlaceholder = i18n(cfg.locale).components.search.searchBarPlaceholder;
        return (_jsxs("div", { class: classNames(displayClass, "search"), children: [_jsxs("button", { class: "search-button", children: [_jsxs("svg", { role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 19.9 19.7", children: [_jsx("title", { children: "Search" }), _jsxs("g", { class: "search-path", fill: "none", children: [_jsx("path", { "stroke-linecap": "square", d: "M18.5 18.3l-5.4-5.4" }), _jsx("circle", { cx: "8", cy: "8", r: "7" })] })] }), _jsx("p", { children: i18n(cfg.locale).components.search.title })] }), _jsx("div", { class: "search-container", children: _jsxs("div", { class: "search-space", children: [_jsx("input", { autocomplete: "off", class: "search-bar", name: "search", type: "text", "aria-label": searchPlaceholder, placeholder: searchPlaceholder }), _jsx("div", { class: "search-layout", "data-preview": opts.enablePreview })] }) })] }));
    };
    Search.afterDOMLoaded = script;
    Search.css = style;
    return Search;
});
