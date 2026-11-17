import type { Element, Root } from "hast"
import type { QuartzTransformerPlugin } from "../types"

// Standalone images titled "left"/"right" flank preceding section content.
// "center" centers the image below the content without regrouping it.
export function layoutRightImages(tree: Root) {
  const children = tree.children
  let start = 0
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (node.type !== "element") continue
    if (/^h[1-6]$/.test(node.tagName) || node.tagName === "hr") {
      start = i + 1
      continue
    }
    if (node.tagName !== "p") continue
    const contents = node.children.filter(
      (child) => child.type !== "text" || child.value.trim() !== "",
    )
    if (contents.length !== 1) continue
    const image = contents[0]
    if (image.type !== "element" || image.tagName !== "img") continue
    const position = image.properties.title
    if (position !== "right" && position !== "left" && position !== "center") continue
    if (position === "center") {
      delete image.properties.title
      node.properties.className = ["center-image-layout"]
      start = i + 1
      continue
    }
    const preceding = children.slice(start, i)
    if (!preceding.some((child) => child.type !== "text" || child.value.trim() !== "")) continue
    delete image.properties.title
    const layout: Element = {
      type: "element",
      tagName: "div",
      properties: {
        className: position === "left"
          ? ["right-image-layout", "left-image-layout"]
          : ["right-image-layout"],
      },
      children: [
        {
          type: "element",
          tagName: "div",
          properties: { className: ["right-image-content"] },
          children: preceding as Element["children"],
        },
        {
          type: "element",
          tagName: "div",
          properties: { className: ["right-image-media"] },
          children: [image],
        },
      ],
    }
    if (position === "left") layout.children.reverse()
    children.splice(start, i - start + 1, layout)
    i = start
    start = i + 1
  }
}

export const RightImage: QuartzTransformerPlugin = () => ({
  name: "RightImage",
  htmlPlugins() {
    return [() => layoutRightImages]
  },
})
