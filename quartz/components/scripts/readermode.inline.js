"use strict";
let isReaderMode = false;
const emitReaderModeChangeEvent = (mode) => {
    const event = new CustomEvent("readermodechange", {
        detail: { mode },
    });
    document.dispatchEvent(event);
};
document.addEventListener("nav", () => {
    const switchReaderMode = () => {
        isReaderMode = !isReaderMode;
        const newMode = isReaderMode ? "on" : "off";
        // toggle attribute for CSS
        document.documentElement.setAttribute("reader-mode", newMode);
        emitReaderModeChangeEvent(newMode);
    };
    for (const readerModeButton of document.getElementsByClassName("readermode")) {
        readerModeButton.addEventListener("click", switchReaderMode);
        window.addCleanup(() => readerModeButton.removeEventListener("click", switchReaderMode));
    }
    // Set initial state
    document.documentElement.setAttribute("reader-mode", isReaderMode ? "on" : "off");
});
