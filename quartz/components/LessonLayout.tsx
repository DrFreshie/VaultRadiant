import { htmlToJsx } from "../util/jsx"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import styles from "./styles/LessonLayout.scss"

export default (() => {
  function LessonLayout({ fileData, tree }: QuartzComponentProps) {
    const fm = fileData.frontmatter ?? {}
    const content = htmlToJsx(fileData.filePath!, tree)

    return (
      <article class="lesson-page">
        <section class="lesson-section">
          <div class="lesson-content popover-hint">
            {content}
          </div>
        </section>
      </article>
    )
  }

  LessonLayout.css = styles
  return LessonLayout
}) satisfies QuartzComponentConstructor
