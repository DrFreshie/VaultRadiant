import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "./styles/logo.scss";
export default (() => {
    const PrimeRadiantAside = (_props) => {
        return (_jsx("aside", { class: "prime-radiant", children: _jsxs("a", { href: "/", class: "prime-radiant__link", children: [_jsxs("div", { class: "prime-radiant__title", children: [_jsx("span", { class: "prime-radiant__line prime-radiant__line--vault", children: "VAULT" }), _jsx("span", { class: "prime-radiant__line prime-radiant__line--radiant", children: "RADIANT" })] }), _jsxs("div", { class: "prime-radiant__image-wrapper", children: [_jsx("img", { src: "/static/logov3.png", alt: "Prime Radiant", class: "prime-radiant__image prime-radiant__image--default" }), _jsx("img", { src: "/static/logov3_2.png", alt: "Prime Radiant", class: "prime-radiant__image prime-radiant__image--hover" })] }), _jsxs("figure", { class: "prime-radiant__quote", children: [_jsx("blockquote", { children: "\"Studying the Prime Radiant, acre by acre, has its uses \u2013 but observing it as a continent is inspirational.\"" }), _jsxs("figcaption", { children: ["\u2013 Isaac Asimov, ", _jsx("em", { children: "Foundation" })] })] })] }) }));
    };
    PrimeRadiantAside.css = style;
    return PrimeRadiantAside;
});
