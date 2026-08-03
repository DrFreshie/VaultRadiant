import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const homeNavCss = `
.home-nav {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  width: 100%;
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
`

export default (() => {
  const HomeNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    if (fileData.slug !== "index") return null

    return (
      <nav class="home-nav">
        <section>
          <h3 class="home-nav__heading">Klasser</h3>
          <ul class="home-nav__list">
            <li><a href="/classnotes/eng-c/lessonplans">Engelsk C</a></li>
            <li><a href="/classnotes/eng-b/lessonplans">Engelsk B</a></li>
          </ul>
        </section>
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
