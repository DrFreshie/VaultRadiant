import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const homePortraitCss = `
.home-portrait {
  margin-top: 1rem;
  position: relative;
}

.home-portrait__img {
  display: block;
  width: 100%;
  border-radius: 8px;
  transition: opacity 0.3s ease;
}

.home-portrait__img--dark {
  position: absolute;
  inset: 0;
  opacity: 0;
}

[saved-theme="dark"] .home-portrait__img--light {
  opacity: 0;
}

[saved-theme="dark"] .home-portrait__img--dark {
  opacity: 1;
  transition-delay: 0.3s;
}
`

export default (() => {
  const HomePortrait: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    if (fileData.slug !== "index") return null

    return (
      <div class={classNames(displayClass, "home-portrait")}>
        <img class="home-portrait__img home-portrait__img--light" src="/imgs/Portrait.jpg" alt="Portrait" loading="lazy" />
        <img class="home-portrait__img home-portrait__img--dark" src="/imgs/Portrait_dark.jpg" alt="Portrait" loading="lazy" />
      </div>
    )
  }

  HomePortrait.css = homePortraitCss
  return HomePortrait
}) satisfies QuartzComponentConstructor
