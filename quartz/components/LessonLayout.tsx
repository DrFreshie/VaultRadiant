import { htmlToJsx } from "../util/jsx"
import { FullSlug, resolveRelative } from "../util/path"
import { Element, Root, RootContent } from "hast"
import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import styles from "./styles/LessonLayout.scss"

function isElement(node: RootContent): node is Element {
  return node.type === "element"
}

function textContent(node: RootContent): string {
  if (node.type === "text") return node.value
  if (!isElement(node) || !node.children) return ""
  return node.children.map((child) => textContent(child as RootContent)).join("")
}

function stripLeadingLessonTitle(tree: Root, theme?: string) {
  const children = [...tree.children]
  const titleIndex = children.findIndex((node) => isElement(node) && node.tagName === "h1")
  if (titleIndex === -1) return tree

  children.splice(titleIndex, 1)

  for (let i = titleIndex; i < children.length; i++) {
    const node = children[i]

    if (isElement(node) && node.tagName === "hr") {
      children.splice(i, 1)
      break
    }

    if (node.type === "text" && node.value.trim() === "") {
      continue
    }

    break
  }

  if (theme) {
    for (let i = titleIndex; i < children.length; i++) {
      const node = children[i]

      if (node.type === "text" && node.value.trim() === "") {
        continue
      }

      if (isElement(node) && node.tagName === "p" && textContent(node).trim().toLowerCase() == theme.trim().toLowerCase()) {
        children.splice(i, 1)
      }

      break
    }
  }

  return { ...tree, children }
}

export default (() => {
  function LessonLayout({ cfg, fileData, tree }: QuartzComponentProps) {
    const date = fileData.dates ? getDate(cfg, fileData) : undefined
    const theme = fileData.frontmatter?.theme
    const themeSlug = fileData.slug ? (fileData.slug.split("/").slice(0, -1).join("/") as FullSlug) : undefined
    const themeHref = fileData.slug && themeSlug ? resolveRelative(fileData.slug, themeSlug) : undefined
    const contentTree = tree.type === "root" ? stripLeadingLessonTitle(tree as Root, typeof theme === "string" ? theme : undefined) : tree
    const content = htmlToJsx(fileData.filePath!, contentTree)

    return (
      <article class="lesson-page">
        <section class="lesson-section">
          <div class="lesson-content popover-hint">
            {fileData.frontmatter?.title ? (
              <>
                <h1>{fileData.frontmatter.title}</h1>
                {date ? <p class="lesson-date">{formatDate(date, cfg.locale)}</p> : null}
                <hr class="lesson-meta-divider" />
                {theme ? (
                  <p class="lesson-theme">
                    {themeHref ? <a href={themeHref} class="internal">{theme}</a> : theme}
                  </p>
                ) : null}
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
