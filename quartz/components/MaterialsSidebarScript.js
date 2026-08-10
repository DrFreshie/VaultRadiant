import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
// @ts-ignore
import script from "./scripts/materials-sidebar.inline";
import style from "./styles/materials-sidebar.scss";
const MaterialsSidebarScript = () => _jsx(_Fragment, {});
MaterialsSidebarScript.afterDOMLoaded = script;
MaterialsSidebarScript.css = style;
export default (() => MaterialsSidebarScript);
