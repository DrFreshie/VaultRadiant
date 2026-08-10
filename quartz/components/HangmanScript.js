import { Fragment as _Fragment, jsx as _jsx } from "preact/jsx-runtime";
// @ts-ignore
import hangmanScript from "./scripts/hangman.inline";
import hangmanStyle from "./styles/hangman.scss";
const HangmanScript = () => _jsx(_Fragment, {});
HangmanScript.afterDOMLoaded = hangmanScript;
HangmanScript.css = hangmanStyle;
export default (() => HangmanScript);
