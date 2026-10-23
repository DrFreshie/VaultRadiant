import path from "path"
import { FilePath } from "./path"
import { globby } from "globby"

export function toPosixPath(fp: string): string {
  return fp.split(path.sep).join("/")
}

export async function glob(
  pattern: string,
  cwd: string,
  ignorePatterns: string[],
): Promise<FilePath[]> {
  const fps = // Opt in only the archive dot-folder; other hidden folders stay private.
  (
    await globby([pattern, `.archive/${pattern}`], {
      cwd,
      ignore: ignorePatterns,
      gitignore: true,
    })
  ).map(toPosixPath)
  return fps as FilePath[]
}
