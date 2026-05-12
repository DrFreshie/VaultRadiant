import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
  ],
  footer: Component.Footer({
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    (ctx) => {
      const fm = ctx.fileData.frontmatter
      if (fm?.layout === "home") {
        return Component.Logo()
      }
      return null
    },
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

        Component.Explorer({
          title: ({ fileData }) => {
            const parts = (fileData.slug ?? "").split("/")
            const parent = parts.length >= 2 ? parts[parts.length - 2] : parts[0]
            return parent.charAt(0).toUpperCase() + parent.slice(1)
          },
          sortFn: (a, b) => {
            if (a.isFolder && !b.isFolder) return -1
            if (!a.isFolder && b.isFolder) return 1
            return b.slugSegment.localeCompare(a.slugSegment, undefined, { numeric: true, sensitivity: "base" })
          },
        }),
  ],
  right: [
    Component.Graph(),
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

  ],
  right: [],
}
