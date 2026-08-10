import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
// @ts-ignore
import dappledLightScript from "./scripts/dappled-light.inline";
// Renders nothing — exists solely to register dappled-light.inline.ts via the
// layout system so ComponentResources picks it up and includes it in postscript.js.
const DappledLightScript = () => _jsx(_Fragment, {});
DappledLightScript.afterDOMLoaded = dappledLightScript;
export default (() => DappledLightScript);
