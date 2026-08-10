import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "./styles/backlinks.scss";
import { resolveRelative, simplifySlug } from "../util/path";
import { i18n } from "../i18n";
import { classNames } from "../util/lang";
import OverflowListFactory from "./OverflowList";
const defaultOptions = {
    hideWhenEmpty: true,
};
export default ((opts) => {
    const options = { ...defaultOptions, ...opts };
    const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory();
    const Backlinks = ({ fileData, allFiles, displayClass, cfg, }) => {
        const slug = simplifySlug(fileData.slug);
        const backlinkFiles = allFiles.filter((file) => file.links?.includes(slug));
        if (options.hideWhenEmpty && backlinkFiles.length == 0) {
            return null;
        }
        return (_jsxs("div", { class: classNames(displayClass, "backlinks"), children: [_jsx("h3", { children: i18n(cfg.locale).components.backlinks.title }), _jsx(OverflowList, { children: backlinkFiles.length > 0 ? (backlinkFiles.map((f) => (_jsx("li", { children: _jsx("a", { href: resolveRelative(fileData.slug, f.slug), class: "internal", children: f.frontmatter?.title }) })))) : (_jsx("li", { children: i18n(cfg.locale).components.backlinks.noBacklinksFound })) })] }));
    };
    Backlinks.css = style;
    Backlinks.afterDOMLoaded = overflowListAfterDOMLoaded;
    return Backlinks;
});
