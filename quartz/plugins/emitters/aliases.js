import { isRelativeURL, resolveRelative, simplifySlug } from "../../util/path";
import { write } from "./helpers";
import path from "path";
async function* processFile(ctx, file) {
    const ogSlug = simplifySlug(file.data.slug);
    for (const aliasTarget of file.data.aliases ?? []) {
        const aliasTargetSlug = (isRelativeURL(aliasTarget)
            ? path.normalize(path.join(ogSlug, "..", aliasTarget))
            : aliasTarget);
        const redirUrl = resolveRelative(aliasTargetSlug, ogSlug);
        yield write({
            ctx,
            content: `
        <!DOCTYPE html>
        <html lang="en-us">
        <head>
        <title>${ogSlug}</title>
        <link rel="canonical" href="${redirUrl}">
        <meta name="robots" content="noindex">
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0; url=${redirUrl}">
        </head>
        </html>
        `,
            slug: aliasTargetSlug,
            ext: ".html",
        });
    }
}
export const AliasRedirects = () => ({
    name: "AliasRedirects",
    async *emit(ctx, content) {
        for (const [_tree, file] of content) {
            yield* processFile(ctx, file);
        }
    },
    async *partialEmit(ctx, _content, _resources, changeEvents) {
        for (const changeEvent of changeEvents) {
            if (!changeEvent.file)
                continue;
            if (changeEvent.type === "add" || changeEvent.type === "change") {
                // add new ones if this file still exists
                yield* processFile(ctx, changeEvent.file);
            }
        }
    },
});
