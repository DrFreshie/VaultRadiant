import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
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
`;
export default (() => {
    const HomeNav = ({ fileData }) => {
        if (fileData.slug !== "index")
            return null;
        return (_jsx("nav", { class: "home-nav", children: _jsxs("section", { children: [_jsx("h3", { class: "home-nav__heading", children: "Klasser" }), _jsxs("ul", { class: "home-nav__list", children: [_jsx("li", { children: _jsx("a", { href: "/classnotes/eng-c", children: "Engelsk C" }) }), _jsx("li", { children: _jsx("a", { href: "/classnotes/eng-b", children: "Engelsk B" }) })] })] }) }));
    };
    HomeNav.css = homeNavCss;
    return HomeNav;
});
