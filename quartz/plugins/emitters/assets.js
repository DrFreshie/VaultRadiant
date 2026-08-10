import { joinSegments, slugifyFilePath } from "../../util/path";
import path from "path";
import fs from "fs";
import { glob } from "../../util/glob";
const filesToCopy = async (argv, cfg) => {
    // glob all non MD files in content folder and copy it over
    return await glob("**", argv.directory, ["**/*.md", ...cfg.configuration.ignorePatterns]);
};
const copyFile = async (argv, fp) => {
    const src = joinSegments(argv.directory, fp);
    const name = slugifyFilePath(fp);
    const dest = joinSegments(argv.output, name);
    // ensure dir exists
    const dir = path.dirname(dest);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.copyFile(src, dest);
    return dest;
};
export const Assets = () => {
    return {
        name: "Assets",
        async *emit({ argv, cfg }) {
            const fps = await filesToCopy(argv, cfg);
            for (const fp of fps) {
                yield copyFile(argv, fp);
            }
        },
        async *partialEmit(ctx, _content, _resources, changeEvents) {
            for (const changeEvent of changeEvents) {
                const ext = path.extname(changeEvent.path);
                if (ext === ".md")
                    continue;
                if (changeEvent.type === "add" || changeEvent.type === "change") {
                    yield copyFile(ctx.argv, changeEvent.path);
                }
                else if (changeEvent.type === "delete") {
                    const name = slugifyFilePath(changeEvent.path);
                    const dest = joinSegments(ctx.argv.output, name);
                    await fs.promises.unlink(dest);
                }
            }
        },
    };
};
