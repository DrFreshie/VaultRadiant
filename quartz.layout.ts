import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.DappledLightScript(),
    Component.MinuteCrypticScript(),
    Component.HangmanScript(),
    Component.MaterialsSidebarScript(),
    Component.ExplorerSectionsScript(),
  ],
  footer: Component.Footer({}),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [
    Component.Logo(),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        {
          Component: Component.ConditionalRender({
            component: Component.DesktopOnly(Component.PresenterMode()),
            condition: (props) => props.fileData.frontmatter?.type === "lesson",
          }),
        },
      ],
    }),

    Component.HomeNav(),
    Component.ClassNavHeading(),
    Component.SectionNavHeading(),
    Component.Explorer({
      title: "",
      folderDefaultState: "open",
      sortFn: (a, b) => {
        if (a.slugSegment === "notes" && b.slugSegment !== "notes") return 1
        if (a.slugSegment !== "notes" && b.slugSegment === "notes") return -1
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        return b.slugSegment.localeCompare(a.slugSegment, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [Component.Graph(), Component.HomePortrait(), Component.FigureViewer()],
  afterBody: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [
    Component.Logo(),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.ClassNavHeading(),
    Component.SectionNavHeading(),
    Component.Explorer({
      title: "",
      folderDefaultState: "open",
      sortFn: (a, b) => {
        if (a.slugSegment === "notes" && b.slugSegment !== "notes") return 1
        if (a.slugSegment !== "notes" && b.slugSegment === "notes") return -1
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        return b.slugSegment.localeCompare(a.slugSegment, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [],
}
