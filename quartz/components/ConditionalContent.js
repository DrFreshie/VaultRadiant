import { jsx as _jsx } from "preact/jsx-runtime";
import ContentConstructor from "./pages/Content";
import LessonLayoutConstructor from "./LessonLayout";
export default (() => {
    // instantiate both once
    const DefaultContent = ContentConstructor();
    const LessonLayout = LessonLayoutConstructor();
    function ConditionalContent(props) {
        const fm = props.fileData.frontmatter ?? {};
        if (fm.type === "lesson") {
            // use your special lesson layout
            return _jsx(LessonLayout, { ...props });
        }
        // otherwise fall back to the normal Quartz Content renderer
        return _jsx(DefaultContent, { ...props });
    }
    // IMPORTANT: css must be a STRING, not an object
    ConditionalContent.css = (LessonLayout.css ?? "") + "\n" + (DefaultContent.css ?? "");
    return ConditionalContent;
});
