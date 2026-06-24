let isPresenterMode = false
let activeSectionIndex = 0

function normalizeHeading(text: string) {
  return text
    .replace(/^[^\p{L}\p{N}]+/gu, "")
    .trim()
    .toLowerCase()
}

function isElement(node: ChildNode): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE
}

function getPresenterContentRoot(article: HTMLElement) {
  return (
    (article.querySelector(":scope > .lesson-section > .lesson-content") as HTMLElement | null) ??
    (article.querySelector(":scope > .popover-hint") as HTMLElement | null) ??
    article
  )
}

function buildPresenterModel(contentRoot: HTMLElement) {
  const originalHtml = contentRoot.dataset.presenterOriginalHtml ?? contentRoot.innerHTML
  contentRoot.dataset.presenterOriginalHtml = originalHtml

  const temp = document.createElement("div")
  temp.innerHTML = originalHtml

  const sections: Array<{ title: string; html: string; isProgram: boolean }> = []
  let current: { title: string; nodes: string[]; isProgram: boolean } | null = null

  for (const node of Array.from(temp.childNodes)) {
    if (isElement(node) && node.tagName === "H2") {
      if (current) {
        sections.push({
          title: current.title,
          html: current.nodes.join(""),
          isProgram: current.isProgram,
        })
      }

      const title = node.textContent?.trim() ?? ""
      current = {
        title,
        nodes: [node.outerHTML],
        isProgram: normalizeHeading(title).includes("program"),
      }
      continue
    }

    if (current) {
      current.nodes.push(isElement(node) ? node.outerHTML : (node.textContent ?? ""))
    }
  }

  if (current) {
    sections.push({
      title: current.title,
      html: current.nodes.join(""),
      isProgram: current.isProgram,
    })
  }

  const programSection = sections.find((section) => section.isProgram) ?? null
  const bodySections = sections.filter((section) => !section.isProgram)
  const presenterSections = programSection ? [programSection, ...bodySections] : bodySections

  if (presenterSections.length === 0) {
    return null
  }

  return { originalHtml, programSection, bodySections, presenterSections }
}

function renderFloatingControls(total: number, current: number) {
  let controls = document.querySelector(".presenter-hover-zone") as HTMLElement | null

  if (!controls) {
    controls = document.createElement("div")
    controls.className = "presenter-hover-zone"
    document.body.appendChild(controls)
  }

  controls.innerHTML = `
    <div class="presenter-floating-controls">
      <div class="presenter-floating-title">Presenter</div>
      <div class="presenter-progress">Section ${current + 1} / ${total}</div>
      <div class="presenter-sidebar-actions">
        <button type="button" class="presenter-prev" aria-label="Previous section">←</button>
        <button type="button" class="presenter-next" aria-label="Next section">→</button>
        <button type="button" class="presenter-close" aria-label="Exit presenter mode">✕</button>
      </div>
    </div>
  `
}

function renderLeftSidebar(programHtml: string | null, total: number, current: number) {
  const leftSidebar = document.querySelector(".sidebar.left") as HTMLElement | null
  if (!leftSidebar) return

  if (!leftSidebar.dataset.presenterOriginalHtml) {
    leftSidebar.dataset.presenterOriginalHtml = leftSidebar.innerHTML
  }

  document.documentElement.setAttribute("presenter-slide", current === 0 ? "program" : "content")

  if (current === 0) {
    leftSidebar.innerHTML = ""
  } else {
    leftSidebar.innerHTML = `
      <div class="presenter-sidebar">
        <div class="presenter-program">${programHtml ?? "<h2>Program</h2><p>No program section found.</p>"}</div>
      </div>
    `
  }

  renderFloatingControls(total, current)
}

function restoreLeftSidebar() {
  const leftSidebar = document.querySelector(".sidebar.left") as HTMLElement | null
  if (leftSidebar) {
    const originalHtml = leftSidebar.dataset.presenterOriginalHtml
    if (originalHtml) {
      leftSidebar.innerHTML = originalHtml
    }
  }

  document.querySelector(".presenter-hover-zone")?.remove()
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function getTransitionTargets() {
  return [
    document.querySelector(".sidebar.left"),
    document.querySelector(".sidebar.right"),
    document.querySelector(".center .page-header"),
    document.querySelector(".center article"),
    document.querySelector("footer"),
    document.querySelector(".page-footer"),
  ].filter((el): el is HTMLElement => el instanceof HTMLElement)
}

async function animateModeTransition(updateMode: () => void) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion) {
    updateMode()
    return
  }

  const outgoing = getTransitionTargets()
  outgoing.forEach((el) => {
    el.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(10px) scale(0.99)" },
      ],
      {
        duration: 110,
        easing: "ease-in",
        fill: "forwards",
      },
    )
  })

  await sleep(100)
  updateMode()
  await sleep(16)

  const incoming = getTransitionTargets()
  incoming.forEach((el) => {
    el.animate(
      [
        { opacity: 0, transform: "translateY(10px) scale(0.99)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      {
        duration: 180,
        easing: "ease-out",
        fill: "both",
      },
    )
  })
}

function isProgramSlideTransition(fromIndex: number, toIndex: number) {
  return (fromIndex === 0 && toIndex === 1) || (fromIndex === 1 && toIndex === 0)
}

async function animateProgramSlideTransition(updateUI: () => void) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion) {
    updateUI()
    return
  }

  const targets = [
    document.querySelector(".center article"),
    document.querySelector(".sidebar.left"),
  ].filter((el): el is HTMLElement => el instanceof HTMLElement)

  const fadeOuts = targets.map((el) =>
    el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 400,
      easing: "ease-out",
      fill: "forwards",
    }),
  )

  await Promise.all(fadeOuts.map((animation) => animation.finished.catch(() => undefined)))
  updateUI()
  await sleep(16)

  const nextTargets = [
    document.querySelector(".center article"),
    document.querySelector(".sidebar.left"),
  ].filter((el): el is HTMLElement => el instanceof HTMLElement)

  nextTargets.forEach((el) => {
    el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 600,
      easing: "ease-in",
      fill: "both",
    })
  })
}

async function showActiveSection(index: number) {
  const sections = Array.from(document.querySelectorAll(".presenter-section")) as HTMLElement[]
  if (sections.length === 0) return

  const previousIndex = activeSectionIndex
  activeSectionIndex = Math.max(0, Math.min(index, sections.length - 1))

  const updateUI = () => {
    sections.forEach((section, sectionIndex) => {
      section.classList.toggle("active", sectionIndex === activeSectionIndex)
    })

    const article = document.querySelector(".center article") as HTMLElement | null
    const contentRoot = article ? getPresenterContentRoot(article) : null
    const model = contentRoot ? buildPresenterModel(contentRoot) : null
    renderLeftSidebar(model?.programSection?.html ?? null, sections.length, activeSectionIndex)
  }

  if (isProgramSlideTransition(previousIndex, activeSectionIndex)) {
    void animateProgramSlideTransition(updateUI)
  } else {
    updateUI()
  }
}

function applyPresenterMode() {
  const article = document.querySelector(".center article") as HTMLElement | null
  if (!article) return

  const contentRoot = getPresenterContentRoot(article)
  const model = buildPresenterModel(contentRoot)
  if (!model) return

  activeSectionIndex = Math.max(0, Math.min(activeSectionIndex, model.presenterSections.length - 1))
  article.classList.add("presenter-mode-active")
  contentRoot.innerHTML = `<div class="presenter-sections">${model.presenterSections
    .map(
      (section, index) =>
        `<section class="presenter-section${index === activeSectionIndex ? " active" : ""}" data-index="${index}">${section.html}</section>`,
    )
    .join("")}</div>`

  renderLeftSidebar(
    model.programSection?.html ?? null,
    model.presenterSections.length,
    activeSectionIndex,
  )
  document.documentElement.setAttribute("presenter-mode", "on")
}

function disablePresenterMode() {
  const article = document.querySelector(".center article") as HTMLElement | null
  const contentRoot = article ? getPresenterContentRoot(article) : null
  if (contentRoot?.dataset.presenterOriginalHtml) {
    contentRoot.innerHTML = contentRoot.dataset.presenterOriginalHtml
  }

  article?.classList.remove("presenter-mode-active")

  restoreLeftSidebar()
  document.documentElement.setAttribute("presenter-mode", "off")
  document.documentElement.removeAttribute("presenter-slide")
}

async function togglePresenterMode() {
  isPresenterMode = !isPresenterMode
  activeSectionIndex = 0

  await animateModeTransition(() => {
    if (isPresenterMode) {
      applyPresenterMode()
    } else {
      disablePresenterMode()
    }
  })
}

function nextSection() {
  showActiveSection(activeSectionIndex + 1)
}

function prevSection() {
  showActiveSection(activeSectionIndex - 1)
}

function handleSidebarClick(e: Event) {
  const target = e.target as HTMLElement | null
  const button = target?.closest("button") as HTMLButtonElement | null
  if (!button) return

  if (button.classList.contains("presenter-close")) {
    isPresenterMode = false
    void animateModeTransition(() => disablePresenterMode())
  } else if (button.classList.contains("presenter-prev")) {
    prevSection()
  } else if (button.classList.contains("presenter-next")) {
    nextSection()
  }
}

document.addEventListener("nav", async () => {
  const toggleButtons = document.getElementsByClassName("presentermode")
  Array.from(toggleButtons).forEach((button) => {
    const clickHandler = () => void togglePresenterMode()
    button.addEventListener("click", clickHandler)
    window.addCleanup(() => button.removeEventListener("click", clickHandler))
  })

  function shortcutHandler(e: HTMLElementEventMap["keydown"]) {
    if (e.key.toLowerCase() === "p" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault()
      void togglePresenterMode()
      return
    }

    if (!isPresenterMode) return

    const key = e.key.toLowerCase()

    if (["arrowright", "arrowdown", "pagedown", " ", "j"].includes(key)) {
      e.preventDefault()
      nextSection()
    } else if (["arrowleft", "arrowup", "pageup", "k"].includes(key)) {
      e.preventDefault()
      prevSection()
    } else if (e.key === "Home") {
      e.preventDefault()
      showActiveSection(0)
    } else if (e.key === "End") {
      e.preventDefault()
      const total = document.querySelectorAll(".presenter-section").length
      showActiveSection(total - 1)
    } else if (e.key === "Escape") {
      e.preventDefault()
      isPresenterMode = false
      void animateModeTransition(() => disablePresenterMode())
    }
  }

  document.addEventListener("keydown", shortcutHandler)
  document.addEventListener("click", handleSidebarClick)
  window.addCleanup(() => {
    document.removeEventListener("keydown", shortcutHandler)
    document.removeEventListener("click", handleSidebarClick)
  })

  const params = new URLSearchParams(window.location.search)
  if (isPresenterMode || params.get("presenter") === "true") {
    isPresenterMode = true
    applyPresenterMode()
  } else {
    document.documentElement.setAttribute("presenter-mode", "off")
  }
})
