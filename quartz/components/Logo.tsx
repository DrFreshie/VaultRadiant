// quartz/components/PrimeRadiantAside.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/logo.scss"

export default (() => {
  const PrimeRadiantAside: QuartzComponent = (_props: QuartzComponentProps) => {
    return (
      <aside class="prime-radiant">
        <a href="/" class="prime-radiant__link">
          {/* Headline */}
          <div class="prime-radiant__title">
            <span class="prime-radiant__line prime-radiant__line--vault">VAULT</span>
            <span class="prime-radiant__line prime-radiant__line--radiant">RADIANT</span>
          </div>

          {/* Image */}
          <div class="prime-radiant__image-wrapper">
            <img
              src="/static/logov3.png"
              alt="Prime Radiant"
              class="prime-radiant__image prime-radiant__image--default"
            />
            <img
              src="/static/logov3_2.png"
              alt="Prime Radiant"
              class="prime-radiant__image prime-radiant__image--hover"
            />
          </div>

          {/* Quote */}
          <figure class="prime-radiant__quote">
            <blockquote>
              "Studying the Prime Radiant, acre by acre, has its uses – but observing it as a continent is inspirational."
            </blockquote>
            <figcaption>
              – Isaac Asimov, <em>Foundation</em>
            </figcaption>
          </figure>
        </a>
      </aside>
    )
  }

  PrimeRadiantAside.css = style
  return PrimeRadiantAside
}) satisfies QuartzComponentConstructor
