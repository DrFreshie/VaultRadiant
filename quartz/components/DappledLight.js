import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
const DappledLight = () => {
    return (_jsxs("div", { id: "dappled-light", children: [_jsx("div", { id: "glow" }), _jsx("div", { id: "glow-bounce" }), _jsxs("div", { class: "perspective", children: [_jsx("div", { id: "leaves" }), _jsxs("div", { id: "blinds", children: [_jsx("div", { class: "shutters", children: Array.from({ length: 23 }).map((_, i) => (_jsx("div", { class: "shutter" }, i))) }), _jsxs("div", { class: "vertical", children: [_jsx("div", { class: "bar" }), _jsx("div", { class: "bar" })] })] })] }), _jsxs("div", { id: "progressive-blur", children: [_jsx("div", {}), _jsx("div", {})] })] }));
};
export default (() => DappledLight);
