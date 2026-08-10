import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { resolveRelative } from "../util/path";
import { byDateAndAlphabetical } from "./PageList";
import style from "./styles/recentNotes.scss";
import { Date, getDate } from "./Date";
import { i18n } from "../i18n";
import { classNames } from "../util/lang";
const defaultOptions = (cfg) => ({
    limit: 3,
    linkToMore: false,
    showTags: true,
    filter: () => true,
    sort: byDateAndAlphabetical(cfg),
});
export default ((userOpts) => {
    const RecentNotes = ({ allFiles, fileData, displayClass, cfg, }) => {
        const opts = { ...defaultOptions(cfg), ...userOpts };
        const pages = allFiles.filter(opts.filter).sort(opts.sort);
        const remaining = Math.max(0, pages.length - opts.limit);
        return (_jsxs("div", { class: classNames(displayClass, "recent-notes"), children: [_jsx("h3", { children: opts.title ?? i18n(cfg.locale).components.recentNotes.title }), _jsx("ul", { class: "recent-ul", children: pages.slice(0, opts.limit).map((page) => {
                        const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title;
                        const tags = page.frontmatter?.tags ?? [];
                        return (_jsx("li", { class: "recent-li", children: _jsxs("div", { class: "section", children: [_jsx("div", { class: "desc", children: _jsx("h3", { children: _jsx("a", { href: resolveRelative(fileData.slug, page.slug), class: "internal", children: title }) }) }), page.dates && (_jsx("p", { class: "meta", children: _jsx(Date, { date: getDate(cfg, page), locale: cfg.locale }) })), opts.showTags && (_jsx("ul", { class: "tags", children: tags.map((tag) => (_jsx("li", { children: _jsx("a", { class: "internal tag-link", href: resolveRelative(fileData.slug, `tags/${tag}`), children: tag }) }))) }))] }) }));
                    }) }), opts.linkToMore && remaining > 0 && (_jsx("p", { children: _jsx("a", { href: resolveRelative(fileData.slug, opts.linkToMore), children: i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining }) }) }))] }));
    };
    RecentNotes.css = style;
    return RecentNotes;
});
