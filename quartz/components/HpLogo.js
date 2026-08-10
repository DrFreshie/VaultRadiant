import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "./styles/hpLogo.scss";
export default (() => {
    const PrimeRadiantAside = (_props) => {
        return (_jsxs("aside", { class: "prime-radiant", children: [_jsxs("div", { class: "prime-radiant__title", children: [_jsx("span", { class: "prime-radiant__line prime-radiant__line--vault", children: "VAULT" }), _jsx("span", { class: "prime-radiant__line prime-radiant__line--radiant", children: "RADIANT" })] }), _jsx("div", { class: "prime-radiant__image-wrapper", children: _jsx("img", { src: "/static/logo3.png", alt: "Prime Radiant", class: "prime-radiant__image" }) }), _jsxs("figure", { class: "prime-radiant__quote", children: [_jsx("blockquote", { children: "\u201CStudying the Prime Radiant, acre by acre, has its uses \u2013 but observing it as a continent is inspirational.\"" }), _jsxs("figcaption", { children: ["\u2013 Isaac Asimov, ", _jsx("em", { children: "Foundation" })] })] })] }));
    };
    PrimeRadiantAside.css = style;
    return PrimeRadiantAside;
});
