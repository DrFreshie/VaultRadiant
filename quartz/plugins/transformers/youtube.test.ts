import assert from "node:assert/strict"
import { test } from "node:test"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { toHtml } from "hast-util-to-html"
import { layoutYouTubeEmbeds, youtubeEmbedUrl } from "./youtube"

test("normalizes YouTube URLs and start times", () => {
  for (const url of [
    "https://youtu.be/2YWYSl3p6bc?t=1m30s",
    "https://www.youtube.com/watch?v=2YWYSl3p6bc&t=90",
    "https://www.youtube.com/embed/2YWYSl3p6bc?start=90",
    "https://m.youtube.com/shorts/2YWYSl3p6bc?t=90s",
    "https://youtube.com/live/2YWYSl3p6bc?t=90",
  ]) {
    assert.equal(youtubeEmbedUrl(url), "https://www.youtube.com/embed/2YWYSl3p6bc?start=90")
  }
})

test("rejects unrelated hosts, invalid IDs, and unsafe protocols", () => {
  for (const url of ["https://example.com/watch?v=2YWYSl3p6bc", "https://youtube.com.evil.test/watch?v=2YWYSl3p6bc", "javascript:alert(1)", "https://youtu.be/invalid", "not a URL"]) {
    assert.equal(youtubeEmbedUrl(url), undefined)
  }
})

test("renders only standalone youtube-marked images as responsive iframes", async () => {
  const processor = unified().use(remarkParse).use(remarkRehype)
  const markdown = '## Video\n\n![A video](https://youtu.be/2YWYSl3p6bc "youtube")\n\n![Normal](normal.png)\n\nInline ![Video](https://youtu.be/2YWYSl3p6bc "youtube")'
  const tree = await processor.run(processor.parse(markdown))
  layoutYouTubeEmbeds(tree)
  const html = toHtml(tree)
  assert.match(html, /class="youtube-embed"/)
  assert.match(html, /aspect-ratio:16\/9/)
  assert.match(html, /<iframe src="https:\/\/www.youtube.com\/embed\/2YWYSl3p6bc" title="A video"/)
  assert.match(html, /allowfullscreen/)
  assert.equal((html.match(/<iframe/g) ?? []).length, 1)
  assert.match(html, /<img src="normal.png"/)
})
