// @ts-ignore
import presenterModeScript from "./scripts/presentermode.inline"
import styles from "./styles/presentermode.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const PresenterMode: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <button class={classNames(displayClass, "presentermode")} aria-label="Presenter Mode">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <title>Presenter Mode</title>
        <rect x="3" y="4" width="18" height="14" rx="2"></rect>
        <path d="M8 20h8"></path>
        <path d="M12 18v2"></path>
        <path d="M8 9h8"></path>
      </svg>
    </button>
  )
}

PresenterMode.afterDOMLoaded = presenterModeScript
PresenterMode.css = styles

export default (() => PresenterMode) satisfies QuartzComponentConstructor
