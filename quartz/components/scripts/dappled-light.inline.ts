document.addEventListener("nav", () => {
  const onThemeChange = () => {
    document.body.classList.add("animation-ready")

    const root = document.getElementById("quartz-root")
    if (!root) return
    root.classList.add("theme-transitioning")
    root.addEventListener(
      "animationend",
      () => root.classList.remove("theme-transitioning"),
      { once: true },
    )
  }

  document.addEventListener("themechange", onThemeChange)
  window.addCleanup(() => document.removeEventListener("themechange", onThemeChange))
})
