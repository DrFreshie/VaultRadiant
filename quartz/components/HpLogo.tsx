// quartz/components/PrimeRadiantAside.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/hpLogo.scss"

export default (() => {
  const PrimeRadiantAside: QuartzComponent = (_props: QuartzComponentProps) => {
    return (
      <aside class="prime-radiant">
{/* Headline */}
<div class="prime-radiant__title">
  <span class="prime-radiant__line prime-radiant__line--vault">VAULT</span>
  <span class="prime-radiant__line prime-radiant__line--radiant">RADIANT</span>
</div>

        {/* Image */}
        <div class="prime-radiant__image-wrapper">
          <img
            src="/static/logo.png"
            alt="Prime Radiant"
            class="prime-radiant__image"
          />
        </div>

        {/* Quote */}
        <figure class="prime-radiant__quote">
          <blockquote>
            “Studying the Prime Radiant, acre by acre, has its uses – but observing it as a continent is inspirational."
          </blockquote>
          <figcaption>
            – Isaac Asimov, <em>Foundation</em>
          </figcaption>
        </figure>
      </aside>
    )
  }

  PrimeRadiantAside.css = style
  return PrimeRadiantAside
}) satisfies QuartzComponentConstructor
