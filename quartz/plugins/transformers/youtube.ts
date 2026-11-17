import type { Root } from "hast"
import { visit } from "unist-util-visit"
import type { QuartzTransformerPlugin } from "../types"

export function youtubeEmbedUrl(source: string): string | undefined {
  let url: URL
  try {
    url = new URL(source)
  } catch {
    return
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return
  const host = url.hostname.toLowerCase()
  let id: string | null | undefined
  if (host === "youtu.be" || host === "www.youtu.be") {
    id = url.pathname.split("/")[1]
  } else if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) {
    id = url.pathname === "/watch"
      ? url.searchParams.get("v")
      : /^\/(?:embed|shorts|live)\/([^/]+)/.exec(url.pathname)?.[1]
  }
  if (!id || !/^[\w-]{11}$/.test(id)) return
  const embed = new URL(`https://www.youtube.com/embed/${id}`)
  const time = url.searchParams.get("start") ?? url.searchParams.get("t")
  if (time) {
    const parts = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(time)
    if (parts && parts[0]) {
      const seconds = Number(parts[1] ?? 0) * 3600 + Number(parts[2] ?? 0) * 60 + Number(parts[3] ?? 0)
      if (seconds > 0) embed.searchParams.set("start", String(seconds))
    }
  }
  return embed.toString()
}

export function layoutYouTubeEmbeds(tree: Root) {
  visit(tree, "element", (node) => {
    if (node.tagName !== "p") return
    const contents = node.children.filter((child) => child.type !== "text" || child.value.trim() !== "")
    if (contents.length !== 1) return
    const image = contents[0]
    if (image.type !== "element" || image.tagName !== "img" || image.properties.title !== "youtube") return
    const src = youtubeEmbedUrl(String(image.properties.src ?? ""))
    if (!src) return
    node.tagName = "div"
    node.properties = { className: ["youtube-embed"], style: "position:relative; width:100%; aspect-ratio:16/9;" }
    node.children = [{
      type: "element",
      tagName: "iframe",
      properties: {
        src,
        title: String(image.properties.alt || "YouTube video"),
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        referrerPolicy: "strict-origin-when-cross-origin",
        allowFullScreen: true,
        style: "position:absolute; inset:0; width:100%; max-width:100%; height:100%; margin:0; border:none; border-radius:8px;",
      },
      children: [],
    }]
  })
}

export const YouTube: QuartzTransformerPlugin = () => ({
  name: "YouTube",
  htmlPlugins() {
    return [() => layoutYouTubeEmbeds]
  },
})
