import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
// @ts-ignore
import script from "./scripts/explorer-sections.inline";
import style from "./styles/explorer-sections.scss";
const ExplorerSectionsScript = () => _jsx(_Fragment, {});
ExplorerSectionsScript.afterDOMLoaded = script;
ExplorerSectionsScript.css = style;
export default (() => ExplorerSectionsScript);
