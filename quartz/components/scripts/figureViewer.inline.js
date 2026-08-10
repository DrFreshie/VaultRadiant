"use strict";
function setupFigureViewer() {
    const panel = document.querySelector(".figure-viewer-panel");
    if (!panel)
        return;
    const triggers = Array.from(document.querySelectorAll("article .fig-trigger"));
    panel.innerHTML = "";
    if (triggers.length === 0)
        return;
    let currentKey = null;
    let showTriggerEl = null;
    let exitTriggerEl = null;
    function resolveSrc(src) {
        if (!src || src.startsWith("http") || src.startsWith("/"))
            return src;
        const base = window.location.pathname;
        const dir = base.substring(0, base.lastIndexOf("/") + 1);
        return dir + src;
    }
    function setContent(figSrc, iframeSrc) {
        panel.innerHTML = "";
        if (!figSrc && !iframeSrc)
            return;
        const wrapper = document.createElement("div");
        wrapper.className = "figure-viewer__content";
        const heading = document.createElement("h3");
        heading.textContent = "Figur";
        wrapper.appendChild(heading);
        if (figSrc) {
            const img = document.createElement("img");
            img.src = resolveSrc(figSrc);
            img.className = "figure-viewer__img";
            wrapper.appendChild(img);
        }
        else if (iframeSrc) {
            const iframe = document.createElement("iframe");
            iframe.src = resolveSrc(iframeSrc);
            iframe.className = "figure-viewer__iframe";
            iframe.setAttribute("allowfullscreen", "true");
            wrapper.appendChild(iframe);
        }
        panel.appendChild(wrapper);
    }
    function applyPosition() {
        const wrapper = panel.querySelector(".figure-viewer__content");
        if (exitTriggerEl) {
            const top = exitTriggerEl.getBoundingClientRect().top;
            const progress = Math.min(1, Math.max(0, (window.innerHeight / 2 - top) / (window.innerHeight / 2)));
            if (wrapper)
                wrapper.style.transform = `translateY(${-progress * 100}vh)`;
            if (progress >= 1) {
                panel.innerHTML = "";
                exitTriggerEl = null;
            }
            return;
        }
        if (!wrapper || !showTriggerEl)
            return;
        const top = showTriggerEl.getBoundingClientRect().top;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - top) / (window.innerHeight / 2)));
        wrapper.style.transform = `translateY(${(1 - progress) * 100}vh)`;
    }
    function getActive() {
        let active = null;
        for (const trigger of triggers) {
            const isClear = !trigger.dataset.fig && !trigger.dataset.iframe;
            const threshold = isClear ? window.innerHeight / 2 : window.innerHeight;
            if (trigger.getBoundingClientRect().top <= threshold)
                active = trigger;
        }
        const figSrc = active?.dataset.fig ?? null;
        const iframeSrc = active?.dataset.iframe ?? null;
        const key = active ? `${figSrc ?? ""}|${iframeSrc ?? ""}` : null;
        return { key, figSrc, iframeSrc, el: active };
    }
    // Initial load
    const initial = getActive();
    if (initial.key) {
        currentKey = initial.key;
        showTriggerEl = initial.el;
        setContent(initial.figSrc, initial.iframeSrc);
        applyPosition();
    }
    let rafPending = false;
    function onScroll() {
        if (rafPending)
            return;
        rafPending = true;
        requestAnimationFrame(() => {
            rafPending = false;
            const { key, figSrc, iframeSrc, el } = getActive();
            if (key !== currentKey) {
                currentKey = key;
                if (!figSrc && !iframeSrc) {
                    // Clear trigger crossed its threshold — keep content, start exit animation
                    exitTriggerEl = el;
                    showTriggerEl = null;
                }
                else {
                    // Show trigger became active (enter) or clear trigger retreated (return)
                    exitTriggerEl = null;
                    showTriggerEl = el;
                    setContent(figSrc, iframeSrc);
                }
            }
            applyPosition();
        });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("nav", () => window.removeEventListener("scroll", onScroll), { once: true });
}
document.addEventListener("nav", setupFigureViewer);
