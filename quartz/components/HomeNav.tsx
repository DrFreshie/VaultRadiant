import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const homeNavCss = `
.home-nav {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  width: 100%;
}

.home-nav__desktop {
  display: block;
}

.home-nav__mobile {
  display: none;
}

.home-nav__mobile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.home-nav__mobile-icon {
  width: 24px;
  height: 24px;
}

.home-nav__mobile-label {
  display: none;
}

.home-nav__heading {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--gray);
  margin: 0 0 0.4rem 0;
}

.home-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.home-nav__menu-heading {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--gray);
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
}

.home-nav__list a {
  font-size: 0.85rem;
  color: var(--darkgray);
  text-decoration: none;
  background: none;
  padding: 0;
  border-radius: 0;
  transition: color 0.15s ease;
}

.home-nav__list a:hover {
  color: var(--secondary);
}

@media all and (max-width: 800px) {
  .home-nav {
    width: fit-content;
    margin-left: 0;
    margin-right: auto;
    gap: 0;
    position: relative;
    order: -1;
    flex: 0 0 auto;
    z-index: 21;
  }

  .home-nav__desktop {
    display: none;
  }

  .home-nav__mobile {
    display: block;
    width: fit-content;
    flex: 0 0 auto;
    position: relative;
    z-index: 21;
  }

  .home-nav__mobile summary {
     width: fit-content;
    display: block;
    list-style: none;
    cursor: pointer;
    color: var(--darkgray);
    background: transparent;
    border: none;
    padding: 5px;
    margin: 0;
    line-height: 0;
  }

  .home-nav__mobile summary::-webkit-details-marker {
    display: none;
  }

  .home-nav__mobile summary::after {
    content: none;
  }

  .home-nav__mobile .home-nav__mobile-icon {
    stroke: var(--darkgray);
  }

  .home-nav__mobile .home-nav__list {
    position: fixed;
    left: 0;
    right: 0;
    top: 4.5rem;
    bottom: 0;
    margin: 0;
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    background: color-mix(in srgb, var(--light) 96%, transparent);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--lightgray);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    z-index: 30;
    gap: 0.75rem;
    overflow-y: auto;
  }

  .home-nav__mobile .home-nav__list a {
    display: block;
    padding: 0;
    font-size: 1.05rem;
    color: var(--secondary);
    font-family: var(--headerFont);
    font-weight: 600;
  }
}
`

export default (() => {
  const HomeNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    if (fileData.slug !== "index") return null

    return (
      <nav class="home-nav">
        <section class="home-nav__desktop">
          <h3 class="home-nav__heading">Klasser</h3>
          <ul class="home-nav__list">
            <li><a href="/classnotes/eng-c">Engelsk C</a></li>
            <li><a href="/classnotes/eng-b">Engelsk B</a></li>
          </ul>
        </section>
        <details class="home-nav__mobile">
          <summary aria-label="Klasser">
            <span class="home-nav__mobile-trigger">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="home-nav__mobile-icon"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span class="home-nav__mobile-label">Klasser</span>
            </span>
          </summary>
          <ul class="home-nav__list">
            <li class="home-nav__menu-heading">Klasser</li>
            <li><a href="/classnotes/eng-c">Engelsk C</a></li>
            <li><a href="/classnotes/eng-b">Engelsk B</a></li>
          </ul>
        </details>
        {/* <section> */}
        {/*   <h3 class="home-nav__heading">Matematik</h3> */}
        {/*   <ul class="home-nav__list"> */}
        {/*     <li><a href="/semestre/s26/6h56Ma/noter/funktioner">Funktioner</a></li> */}
        {/*     <li><a href="/semestre/s26/6h56Ma/noter/geometri">Geometri</a></li> */}
        {/*     <li><a href="/semestre/s26/6h56Ma/noter/differentialregning">Differentialregning</a></li> */}
        {/*     <li><a href="/semestre/s26/6h56Ma/noter/sandsynlighed">Sandsynlighed</a></li> */}
        {/*   </ul> */}
        {/* </section> */}
        {/* <section> */}
        {/*   <h3 class="home-nav__heading">Engelsk</h3> */}
        {/*   <ul class="home-nav__list"> */}
        {/*     <li><a href="/semestre/s26/6l26en/noter/belonging">Belonging</a></li> */}
        {/*     <li><a href="/semestre/s26/6l26en/noter/borders">Borders</a></li> */}
        {/*     <li><a href="/semestre/s26/6l26en/noter/voice">Voice</a></li> */}
        {/*   </ul> */}
        {/* </section> */}
      </nav>
    )
  }

  HomeNav.css = homeNavCss
  return HomeNav
}) satisfies QuartzComponentConstructor
