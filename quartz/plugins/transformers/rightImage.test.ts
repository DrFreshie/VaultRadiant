import assert from "node:assert/strict"
import { test } from "node:test"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { toHtml } from "hast-util-to-html"
import { layoutRightImages } from "./rightImage"

async function render(markdown: string) {
  const processor = unified().use(remarkParse).use(remarkRehype)
  const tree = await processor.run(processor.parse(markdown))
  layoutRightImages(tree)
  return toHtml(tree)
}

test("places preceding Markdown content beside the image, leaving headings outside", async () => {
  const html = await render('## Reading\n\nIntro\n\n1. Read **this**.\n\n![Reading](reading.png "right")\n\n## Next\n\nOther')
  assert.match(html, /<h2>Reading<\/h2>\s*<div class="right-image-layout">/)
  assert.match(html, /<strong>this<\/strong>/)
  assert.match(html, /class="right-image-media"><img src="reading.png" alt="Reading">/)
  assert.match(html, /<\/div>\s*<h2>Next<\/h2>/)
})

test("does not cross slide breaks or affect ordinary images", async () => {
  const html = await render('## Heading\n\nEarlier\n\n---\n\nLater\n\n![Image](image.png "right")\n\n![Normal](normal.png)')
  assert.match(html, /<p>Earlier<\/p>\s*<hr>\s*<div class="right-image-layout">/)
  assert.match(html, /<p><img src="normal.png" alt="Normal"><\/p>/)
})

test("left places the image before preceding content", async () => {
  const html = await render('## Reading\n\n1. Read **this**.\n\n![Reading](reading.png "left")')
  assert.match(html, /class="right-image-layout left-image-layout"/)
  assert.ok(html.indexOf('class="right-image-media"') < html.indexOf('class="right-image-content"'))
  assert.match(html, /<strong>this<\/strong>/)
  assert.doesNotMatch(html, /title="left"/)
})

test("center stays below the text and also works without preceding text", async () => {
  const html = await render('## Reading\n\nIntro\n\n![Reading](reading.png "center")\n\n## Image only\n\n![Only](only.png "center")')
  assert.match(html, /<p>Intro<\/p>\s*<p class="center-image-layout"><img src="reading.png" alt="Reading"><\/p>/)
  assert.match(html, /<h2>Image only<\/h2>\s*<p class="center-image-layout">/)
  assert.doesNotMatch(html, /right-image-layout|title="center"/)
})

test("leaves markers without preceding content and inline images unchanged", async () => {
  const html = await render('## Heading\n\n![Empty](empty.png "right")\n\nText ![Inline](inline.png "right")')
  assert.doesNotMatch(html, /right-image-layout/)
})
