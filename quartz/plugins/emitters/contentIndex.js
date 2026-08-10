import { jsx as _jsx } from "preact/jsx-runtime";
import { getDate } from "../../components/Date";
import { escapeHTML } from "../../util/escape";
import { joinSegments, simplifySlug } from "../../util/path";
import { toHtml } from "hast-util-to-html";
import { write } from "./helpers";
import { i18n } from "../../i18n";
const defaultOptions = {
    enableSiteMap: true,
    enableRSS: true,
    rssLimit: 10,
    rssFullHtml: false,
    rssSlug: "index",
    includeEmptyFiles: true,
};
function generateSiteMap(cfg, idx) {
    const base = cfg.baseUrl ?? "";
    const createURLEntry = (slug, content) => `<url>
    <loc>https://${joinSegments(base, encodeURI(slug))}</loc>
    ${content.date && `<lastmod>${content.date.toISOString()}</lastmod>`}
  </url>`;
    const urls = Array.from(idx)
        .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
        .join("");
    return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
}
function generateRSSFeed(cfg, idx, limit) {
    const base = cfg.baseUrl ?? "";
    const createURLEntry = (slug, content) => `<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base, encodeURI(slug))}</link>
    <guid>https://${joinSegments(base, encodeURI(slug))}</guid>
    <description><![CDATA[ ${content.richContent ?? content.description} ]]></description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`;
    const items = Array.from(idx)
        .sort(([_, f1], [__, f2]) => {
        if (f1.date && f2.date) {
            return f2.date.getTime() - f1.date.getTime();
        }
        else if (f1.date && !f2.date) {
            return -1;
        }
        else if (!f1.date && f2.date) {
            return 1;
        }
        return f1.title.localeCompare(f2.title);
    })
        .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
        .slice(0, limit ?? idx.size)
        .join("");
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${base}</link>
      <description>${!!limit ? i18n(cfg.locale).pages.rss.lastFewNotes({ count: limit }) : i18n(cfg.locale).pages.rss.recentNotes} on ${escapeHTML(cfg.pageTitle)}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      ${items}
    </channel>
  </rss>`;
}
export const ContentIndex = (opts) => {
    opts = { ...defaultOptions, ...opts };
    return {
        name: "ContentIndex",
        async *emit(ctx, content) {
            const cfg = ctx.cfg.configuration;
            const linkIndex = new Map();
            for (const [tree, file] of content) {
                const slug = file.data.slug;
                const date = getDate(ctx.cfg.configuration, file.data) ?? new Date();
                if (opts?.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
                    linkIndex.set(slug, {
                        slug,
                        filePath: file.data.relativePath,
                        title: file.data.frontmatter?.title,
                        links: file.data.links ?? [],
                        tags: file.data.frontmatter?.tags ?? [],
                        content: file.data.text ?? "",
                        richContent: opts?.rssFullHtml
                            ? escapeHTML(toHtml(tree, { allowDangerousHtml: true }))
                            : undefined,
                        date: date,
                        description: file.data.description ?? "",
                    });
                }
            }
            if (opts?.enableSiteMap) {
                yield write({
                    ctx,
                    content: generateSiteMap(cfg, linkIndex),
                    slug: "sitemap",
                    ext: ".xml",
                });
            }
            if (opts?.enableRSS) {
                yield write({
                    ctx,
                    content: generateRSSFeed(cfg, linkIndex, opts.rssLimit),
                    slug: (opts?.rssSlug ?? "index"),
                    ext: ".xml",
                });
            }
            const fp = joinSegments("static", "contentIndex");
            const simplifiedIndex = Object.fromEntries(Array.from(linkIndex).map(([slug, content]) => {
                // remove description and from content index as nothing downstream
                // actually uses it. we only keep it in the index as we need it
                // for the RSS feed
                delete content.description;
                delete content.date;
                return [slug, content];
            }));
            yield write({
                ctx,
                content: JSON.stringify(simplifiedIndex),
                slug: fp,
                ext: ".json",
            });
        },
        externalResources: (ctx) => {
            if (opts?.enableRSS) {
                return {
                    additionalHead: [
                        _jsx("link", { rel: "alternate", type: "application/rss+xml", title: "RSS Feed", href: `https://${ctx.cfg.configuration.baseUrl}/index.xml` }),
                    ],
                };
            }
        },
    };
};
