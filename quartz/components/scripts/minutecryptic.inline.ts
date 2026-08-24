type MinuteCrypticState = {
  clue: string
  answer: string
  normalizedAnswer: string
  enumeration: string
  definition: string
  indicator: string
  fodder: string
  explanation: string
  guess: string[]
  revealedIndexes: Set<number>
  message: string
  solved: boolean
  revealed: boolean
  showDefinition: boolean
  showIndicator: boolean
  showFodder: boolean
  showExplanation: boolean
}

const MINUTE_CRYPTIC_ALPHABET = "abcdefghijklmnopqrstuvwxyz"

function parseMinuteCrypticKeyValueBlock(input: string) {
  const params: Record<string, string> = {}

  for (const line of input.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const separatorIndex = trimmed.indexOf(":")
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim().toLowerCase()
    const value = trimmed.slice(separatorIndex + 1).trim()
    if (key && value) params[key] = value
  }

  return params
}

function escapeMinuteCrypticHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function normalizeAnswer(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function splitHighlightParts(value: string) {
  return value
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
}

function findHighlightRanges(clue: string, snippet: string) {
  const ranges: Array<{ start: number; end: number }> = []
  const lowerClue = clue.toLowerCase()
  const lowerSnippet = snippet.toLowerCase()
  let startIndex = 0

  while (startIndex < clue.length) {
    const foundIndex = lowerClue.indexOf(lowerSnippet, startIndex)
    if (foundIndex === -1) break
    ranges.push({ start: foundIndex, end: foundIndex + snippet.length })
    startIndex = foundIndex + snippet.length
  }

  return ranges
}

function renderHighlightedClue(state: MinuteCrypticState) {
  const highlights = [
    ...(state.showDefinition
      ? splitHighlightParts(state.definition).flatMap((snippet) =>
          findHighlightRanges(state.clue, snippet).map((range) => ({
            ...range,
            type: "definition" as const,
          })),
        )
      : []),
    ...(state.showIndicator
      ? splitHighlightParts(state.indicator).flatMap((snippet) =>
          findHighlightRanges(state.clue, snippet).map((range) => ({
            ...range,
            type: "indicator" as const,
          })),
        )
      : []),
    ...(state.showFodder
      ? splitHighlightParts(state.fodder).flatMap((snippet) =>
          findHighlightRanges(state.clue, snippet).map((range) => ({
            ...range,
            type: "fodder" as const,
          })),
        )
      : []),
  ].sort((a, b) => a.start - b.start || a.end - b.end)

  let html = ""
  let cursor = 0

  for (const highlight of highlights) {
    if (highlight.start < cursor) continue
    html += escapeMinuteCrypticHtml(state.clue.slice(cursor, highlight.start))
    html += `<span class="minutecryptic-highlight is-${highlight.type}">${escapeMinuteCrypticHtml(state.clue.slice(highlight.start, highlight.end))}</span>`
    cursor = highlight.end
  }

  html += escapeMinuteCrypticHtml(state.clue.slice(cursor))
  return html
}

function getMinuteCrypticState(container: HTMLElement) {
  return (container as any)._minuteCrypticState as MinuteCrypticState | undefined
}

function getFilledCount(state: MinuteCrypticState) {
  return state.guess.filter(Boolean).length
}

function getCurrentGuess(state: MinuteCrypticState) {
  return state.guess.join("")
}

function getNextEmptyIndex(state: MinuteCrypticState) {
  return state.guess.findIndex((char) => !char)
}

function getLastEditableFilledIndex(state: MinuteCrypticState) {
  for (let index = state.guess.length - 1; index >= 0; index -= 1) {
    if (state.revealedIndexes.has(index)) continue
    if (state.guess[index]) return index
  }

  return -1
}

function getNextHintIndex(state: MinuteCrypticState) {
  const candidates: number[] = []

  for (let index = 0; index < state.normalizedAnswer.length; index += 1) {
    if (state.revealedIndexes.has(index)) continue
    if (state.guess[index] !== state.normalizedAnswer[index]) candidates.push(index)
  }

  if (candidates.length === 0) return -1
  return candidates[Math.floor(Math.random() * candidates.length)] ?? -1
}

function renderGuessSlots(state: MinuteCrypticState) {
  return Array.from({ length: state.normalizedAnswer.length }, (_, index) => {
    const char = state.revealed ? state.normalizedAnswer[index] : (state.guess[index] ?? "")
    const classes = ["minutecryptic-slot"]
    if (char) classes.push("is-filled")
    if (state.revealedIndexes.has(index) || state.revealed) classes.push("is-hint")

    return `<span class="${classes.join(" ")}">${char ? escapeMinuteCrypticHtml(char) : ""}</span>`
  }).join("")
}

function renderMinuteCryptic(container: HTMLElement, state: MinuteCrypticState) {
  const clue = container.querySelector(".minutecryptic-clue") as HTMLElement | null
  const enumeration = container.querySelector(".minutecryptic-enumeration") as HTMLElement | null
  const slots = container.querySelector(".minutecryptic-slots") as HTMLElement | null
  const status = container.querySelector(".minutecryptic-status") as HTMLElement | null
  const answer = container.querySelector(".minutecryptic-answer") as HTMLElement | null
  const explanation = container.querySelector(".minutecryptic-explanation") as HTMLElement | null
  const keyboardButtons = Array.from(
    container.querySelectorAll(".minutecryptic-key"),
  ) as HTMLButtonElement[]

  if (clue) clue.innerHTML = renderHighlightedClue(state)
  if (enumeration) enumeration.textContent = state.enumeration ? `(${state.enumeration})` : ""
  if (slots) slots.innerHTML = renderGuessSlots(state)
  if (status) {
    status.textContent = state.message
    status.dataset.state = state.solved ? "solved" : state.message ? "active" : "idle"
  }
  if (answer) {
    answer.textContent = state.solved || state.revealed ? `Answer: ${state.answer}` : ""
  }
  if (explanation) {
    explanation.innerHTML =
      state.showExplanation && state.explanation ? escapeMinuteCrypticHtml(state.explanation) : ""
    explanation.hidden = !(state.showExplanation && state.explanation)
  }

  const entryLocked =
    state.solved || state.revealed || getFilledCount(state) >= state.normalizedAnswer.length
  keyboardButtons.forEach((button) => {
    button.disabled = state.solved || state.revealed || entryLocked
  })

  const backspaceButton = container.querySelector(
    ".minutecryptic-backspace",
  ) as HTMLButtonElement | null
  if (backspaceButton) {
    backspaceButton.disabled =
      state.solved || state.revealed || getLastEditableFilledIndex(state) === -1
  }

  const clearButton = container.querySelector(".minutecryptic-clear") as HTMLButtonElement | null
  if (clearButton) {
    clearButton.disabled = state.solved || state.revealed || getFilledCount(state) === 0
  }

  const hintButton = container.querySelector(
    ".minutecryptic-hint-letter",
  ) as HTMLButtonElement | null
  if (hintButton) {
    hintButton.disabled = state.solved || state.revealed || getNextHintIndex(state) === -1
  }

  const checkButton = container.querySelector(".minutecryptic-check") as HTMLButtonElement | null
  if (checkButton) {
    checkButton.disabled =
      state.solved || state.revealed || getFilledCount(state) !== state.normalizedAnswer.length
  }

  container
    .querySelector(".minutecryptic-definition-toggle")
    ?.classList.toggle("is-active", state.showDefinition)
  container
    .querySelector(".minutecryptic-indicator-toggle")
    ?.classList.toggle("is-active", state.showIndicator)
  container
    .querySelector(".minutecryptic-fodder-toggle")
    ?.classList.toggle("is-active", state.showFodder)
  container
    .querySelector(".minutecryptic-explain-toggle")
    ?.classList.toggle("is-active", state.showExplanation)
}

function appendGuess(container: HTMLElement, char: string) {
  const state = getMinuteCrypticState(container)
  if (!state || state.solved || state.revealed) return
  if (!/[a-z0-9]/i.test(char)) return

  const nextIndex = getNextEmptyIndex(state)
  if (nextIndex === -1) return

  state.guess[nextIndex] = char.toLowerCase()
  if (
    state.message === "Not quite — try again." ||
    state.message === "Choose an answer first." ||
    state.message.startsWith("Need ")
  ) {
    state.message = ""
  }
  renderMinuteCryptic(container, state)
}

function backspaceGuess(container: HTMLElement) {
  const state = getMinuteCrypticState(container)
  if (!state || state.solved || state.revealed) return

  const index = getLastEditableFilledIndex(state)
  if (index === -1) return

  state.guess[index] = ""
  if (
    state.message === "Not quite — try again." ||
    state.message === "Choose an answer first." ||
    state.message.startsWith("Need ")
  ) {
    state.message = ""
  }
  renderMinuteCryptic(container, state)
}

function clearGuess(container: HTMLElement) {
  const state = getMinuteCrypticState(container)
  if (!state || state.solved || state.revealed) return

  state.guess = state.guess.map((char, index) => (state.revealedIndexes.has(index) ? char : ""))
  if (
    state.message === "Not quite — try again." ||
    state.message === "Choose an answer first." ||
    state.message.startsWith("Need ")
  ) {
    state.message = ""
  }
  renderMinuteCryptic(container, state)
}

function revealLetter(container: HTMLElement) {
  const state = getMinuteCrypticState(container)
  if (!state || state.solved || state.revealed) return

  const index = getNextHintIndex(state)
  if (index === -1) return

  state.guess[index] = state.normalizedAnswer[index] ?? ""
  state.revealedIndexes.add(index)
  state.message = "Revealed a letter."
  renderMinuteCryptic(container, state)
}

function checkGuess(container: HTMLElement) {
  const state = getMinuteCrypticState(container)
  if (!state || state.solved || state.revealed) return

  const currentGuess = getCurrentGuess(state)

  if (!currentGuess) {
    state.message = "Choose an answer first."
  } else if (getFilledCount(state) !== state.normalizedAnswer.length) {
    state.message = `Need ${state.normalizedAnswer.length} letters.`
  } else if (currentGuess === state.normalizedAnswer) {
    state.solved = true
    state.message = "Correct!"
  } else {
    state.message = "Not quite — try again."
  }

  renderMinuteCryptic(container, state)
}

function initMinuteCryptic(container: HTMLElement) {
  const clue = container.dataset.clue ?? ""
  const answer = container.dataset.answer ?? ""
  const enumeration = container.dataset.enumeration ?? ""
  const definition = container.dataset.definition ?? ""
  const indicator = container.dataset.indicator ?? ""
  const fodder = container.dataset.fodder ?? ""
  const explanation = container.dataset.explanation ?? ""
  const normalizedAnswer = normalizeAnswer(answer)

  container.innerHTML = `
    <div class="minutecryptic-card">
      <div class="minutecryptic-header">
        <div class="minutecryptic-label">Minute Cryptic</div>
        <div class="minutecryptic-enumeration"></div>
      </div>
      <div class="minutecryptic-clue"></div>
      <div class="minutecryptic-slots" aria-label="Answer slots"></div>
      <div class="minutecryptic-keys">
        ${Array.from(MINUTE_CRYPTIC_ALPHABET)
          .map(
            (letter) =>
              `<button type="button" class="minutecryptic-key" data-letter="${letter}">${letter}</button>`,
          )
          .join("")}
      </div>
      <div class="minutecryptic-entry-actions">
        <button type="button" class="minutecryptic-backspace">Backspace</button>
        <button type="button" class="minutecryptic-clear">Clear</button>
        <button type="button" class="minutecryptic-hint-letter">Hint letter</button>
        <button type="button" class="minutecryptic-check">Check</button>
      </div>
      <div class="minutecryptic-status" data-state="idle"></div>
      <div class="minutecryptic-answer"></div>
      <div class="minutecryptic-explanation" hidden></div>
      <div class="minutecryptic-actions">
        <button type="button" class="minutecryptic-definition-toggle">Definition</button>
        <button type="button" class="minutecryptic-indicator-toggle">Indicator</button>
        <button type="button" class="minutecryptic-fodder-toggle">Fodder</button>
        <button type="button" class="minutecryptic-explain-toggle">Parsing</button>
        <button type="button" class="minutecryptic-reset">Reset</button>
        <button type="button" class="minutecryptic-reveal">Reveal</button>
      </div>
    </div>
  `
  ;(container as any)._minuteCrypticState = {
    clue,
    answer,
    normalizedAnswer,
    enumeration,
    definition,
    indicator,
    fodder,
    explanation,
    guess: Array.from({ length: normalizedAnswer.length }, () => ""),
    revealedIndexes: new Set<number>(),
    message: "",
    solved: false,
    revealed: false,
    showDefinition: false,
    showIndicator: false,
    showFodder: false,
    showExplanation: false,
  } satisfies MinuteCrypticState

  container.querySelectorAll(".minutecryptic-key").forEach((button) => {
    button.addEventListener("click", () => {
      appendGuess(container, (button as HTMLElement).dataset.letter ?? "")
    })
  })

  container.querySelector(".minutecryptic-backspace")?.addEventListener("click", () => {
    backspaceGuess(container)
  })
  container.querySelector(".minutecryptic-clear")?.addEventListener("click", () => {
    clearGuess(container)
  })
  container.querySelector(".minutecryptic-hint-letter")?.addEventListener("click", () => {
    revealLetter(container)
  })
  container.querySelector(".minutecryptic-check")?.addEventListener("click", () => {
    checkGuess(container)
  })
  container.querySelector(".minutecryptic-definition-toggle")?.addEventListener("click", () => {
    const state = getMinuteCrypticState(container)
    if (!state) return
    state.showDefinition = !state.showDefinition
    renderMinuteCryptic(container, state)
  })
  container.querySelector(".minutecryptic-indicator-toggle")?.addEventListener("click", () => {
    const state = getMinuteCrypticState(container)
    if (!state) return
    state.showIndicator = !state.showIndicator
    renderMinuteCryptic(container, state)
  })
  container.querySelector(".minutecryptic-fodder-toggle")?.addEventListener("click", () => {
    const state = getMinuteCrypticState(container)
    if (!state) return
    state.showFodder = !state.showFodder
    renderMinuteCryptic(container, state)
  })
  container.querySelector(".minutecryptic-explain-toggle")?.addEventListener("click", () => {
    const state = getMinuteCrypticState(container)
    if (!state) return
    state.showExplanation = !state.showExplanation
    renderMinuteCryptic(container, state)
  })
  container.querySelector(".minutecryptic-reset")?.addEventListener("click", () => {
    initMinuteCryptic(container)
  })
  container.querySelector(".minutecryptic-reveal")?.addEventListener("click", () => {
    const state = getMinuteCrypticState(container)
    if (!state) return
    state.revealed = true
    state.message = "Revealed."
    renderMinuteCryptic(container, state)
  })

  container.addEventListener("keydown", (event) => {
    if (!(event.target instanceof HTMLElement) || !container.contains(event.target)) return

    if (/^[a-z]$/i.test(event.key)) {
      event.preventDefault()
      appendGuess(container, event.key)
      return
    }

    if (event.key === "Backspace") {
      event.preventDefault()
      backspaceGuess(container)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      checkGuess(container)
    }
  })

  renderMinuteCryptic(container, getMinuteCrypticState(container)!)
}

function hydrateMinuteCrypticWidgets(root: ParentNode | Document = document) {
  const widgets = Array.from(root.querySelectorAll(".minutecryptic-widget")) as HTMLElement[]

  for (const widget of widgets) {
    if ((widget as any)._minuteCrypticState) continue
    initMinuteCryptic(widget)
  }
}

function upgradeMinuteCrypticPlaceholders(root: ParentNode | Document = document) {
  const candidates = Array.from(root.querySelectorAll("pre > code")) as HTMLElement[]

  for (const code of candidates) {
    const pre = code.parentElement
    if (!pre || pre.dataset.minutecrypticUpgraded === "true") continue

    const params = parseMinuteCrypticKeyValueBlock(code.textContent ?? "")
    const clue = params.clue
    const answer = params.answer ?? params.solution
    if (!clue || !answer) continue

    const nearestFigure = pre.closest(
      "figure[data-rehype-pretty-code-figure]",
    ) as HTMLElement | null
    const declaredLanguage =
      code.getAttribute("data-language") ??
      pre.getAttribute("data-language") ??
      nearestFigure?.getAttribute("data-language") ??
      ""

    const looksLikeMinuteCrypticBlock =
      declaredLanguage.toLowerCase() === "minutecryptic" ||
      declaredLanguage.toLowerCase() === "cryptic" ||
      /(\bclue\s*:|\banswer\s*:|\bsolution\s*:)/i.test(code.textContent ?? "")

    if (!looksLikeMinuteCrypticBlock) continue

    const widget = document.createElement("div")
    widget.className = "minutecryptic-widget"
    widget.dataset.clue = clue
    widget.dataset.answer = answer
    widget.dataset.enumeration = params.enumeration ?? params.enum ?? params.length ?? ""
    widget.dataset.definition = params.definition ?? ""
    widget.dataset.indicator = params.indicator ?? ""
    widget.dataset.fodder = params.fodder ?? ""
    widget.dataset.explanation = params.explanation ?? params.parse ?? ""
    widget.tabIndex = 0

    pre.dataset.minutecrypticUpgraded = "true"
    if (nearestFigure) {
      nearestFigure.replaceWith(widget)
    } else {
      pre.replaceWith(widget)
    }
    initMinuteCryptic(widget)
  }
}

;(window as any).upgradeMinuteCrypticPlaceholders = upgradeMinuteCrypticPlaceholders
;(window as any).hydrateMinuteCrypticWidgets = hydrateMinuteCrypticWidgets

function bootMinuteCryptic(root: ParentNode | Document = document) {
  upgradeMinuteCrypticPlaceholders(root)
  hydrateMinuteCrypticWidgets(root)
}

;(window as any).bootMinuteCryptic = bootMinuteCryptic

document.addEventListener("nav", () => bootMinuteCryptic(document))
document.addEventListener("DOMContentLoaded", () => bootMinuteCryptic(document))
queueMicrotask(() => bootMinuteCryptic(document))
