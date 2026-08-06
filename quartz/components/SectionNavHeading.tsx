import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const css = `
.section-nav-heading {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--gray);
  margin: 0.35rem 0 -0.65rem;
}
`

function getSectionTitle(slug?: string) {
  if (!slug) return null
  if (slug.startsWith("classnotes/")) return "Forløb"
  return null
}

export default (() => {
  const SectionNavHeading: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const title = getSectionTitle(fileData.slug)
    if (!title || fileData.slug === "index") return null
    return <h4 class="section-nav-heading">{title}</h4>
  }

  SectionNavHeading.css = css
  return SectionNavHeading
}) satisfies QuartzComponentConstructor
