import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { i18n } from "../../i18n";
const NotFound = ({ cfg }) => {
    // If baseUrl contains a pathname after the domain, use this as the home link
    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`);
    const baseDir = url.pathname;
    return (_jsxs("article", { class: "popover-hint", children: [_jsx("h1", { children: "404" }), _jsx("p", { children: i18n(cfg.locale).pages.error.notFound }), _jsx("a", { href: baseDir, children: i18n(cfg.locale).pages.error.home })] }));
};
export default (() => NotFound);
