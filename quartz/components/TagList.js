import { jsx as _jsx } from "preact/jsx-runtime";
import { resolveRelative } from "../util/path";
import { classNames } from "../util/lang";
const TagList = ({ fileData, displayClass }) => {
    const tags = fileData.frontmatter?.tags;
    if (tags && tags.length > 0) {
        return (_jsx("ul", { class: classNames(displayClass, "tags"), children: tags.map((tag) => {
                const linkDest = resolveRelative(fileData.slug, `tags/${tag}`);
                return (_jsx("li", { children: _jsx("a", { href: linkDest, class: "internal tag-link", children: tag }) }));
            }) }));
    }
    else {
        return null;
    }
};
TagList.css = `
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`;
export default (() => TagList);
