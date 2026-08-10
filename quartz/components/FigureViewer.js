import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
// @ts-ignore
import script from "./scripts/figureViewer.inline";
import style from "./styles/figureViewer.scss";
import { classNames } from "../util/lang";
export default (() => {
    const FigureViewer = ({ fileData, displayClass }) => {
        if (!fileData.slug?.startsWith("noter/matematik")) {
            return _jsx(_Fragment, {});
        }
        return (_jsx("div", { class: classNames(displayClass, "figure-viewer"), children: _jsx("div", { class: "figure-viewer-panel" }) }));
    };
    FigureViewer.css = style;
    FigureViewer.afterDOMLoaded = script;
    return FigureViewer;
});
