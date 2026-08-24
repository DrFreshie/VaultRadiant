// @ts-ignore
import minuteCrypticScript from "./scripts/minutecryptic.inline"
import minuteCrypticStyle from "./styles/minutecryptic.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const MinuteCrypticScript: QuartzComponent = () => <></>

MinuteCrypticScript.afterDOMLoaded = minuteCrypticScript
MinuteCrypticScript.css = minuteCrypticStyle

export default (() => MinuteCrypticScript) satisfies QuartzComponentConstructor
