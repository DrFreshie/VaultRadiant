import { jsx as _jsx } from "preact/jsx-runtime";
const css = `
.section-nav-heading {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--gray);
  margin: 0.35rem 0 -0.65rem;
}
`;
function getSectionTitle(slug) {
    if (!slug)
        return null;
    if (slug.startsWith("classnotes/"))
        return "Forløb";
    return null;
}
export default (() => {
    const SectionNavHeading = ({ fileData }) => {
        const title = getSectionTitle(fileData.slug);
        if (!title || fileData.slug === "index")
            return null;
        return _jsx("h4", { class: "section-nav-heading", children: title });
    };
    SectionNavHeading.css = css;
    return SectionNavHeading;
});
