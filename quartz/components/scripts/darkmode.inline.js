"use strict";
const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
const currentTheme = localStorage.getItem("theme") ?? userPref;
document.documentElement.setAttribute("saved-theme", currentTheme);
const emitThemeChangeEvent = (theme) => {
    const event = new CustomEvent("themechange", {
        detail: { theme },
    });
    document.dispatchEvent(event);
};
document.addEventListener("nav", () => {
    const switchTheme = () => {
        const newTheme = document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("saved-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        emitThemeChangeEvent(newTheme);
    };
    const shortcutHandler = (e) => {
        if (e.key.toLowerCase() === "t" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
            e.preventDefault();
            switchTheme();
        }
    };
    const themeChange = (e) => {
        const newTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("saved-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        emitThemeChangeEvent(newTheme);
    };
    for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
        darkmodeButton.addEventListener("click", switchTheme);
        window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme));
    }
    // Listen for changes in prefers-color-scheme
    const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    colorSchemeMediaQuery.addEventListener("change", themeChange);
    document.addEventListener("keydown", shortcutHandler);
    window.addCleanup(() => {
        colorSchemeMediaQuery.removeEventListener("change", themeChange);
        document.removeEventListener("keydown", shortcutHandler);
    });
});
