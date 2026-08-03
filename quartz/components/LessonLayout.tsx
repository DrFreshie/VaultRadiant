import { htmlToJsx } from "../util/jsx"
import { Element, Root, RootContent } from "hast"
import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import styles from "./styles/LessonLayout.scss"

function isElement(node: RootContent): node is Element {
  return node.type === "element"
}

function stripLeadingLessonTitle(tree: Root) {
  const children = [...tree.children]
  const titleIndex = children.findIndex((node) => isElement(node) && node.tagName === "h1")
  if (titleIndex === -1) return tree

  children.splice(titleIndex, 1)

  const nextNode = children[titleIndex]
  if (nextNode && isElement(nextNode) && nextNode.tagName === "hr") {
    children.splice(titleIndex, 1)
  }

  return { ...tree, children }
}

export default (() => {
  function LessonLayout({ cfg, fileData, tree }: QuartzComponentProps) {
    const date = fileData.dates ? getDate(cfg, fileData) : undefined
    const contentTree = tree.type === "root" ? stripLeadingLessonTitle(tree as Root) : tree
    const content = htmlToJsx(fileData.filePath!, contentTree)

    return (
      <article class="lesson-page">
        <section class="lesson-section">
          <div class="lesson-content popover-hint">
            {fileData.frontmatter?.title ? (
              <>
                <h1>{fileData.frontmatter.title}</h1>
                {date ? <p class="lesson-date">{formatDate(date, cfg.locale)}</p> : null}
              </>
            ) : null}
            {content}
          </div>
        </section>
      </article>
    )
  }

  LessonLayout.css = styles
  return LessonLayout
}) satisfies QuartzComponentConstructor
