import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import ContentConstructor from "./pages/Content"
import LessonLayoutConstructor from "./LessonLayout"

export default (() => {
  // instantiate both once
  const DefaultContent = ContentConstructor()
  const LessonLayout = LessonLayoutConstructor()

  function ConditionalContent(props: QuartzComponentProps) {
    const fm = props.fileData.frontmatter ?? {}

    if (fm.type === "lesson") {
      // use your special lesson layout
      return <LessonLayout {...props} />
    }

    // otherwise fall back to the normal Quartz Content renderer
    return <DefaultContent {...props} />
  }

  // IMPORTANT: css must be a STRING, not an object
  ConditionalContent.css =
    (LessonLayoutConstructor.css ?? "") +
    "\n" +
    (ContentConstructor.css ?? "")

  return ConditionalContent
}) satisfies QuartzComponentConstructor
