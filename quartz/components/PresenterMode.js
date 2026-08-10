import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
// @ts-ignore
import presenterModeScript from "./scripts/presentermode.inline";
import styles from "./styles/presentermode.scss";
import { classNames } from "../util/lang";
const PresenterMode = ({ displayClass }) => {
    return (_jsx("button", { class: classNames(displayClass, "presentermode"), "aria-label": "Presenter Mode", children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round", children: [_jsx("title", { children: "Presenter Mode" }), _jsx("rect", { x: "3", y: "4", width: "18", height: "14", rx: "2" }), _jsx("path", { d: "M8 20h8" }), _jsx("path", { d: "M12 18v2" }), _jsx("path", { d: "M8 9h8" })] }) }));
};
PresenterMode.afterDOMLoaded = presenterModeScript;
PresenterMode.css = styles;
export default (() => PresenterMode);
