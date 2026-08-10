import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { i18n } from "../../i18n";
import { unescapeHTML } from "../../util/escape";
import { getFileExtension, isAbsoluteURL, joinSegments, QUARTZ } from "../../util/path";
import { defaultImage, getSatoriFonts } from "../../util/og";
import sharp from "sharp";
import satori from "satori";
import { loadEmoji, getIconCode } from "../../util/emoji";
import { write } from "./helpers";
import fs from "node:fs/promises";
import { styleText } from "util";
const defaultOptions = {
    colorScheme: "lightMode",
    width: 1200,
    height: 630,
    imageStructure: defaultImage,
    excludeRoot: false,
};
/**
 * Generates social image (OG/twitter standard) and saves it as `.webp` inside the public folder
 * @param opts options for generating image
 */
async function generateSocialImage({ cfg, description, fonts, title, fileData }, userOpts) {
    const { width, height } = userOpts;
    const iconPath = joinSegments(QUARTZ, "static", "icon.png");
    let iconBase64 = undefined;
    try {
        const iconData = await fs.readFile(iconPath);
        iconBase64 = `data:image/png;base64,${iconData.toString("base64")}`;
    }
    catch (err) {
        console.warn(styleText("yellow", `Warning: Could not find icon at ${iconPath}`));
    }
    const imageComponent = userOpts.imageStructure({
        cfg,
        userOpts,
        title,
        description,
        fonts,
        fileData,
        iconBase64,
    });
    const svg = await satori(imageComponent, {
        width,
        height,
        fonts,
        loadAdditionalAsset: async (languageCode, segment) => {
            if (languageCode === "emoji") {
                return await loadEmoji(getIconCode(segment));
            }
            return languageCode;
        },
    });
    return sharp(Buffer.from(svg)).webp({ quality: 40 });
}
async function processOgImage(ctx, fileData, fonts, fullOptions) {
    const cfg = ctx.cfg.configuration;
    const slug = fileData.slug;
    const titleSuffix = cfg.pageTitleSuffix ?? "";
    const title = (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix;
    const description = fileData.frontmatter?.socialDescription ??
        fileData.frontmatter?.description ??
        unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description);
    const stream = await generateSocialImage({
        title,
        description,
        fonts,
        cfg,
        fileData,
    }, fullOptions);
    return write({
        ctx,
        content: stream,
        slug: `${slug}-og-image`,
        ext: ".webp",
    });
}
export const CustomOgImagesEmitterName = "CustomOgImages";
export const CustomOgImages = (userOpts) => {
    const fullOptions = { ...defaultOptions, ...userOpts };
    return {
        name: CustomOgImagesEmitterName,
        getQuartzComponents() {
            return [];
        },
        async *emit(ctx, content, _resources) {
            const cfg = ctx.cfg.configuration;
            const headerFont = cfg.theme.typography.header;
            const bodyFont = cfg.theme.typography.body;
            const fonts = await getSatoriFonts(headerFont, bodyFont);
            for (const [_tree, vfile] of content) {
                if (vfile.data.frontmatter?.socialImage !== undefined)
                    continue;
                yield processOgImage(ctx, vfile.data, fonts, fullOptions);
            }
        },
        async *partialEmit(ctx, _content, _resources, changeEvents) {
            const cfg = ctx.cfg.configuration;
            const headerFont = cfg.theme.typography.header;
            const bodyFont = cfg.theme.typography.body;
            const fonts = await getSatoriFonts(headerFont, bodyFont);
            // find all slugs that changed or were added
            for (const changeEvent of changeEvents) {
                if (!changeEvent.file)
                    continue;
                if (changeEvent.file.data.frontmatter?.socialImage !== undefined)
                    continue;
                if (changeEvent.type === "add" || changeEvent.type === "change") {
                    yield processOgImage(ctx, changeEvent.file.data, fonts, fullOptions);
                }
            }
        },
        externalResources: (ctx) => {
            if (!ctx.cfg.configuration.baseUrl) {
                return {};
            }
            const baseUrl = ctx.cfg.configuration.baseUrl;
            return {
                additionalHead: [
                    (pageData) => {
                        const isRealFile = pageData.filePath !== undefined;
                        let userDefinedOgImagePath = pageData.frontmatter?.socialImage;
                        if (userDefinedOgImagePath) {
                            userDefinedOgImagePath = isAbsoluteURL(userDefinedOgImagePath)
                                ? userDefinedOgImagePath
                                : `https://${baseUrl}/static/${userDefinedOgImagePath}`;
                        }
                        const generatedOgImagePath = isRealFile
                            ? `https://${baseUrl}/${pageData.slug}-og-image.webp`
                            : undefined;
                        const defaultOgImagePath = `https://${baseUrl}/static/og-image.png`;
                        const ogImagePath = userDefinedOgImagePath ?? generatedOgImagePath ?? defaultOgImagePath;
                        const ogImageMimeType = `image/${getFileExtension(ogImagePath) ?? "png"}`;
                        return (_jsxs(_Fragment, { children: [!userDefinedOgImagePath && (_jsxs(_Fragment, { children: [_jsx("meta", { property: "og:image:width", content: fullOptions.width.toString() }), _jsx("meta", { property: "og:image:height", content: fullOptions.height.toString() })] })), _jsx("meta", { property: "og:image", content: ogImagePath }), _jsx("meta", { property: "og:image:url", content: ogImagePath }), _jsx("meta", { name: "twitter:image", content: ogImagePath }), _jsx("meta", { property: "og:image:type", content: ogImageMimeType })] }));
                    },
                ],
            };
        },
    };
};
