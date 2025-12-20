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
      ],
    }),

        Component.Explorer({ title: "Lektioner" }),
  ],
  right: [
    Component.Graph(),
  ],
  afterBody: [
    Component.Lavat(),
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

        Component.Explorer({ title: "Lektioner" }),
  ],
  right: [],
}
