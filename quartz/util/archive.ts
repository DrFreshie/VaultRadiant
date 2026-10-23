import type { QuartzPluginData } from "../plugins/vfile"
import {
  FullSlug,
  RelativeURL,
  resolveRelative,
  slugifyFilePath,
  FilePath,
  splitAnchor,
} from "./path"

/** Archive pages are public by URL, but not part of the active site indexes. */
export function isArchiveSlug(slug: string | undefined): boolean {
  return slug === "archive" || slug?.startsWith("archive/") === true
}

/** Include downloadable teaching materials in archive folder listings, not TeX build artifacts. */
export function archiveAssets(files: FilePath[]): QuartzPluginData[] {
  return files
    .filter(
      (fp) =>
        fp.startsWith(".archive/") &&
        /\.(pdf|docx?|pptx?|xlsx?|zip|png|jpe?g|webp|gif|txt)$/i.test(fp),
    )
    .map((fp) => ({
      slug: slugifyFilePath(fp),
      filePath: fp,
      frontmatter: { title: fp.split("/").at(-1)!, tags: [] },
    }))
}

/** Resolve moved semester links and prefer nearby archived notes over active namesakes. */
export function resolveArchiveLink(
  src: FullSlug,
  target: string,
  allSlugs: FullSlug[],
): RelativeURL | undefined {
  if (!isArchiveSlug(src) || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) return
  const [rawPath, anchor] = splitAnchor(decodeURI(target))
  const movedPath = rawPath.replace(/^(?:\.\.\/|\.\/|\/)*semestre\//, "archive/")
  const canonical = slugifyFilePath(movedPath.replace(/^\//, "") as FilePath)
  const localPath = decodeURI(new URL(movedPath, `https://archive.invalid/${src}`).pathname).slice(
    1,
  )
  const local = slugifyFilePath(localPath as FilePath)
  const semester = src.split("/").slice(0, 2).join("/") + "/"
  const candidates = [local, canonical, `${local}/index`, `${canonical}/index`]
  const exact = candidates.find((candidate) => allSlugs.includes(candidate as FullSlug))
  const folder = [local, canonical].find((candidate) =>
    allSlugs.some((slug) => slug.startsWith(candidate + "/")),
  )
  const matches = allSlugs.filter(
    (slug) => slug.startsWith(semester) && slug.endsWith(`/${canonical}`),
  )
  const classPrefix = src.split("/").slice(0, 3).join("/") + "/"
  const classMatches = matches.filter((slug) => slug.startsWith(classPrefix))
  const resolved =
    exact ??
    (folder ? `${folder}/index` : undefined) ??
    (classMatches.length === 1 ? classMatches[0] : undefined) ??
    (matches.length === 1 ? matches[0] : undefined)
  return resolved
    ? ((resolveRelative(src, resolved as FullSlug) + anchor) as RelativeURL)
    : undefined
}
