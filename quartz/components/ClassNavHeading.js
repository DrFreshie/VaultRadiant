import { jsx as _jsx } from "preact/jsx-runtime";
const classNavHeadingCss = `
.class-nav-heading {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--gray);
  margin: 0;
}
`;
function getClassTitle(slug) {
    if (!slug)
        return null;
    if (slug.startsWith("classnotes/eng-c"))
        return "Engelsk C";
    if (slug.startsWith("classnotes/eng-b"))
        return "Engelsk B";
    if (slug.startsWith("semestre/s26/6h56Ma"))
        return "Matematik";
    if (slug.startsWith("semestre/s26/6l26en"))
        return "Engelsk";
    return null;
}
export default (() => {
    const ClassNavHeading = ({ fileData }) => {
        const title = getClassTitle(fileData.slug);
        if (!title || fileData.slug === "index")
            return null;
        return _jsx("h3", { class: "class-nav-heading", children: title });
    };
    ClassNavHeading.css = classNavHeadingCss;
    return ClassNavHeading;
});
