export const RemoveDrafts = () => ({
    name: "RemoveDrafts",
    shouldPublish(_ctx, [_tree, vfile]) {
        const draftFlag = vfile.data?.frontmatter?.draft === true || vfile.data?.frontmatter?.draft === "true";
        return !draftFlag;
    },
});
