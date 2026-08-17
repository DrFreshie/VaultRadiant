import * as Plugin from "./quartz/plugins";
import LessonLayout from "./quartz/components/LessonLayout";
const includeDrafts = process.argv.includes("--serve");
/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config = {
    configuration: {
        pageTitle: "Quartz 4",
        pageTitleSuffix: "",
        enableSPA: true,
        enablePopovers: true,
        analytics: {
            provider: "plausible",
        },
        locale: "en-US",
        baseUrl: "quartz.jzhao.xyz",
        ignorePatterns: ["private", "templates", ".obsidian"],
        defaultDateType: "modified",
        theme: {
            fontOrigin: "googleFonts",
            cdnCaching: true,
            typography: {
                header: "DM Serif Display",
                body: "Bricolage Grotesque",
                code: "JetBrains Mono",
            },
            colors: {
                lightMode: {
                    light: "#fffdfa",
                    lightgray: "#e1daca",
                    gray: "#9c9384",
                    darkgray: "#2a354b",
                    dark: "#08142c",
                    secondary: "#274b75",
                    tertiary: "#84a59d",
                    highlight: "#8f9fa926",
                    textHighlight: "#fff23688",
                },
                darkMode: {
                    light: "#0c0f14",
                    lightgray: "#1d232d",
                    gray: "#5a657b",
                    darkgray: "#d4d4d4",
                    dark: "#ebebec",
                    secondary: "#7188a9",
                    tertiary: "#84a59d",
                    highlight: "#8f9fa926",
                    textHighlight: "#b3aa0288",
                },
            },
        },
    },
    plugins: {
        transformers: [
            {
                name: "lesson-layout",
                filter: (data) => data.frontmatter?.type === "lesson",
                component: LessonLayout,
            },
            Plugin.FrontMatter(),
            Plugin.CreatedModifiedDate({
                priority: ["frontmatter", "git", "filesystem"],
            }),
            Plugin.SyntaxHighlighting({
                theme: {
                    light: "github-light",
                    dark: "github-dark",
                },
                keepBackground: false,
            }),
            Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
            Plugin.GitHubFlavoredMarkdown(),
            Plugin.TableOfContents(),
            Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
            Plugin.Description(),
            Plugin.Latex({ renderEngine: "katex" }),
        ],
        filters: includeDrafts ? [] : [Plugin.RemoveDrafts()],
        emitters: [
            Plugin.AliasRedirects(),
            Plugin.ComponentResources(),
            Plugin.ContentPage(),
            Plugin.FolderPage(),
            Plugin.TagPage(),
            Plugin.ContentIndex({
                enableSiteMap: true,
                enableRSS: true,
            }),
            Plugin.Assets(),
            Plugin.Static(),
            Plugin.Favicon(),
            Plugin.NotFoundPage(),
            // Comment out CustomOgImages to speed up build time
            Plugin.CustomOgImages(),
        ],
    },
    git: {
        branch: "main",
    },
};
export default config;
