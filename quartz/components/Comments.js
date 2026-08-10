import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
import { classNames } from "../util/lang";
// @ts-ignore
import script from "./scripts/comments.inline";
function boolToStringBool(b) {
    return b ? "1" : "0";
}
export default ((opts) => {
    const Comments = ({ displayClass, fileData, cfg }) => {
        // check if comments should be displayed according to frontmatter
        const disableComment = typeof fileData.frontmatter?.comments !== "undefined" &&
            (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false");
        if (disableComment) {
            return _jsx(_Fragment, {});
        }
        return (_jsx("div", { class: classNames(displayClass, "giscus"), "data-repo": opts.options.repo, "data-repo-id": opts.options.repoId, "data-category": opts.options.category, "data-category-id": opts.options.categoryId, "data-mapping": opts.options.mapping ?? "url", "data-strict": boolToStringBool(opts.options.strict ?? true), "data-reactions-enabled": boolToStringBool(opts.options.reactionsEnabled ?? true), "data-input-position": opts.options.inputPosition ?? "bottom", "data-light-theme": opts.options.lightTheme ?? "light", "data-dark-theme": opts.options.darkTheme ?? "dark", "data-theme-url": opts.options.themeUrl ?? `https://${cfg.baseUrl ?? "example.com"}/static/giscus`, "data-lang": opts.options.lang ?? "en" }));
    };
    Comments.afterDOMLoaded = script;
    return Comments;
});
