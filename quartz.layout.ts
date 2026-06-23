import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.DappledLightScript(),
  ],
  footer: Component.Footer({
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  left: [
        Component.Logo(),
        Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
        { Component: Component.Slide() },
      ],
    }),

        Component.HomeNav(),
        Component.Explorer({
          title: "",
          folderDefaultState: "open",
          sortFn: (a, b) => {
            if (a.isFolder && !b.isFolder) return -1
            if (!a.isFolder && b.isFolder) return 1
            return b.slugSegment.localeCompare(a.slugSegment, undefined, { numeric: true, sensitivity: "base" })
          },
        }),
  ],
  right: [
    Component.Graph(),
    Component.FigureViewer(),
  ],
  afterBody: [
  ],
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
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "",
      folderDefaultState: "open",
      sortFn: (a, b) => {
        if (a.isFolder && !b.isFolder) return -1
        if (!a.isFolder && b.isFolder) return 1
        return b.slugSegment.localeCompare(a.slugSegment, undefined, { numeric: true, sensitivity: "base" })
      },
    }),
  ],
  right: [],
}
