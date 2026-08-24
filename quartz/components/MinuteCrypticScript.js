import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime"
// @ts-ignore
import minuteCrypticScript from "./scripts/minutecryptic.inline"
import minuteCrypticStyle from "./styles/minutecryptic.scss"
const MinuteCrypticScript = () => _jsx(_Fragment, {})
MinuteCrypticScript.afterDOMLoaded = minuteCrypticScript
MinuteCrypticScript.css = minuteCrypticStyle
export default () => MinuteCrypticScript
