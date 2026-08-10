import matter from "gray-matter";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "js-yaml";
import toml from "toml";
import { getFileExtension, slugifyFilePath, slugTag } from "../../util/path";
import { i18n } from "../../i18n";
const defaultOptions = {
    delimiters: "---",
    language: "yaml",
};
function coalesceAliases(data, aliases) {
    for (const alias of aliases) {
        if (data[alias] !== undefined && data[alias] !== null)
            return data[alias];
    }
}
function coerceToArray(input) {
    if (input === undefined || input === null)
        return undefined;
    // coerce to array
    if (!Array.isArray(input)) {
        input = input
            .toString()
            .split(",")
            .map((tag) => tag.trim());
    }
    // remove all non-strings
    return input
        .filter((tag) => typeof tag === "string" || typeof tag === "number")
        .map((tag) => tag.toString());
}
function getAliasSlugs(aliases) {
    const res = [];
    for (const alias of aliases) {
        const isMd = getFileExtension(alias) === "md";
        const mockFp = isMd ? alias : alias + ".md";
        const slug = slugifyFilePath(mockFp);
        res.push(slug);
    }
    return res;
}
export const FrontMatter = (userOpts) => {
    const opts = { ...defaultOptions, ...userOpts };
    return {
        name: "FrontMatter",
        markdownPlugins(ctx) {
            const { cfg, allSlugs } = ctx;
            return [
                [remarkFrontmatter, ["yaml", "toml"]],
                () => {
                    return (_, file) => {
                        const fileData = Buffer.from(file.value);
                        const { data } = matter(fileData, {
                            ...opts,
                            engines: {
                                yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
                                toml: (s) => toml.parse(s),
                            },
                        });
                        if (data.title != null && data.title.toString() !== "") {
                            data.title = data.title.toString();
                        }
                        else {
                            data.title = file.stem ?? i18n(cfg.configuration.locale).propertyDefaults.title;
                        }
                        const tags = coerceToArray(coalesceAliases(data, ["tags", "tag"]));
                        if (tags)
                            data.tags = [...new Set(tags.map((tag) => slugTag(tag)))];
                        const aliases = coerceToArray(coalesceAliases(data, ["aliases", "alias"]));
                        if (aliases) {
                            data.aliases = aliases; // frontmatter
                            file.data.aliases = getAliasSlugs(aliases);
                            allSlugs.push(...file.data.aliases);
                        }
                        if (data.permalink != null && data.permalink.toString() !== "") {
                            data.permalink = data.permalink.toString();
                            const aliases = file.data.aliases ?? [];
                            aliases.push(data.permalink);
                            file.data.aliases = aliases;
                            allSlugs.push(data.permalink);
                        }
                        const cssclasses = coerceToArray(coalesceAliases(data, ["cssclasses", "cssclass"]));
                        if (cssclasses)
                            data.cssclasses = cssclasses;
                        const socialImage = coalesceAliases(data, ["socialImage", "image", "cover"]);
                        const created = coalesceAliases(data, ["created", "date"]);
                        if (created) {
                            data.created = created;
                        }
                        const modified = coalesceAliases(data, [
                            "modified",
                            "lastmod",
                            "updated",
                            "last-modified",
                        ]);
                        if (modified)
                            data.modified = modified;
                        data.modified ||= created; // if modified is not set, use created
                        const published = coalesceAliases(data, ["published", "publishDate", "date"]);
                        if (published)
                            data.published = published;
                        if (socialImage)
                            data.socialImage = socialImage;
                        // Remove duplicate slugs
                        const uniqueSlugs = [...new Set(allSlugs)];
                        allSlugs.splice(0, allSlugs.length, ...uniqueSlugs);
                        // fill in frontmatter
                        file.data.frontmatter = data;
                    };
                },
            ];
        },
    };
};
