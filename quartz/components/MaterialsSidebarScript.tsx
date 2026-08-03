// @ts-ignore
import script from "./scripts/materials-sidebar.inline"
import style from "./styles/materials-sidebar.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const MaterialsSidebarScript: QuartzComponent = () => <></>

MaterialsSidebarScript.afterDOMLoaded = script
MaterialsSidebarScript.css = style

export default (() => MaterialsSidebarScript) satisfies QuartzComponentConstructor
