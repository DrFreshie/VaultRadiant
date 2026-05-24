// @ts-ignore
import dappledLightScript from "./scripts/dappled-light.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

// Renders nothing — exists solely to register dappled-light.inline.ts via the
// layout system so ComponentResources picks it up and includes it in postscript.js.
const DappledLightScript: QuartzComponent = () => <></>

DappledLightScript.afterDOMLoaded = dappledLightScript

export default (() => DappledLightScript) satisfies QuartzComponentConstructor
