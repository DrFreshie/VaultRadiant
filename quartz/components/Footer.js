import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "./styles/footer.scss";
import { version } from "../../package.json";
import { i18n } from "../i18n";
import { classNames } from "../util/lang";
import { resolveRelative } from "../util/path";
export default ((opts) => {
    const Footer = ({ displayClass, cfg, fileData }) => {
        const year = new Date().getFullYear();
        const links = opts?.links ?? {};
        // grab tags from frontmatter (or empty array)
        const tags = (fileData.frontmatter?.tags ?? []);
        return (_jsxs("footer", { class: displayClass ?? "", children: [_jsx("hr", {}), _jsx("ul", { class: classNames(displayClass, "tags"), children: tags.map((tag) => {
                        const linkDest = resolveRelative(fileData.slug, `tags/${tag}`);
                        return (_jsx("li", { children: _jsx("a", { href: linkDest, class: "internal tag-link", children: tag }) }));
                    }) }), _jsxs("p", { children: [i18n(cfg.locale).components.footer.createdWith, " ", _jsxs("a", { href: "https://quartz.jzhao.xyz/", children: ["Quartz v", version] }), " \u00A9 ", year] }), Object.keys(links).length > 0 && (_jsx("ul", { children: Object.entries(links).map(([text, link]) => (_jsx("li", { children: _jsx("a", { href: link, children: text }) }))) }))] }));
    };
    Footer.css = style;
    return Footer;
});
