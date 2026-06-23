import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/figureViewer.inline"
import style from "./styles/figureViewer.scss"
import { classNames } from "../util/lang"

export default (() => {
  const FigureViewer: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    if (!fileData.slug?.startsWith("noter/matematik")) {
      return <></>
    }

    return (
      <div class={classNames(displayClass, "figure-viewer")}>
        <div class="figure-viewer-panel"></div>
      </div>
    )
  }

  FigureViewer.css = style
  FigureViewer.afterDOMLoaded = script

  return FigureViewer
}) satisfies QuartzComponentConstructor
