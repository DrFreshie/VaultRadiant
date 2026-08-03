// @ts-ignore
import hangmanScript from "./scripts/hangman.inline"
import hangmanStyle from "./styles/hangman.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const HangmanScript: QuartzComponent = () => <></>

HangmanScript.afterDOMLoaded = hangmanScript
HangmanScript.css = hangmanStyle

export default (() => HangmanScript) satisfies QuartzComponentConstructor
