let isReaderMode = false

const emitReaderModeChangeEvent = (mode: "on" | "off") => {
  const event: CustomEventMap["readermodechange"] = new CustomEvent("readermodechange", {
    detail: { mode },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const switchReaderMode = () => {
    isReaderMode = !isReaderMode
    const newMode = isReaderMode ? "on" : "off"

    // toggle attribute for CSS
    document.documentElement.setAttribute("reader-mode", newMode)
    emitReaderModeChangeEvent(newMode)

    // ── FULLSCREEN TOGGLE ──────────────────────────────
    const docEl = document.documentElement as HTMLElement & {
      requestFullscreen?: () => Promise<void>
    }

    if (newMode === "on") {
      // enter fullscreen if not already there
      if (!document.fullscreenElement && docEl.requestFullscreen) {
        void docEl.requestFullscreen().catch(() => {
          // ignored: browser might block it
        })
      }
    } else {
      // exit fullscreen when turning reader mode off
      if (document.fullscreenElement && document.exitFullscreen) {
        void document.exitFullscreen().catch(() => {
          // ignored
        })
      }
    }
    // ──────────────────────────────────────────────────
  }

  for (const readerModeButton of document.getElementsByClassName("readermode")) {
    readerModeButton.addEventListener("click", switchReaderMode)
    window.addCleanup(() => readerModeButton.removeEventListener("click", switchReaderMode))
  }

  // Set initial state
  document.documentElement.setAttribute("reader-mode", isReaderMode ? "on" : "off")
})
