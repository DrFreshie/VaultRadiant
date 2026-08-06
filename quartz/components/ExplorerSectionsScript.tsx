// @ts-ignore
import script from "./scripts/explorer-sections.inline"
import style from "./styles/explorer-sections.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ExplorerSectionsScript: QuartzComponent = () => <></>

ExplorerSectionsScript.afterDOMLoaded = script
ExplorerSectionsScript.css = style

export default (() => ExplorerSectionsScript) satisfies QuartzComponentConstructor
