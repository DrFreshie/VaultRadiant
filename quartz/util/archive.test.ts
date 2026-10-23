import assert from "node:assert/strict"
import { test } from "node:test"
import { archiveAssets, isArchiveSlug, resolveArchiveLink } from "./archive"
import { FilePath, FullSlug, slugifyFilePath } from "./path"
import { glob } from "./glob"
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const src = "archive/s26/math/lessons/index" as FullSlug
const slugs = [
  "archive/s26/math/notes/functions",
  "archive/s26/math/lessons/2026-05-05",
  "archive/s26/english/lessons/2026-05-05",
  "archive/s26/resources/sheet.pdf",
  "archive/s26/Eksamenssæt_B/Maj-25.pdf",
  "materials/functions",
] as FullSlug[]

test("archive URLs and downloadable materials", () => {
  assert.equal(slugifyFilePath(".archive/s26/index.md" as FilePath), "archive/s26/index")
  assert.equal(slugifyFilePath(".archive/s26/a b.pdf" as FilePath), "archive/s26/a-b.pdf")
  assert.equal(isArchiveSlug("archive/s26/index"), true)
  assert.equal(isArchiveSlug("archives/index"), false)
  const assets = archiveAssets([
    ".archive/s26/a.pdf",
    ".archive/s26/a.log",
    "materials/a.pdf",
  ] as FilePath[])
  assert.deepEqual(
    assets.map((file) => file.slug),
    ["archive/s26/a.pdf"],
  )
})

test("archive links prefer their class and preserve anchors", () => {
  assert.equal(
    resolveArchiveLink(src, "functions#Example", slugs),
    "../../../../archive/s26/math/notes/functions#example",
  )
  assert.equal(
    resolveArchiveLink(src, "2026-05-05", slugs),
    "../../../../archive/s26/math/lessons/2026-05-05",
  )
  assert.equal(
    resolveArchiveLink(src, "../../../../semestre/s26/resources/sheet.pdf", slugs),
    "../../../../archive/s26/resources/sheet.pdf",
  )
  assert.equal(
    resolveArchiveLink("archive/s26/index" as FullSlug, "./resources/", slugs),
    "../../archive/s26/resources/",
  )
  assert.equal(
    resolveArchiveLink("archive/s26/index" as FullSlug, "./Eksamenss%C3%A6t_B/", slugs),
    "../../archive/s26/Eksamenssæt_B/",
  )
  assert.equal(resolveArchiveLink(src, "https://example.com", slugs), undefined)
  assert.equal(resolveArchiveLink("materials/index" as FullSlug, "functions", slugs), undefined)
})

test("only .archive is opted into hidden-folder publishing, with ignores respected", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "quartz-archive-"))
  try {
    for (const folder of [".archive/s26", ".private", ".archive/.private"]) {
      await mkdir(path.join(dir, folder), { recursive: true })
      await writeFile(path.join(dir, folder, "note.md"), "test")
    }
    await writeFile(path.join(dir, ".archive/s26/a.pdf"), "test")
    const files = await glob("**/*.*", dir, [])
    assert.deepEqual(files.sort(), [".archive/s26/a.pdf", ".archive/s26/note.md"])
    assert.deepEqual(await glob("**/*.*", dir, [".archive"]), [])
    assert.deepEqual(await glob("**", dir, ["**/*.md"]), [".archive/s26/a.pdf"])
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
