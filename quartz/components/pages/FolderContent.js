import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "../styles/listPage.scss";
import { PageList } from "../PageList";
import { htmlToJsx } from "../../util/jsx";
import { i18n } from "../../i18n";
import { concatenateResources } from "../../util/resources";
import { trieFromAllFiles } from "../../util/ctx";
const defaultOptions = {
    showFolderCount: true,
    showSubfolders: true,
};
export default ((opts) => {
    const options = { ...defaultOptions, ...opts };
    const FolderContent = (props) => {
        const { tree, fileData, allFiles, cfg } = props;
        const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles));
        const folder = trie.findNode(fileData.slug.split("/"));
        if (!folder) {
            return null;
        }
        const allPagesInFolder = folder.children
            .map((node) => {
            // regular file, proceed
            if (node.data) {
                return node.data;
            }
            if (node.isFolder && options.showSubfolders) {
                // folders that dont have data need synthetic files
                const getMostRecentDates = () => {
                    let maybeDates = undefined;
                    for (const child of node.children) {
                        if (child.data?.dates) {
                            // compare all dates and assign to maybeDates if its more recent or its not set
                            if (!maybeDates) {
                                maybeDates = { ...child.data.dates };
                            }
                            else {
                                if (child.data.dates.created > maybeDates.created) {
                                    maybeDates.created = child.data.dates.created;
                                }
                                if (child.data.dates.modified > maybeDates.modified) {
                                    maybeDates.modified = child.data.dates.modified;
                                }
                                if (child.data.dates.published > maybeDates.published) {
                                    maybeDates.published = child.data.dates.published;
                                }
                            }
                        }
                    }
                    return (maybeDates ?? {
                        created: new Date(),
                        modified: new Date(),
                        published: new Date(),
                    });
                };
                return {
                    slug: node.slug,
                    dates: getMostRecentDates(),
                    frontmatter: {
                        title: node.displayName,
                        tags: [],
                    },
                };
            }
        })
            .filter((page) => page !== undefined) ?? [];
        const cssClasses = fileData.frontmatter?.cssclasses ?? [];
        const classes = cssClasses.join(" ");
        const listProps = {
            ...props,
            sort: options.sort,
            allFiles: allPagesInFolder,
        };
        const content = (tree.children.length === 0
            ? fileData.description
            : htmlToJsx(fileData.filePath, tree));
        return (_jsxs("div", { class: "popover-hint", children: [_jsx("article", { class: classes, children: content }), _jsxs("div", { class: "page-listing", children: [options.showFolderCount && (_jsx("p", { children: i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                                count: allPagesInFolder.length,
                            }) })), _jsx("div", { children: _jsx(PageList, { ...listProps }) })] })] }));
    };
    FolderContent.css = concatenateResources(style, PageList.css);
    return FolderContent;
});
