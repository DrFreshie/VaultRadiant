type HangmanState = {
  answer: string
  guessed: Set<string>
  wrong: number
  maxWrong: number
}

const DEFAULT_ALPHABET = "abcdefghijklmnopqrstuvwxyz"

function parseKeyValueBlock(input: string) {
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

function normalizeLetter(char: string) {
  return char.toLowerCase()
}

function getUniqueLetters(answer: string) {
  return Array.from(new Set(Array.from(answer.toLowerCase()).filter((char) => /[a-z]/i.test(char))))
}

function maskAnswer(answer: string, guessed: Set<string>) {
  return Array.from(answer).map((char) => {
    if (!/[a-z]/i.test(char)) return char
    return guessed.has(normalizeLetter(char)) ? char : "_"
  })
}

function createKeyboard(alphabet: string) {
  return Array.from(new Set(Array.from(alphabet.toLowerCase()).filter((char) => /[a-z]/i.test(char))))
}

function renderGame(container: HTMLElement, state: HangmanState) {
  const uniqueLetters = getUniqueLetters(state.answer)
  const masked = maskAnswer(state.answer, state.guessed)
  const solved = uniqueLetters.every((letter) => state.guessed.has(letter))
  const lost = state.wrong >= state.maxWrong
  const finished = solved || lost

  const word = container.querySelector(".hangman-word") as HTMLElement | null
  const status = container.querySelector(".hangman-status") as HTMLElement | null
  const wrong = container.querySelector(".hangman-wrong") as HTMLElement | null
  const figure = container.querySelector(".hangman-figure") as HTMLElement | null
  const answer = container.querySelector(".hangman-answer") as HTMLElement | null

  if (word) {
    word.innerHTML = masked
      .map((char) => `<span class="hangman-word__char">${char === " " ? "&nbsp;" : char}</span>`)
      .join("")
  }

  if (status) {
    status.textContent = solved
      ? "You won!"
      : lost
        ? "Game over"
        : ""
  }

  if (wrong) {
    const wrongLetters = Array.from(state.guessed).filter((letter) => !state.answer.toLowerCase().includes(letter))
  }

  if (figure) {
    figure.setAttribute("data-stage", String(state.wrong))
  }

  if (answer) {
    answer.textContent = lost ? `Answer: ${state.answer}` : ""
  }

  const buttons = Array.from(container.querySelectorAll(".hangman-key")) as HTMLButtonElement[]
  buttons.forEach((button) => {
    const letter = button.dataset.letter ?? ""
    const guessed = state.guessed.has(letter)
    button.disabled = guessed || finished
    button.classList.toggle("is-guessed", guessed)
    button.classList.toggle("is-correct", guessed && state.answer.toLowerCase().includes(letter))
    button.classList.toggle("is-wrong", guessed && !state.answer.toLowerCase().includes(letter))
  })
}

function guessLetter(container: HTMLElement, letter: string) {
  const state = (container as any)._hangmanState as HangmanState | undefined
  if (!state) return

  const normalized = normalizeLetter(letter)
  if (state.guessed.has(normalized)) return
  if (state.wrong >= state.maxWrong) return
  if (getUniqueLetters(state.answer).every((char) => state.guessed.has(char))) return

  state.guessed.add(normalized)
  if (!state.answer.toLowerCase().includes(normalized)) {
    state.wrong += 1
  }

  renderGame(container, state)
}

function initGame(container: HTMLElement) {
  const answer = container.dataset.answer ?? ""
  const hint = container.dataset.hint ?? ""
  const maxWrong = Number(container.dataset.maxWrong ?? "6")
  const alphabet = createKeyboard(container.dataset.alphabet ?? DEFAULT_ALPHABET)

  container.innerHTML = `
    <div class="hangman-card">
      <div class="hangman-top">
        <div class="hangman-figure" data-stage="0">
          <span class="hangman-part part-head"></span>
          <span class="hangman-part part-body"></span>
          <span class="hangman-part part-arm-left"></span>
          <span class="hangman-part part-arm-right"></span>
          <span class="hangman-part part-leg-left"></span>
          <span class="hangman-part part-leg-right"></span>
        </div>
        <div class="hangman-meta">
          ${hint ? `<div class="hangman-hint">Hint: ${hint}</div>` : ""}
          <div class="hangman-status"></div>
          <div class="hangman-wrong"></div>
          <div class="hangman-answer"></div>
        </div>
      </div>
      <div class="hangman-word"></div>
      <div class="hangman-keys">
        ${alphabet.map((letter) => `<button type="button" class="hangman-key" data-letter="${letter}">${letter}</button>`).join("")}
      </div>
      <div class="hangman-actions">
        <button type="button" class="hangman-reset">Reset</button>
        <button type="button" class="hangman-reveal">Reveal</button>
      </div>
    </div>
  `

  ;(container as any)._hangmanState = {
    answer,
    guessed: new Set<string>(),
    wrong: 0,
    maxWrong,
  } satisfies HangmanState

  container.querySelectorAll(".hangman-key").forEach((button) => {
    button.addEventListener("click", () => guessLetter(container, (button as HTMLElement).dataset.letter ?? ""))
  })

  container.querySelector(".hangman-reset")?.addEventListener("click", () => initGame(container))
  container.querySelector(".hangman-reveal")?.addEventListener("click", () => {
    const state = (container as any)._hangmanState as HangmanState
    getUniqueLetters(state.answer).forEach((letter) => state.guessed.add(letter))
    renderGame(container, state)
  })

  renderGame(container, (container as any)._hangmanState)
}

function hydrateHangmanWidgets(root: ParentNode = document) {
  const widgets = Array.from(root.querySelectorAll(".hangman-widget")) as HTMLElement[]

  for (const widget of widgets) {
    if ((widget as any)._hangmanState) continue
    initGame(widget)
  }
}

function upgradeHangmanPlaceholders(root: ParentNode = document) {
  const candidates = Array.from(root.querySelectorAll("pre > code")) as HTMLElement[]

  for (const code of candidates) {
    const pre = code.parentElement
    if (!pre || pre.dataset.hangmanUpgraded === "true") continue

    const params = parseKeyValueBlock(code.textContent ?? "")
    const answer = params.word ?? params.answer
    if (!answer) continue

    const nearestFigure = pre.closest("figure[data-rehype-pretty-code-figure]") as HTMLElement | null
    const declaredLanguage =
      code.getAttribute("data-language") ??
      pre.getAttribute("data-language") ??
      nearestFigure?.getAttribute("data-language") ??
      ""

    const looksLikeHangmanBlock =
      declaredLanguage.toLowerCase() === "hangman" ||
      /(\bword\s*:|\banswer\s*:)/i.test(code.textContent ?? "")

    if (!looksLikeHangmanBlock) continue

    const widget = document.createElement("div")
    widget.className = "hangman-widget"
    widget.dataset.answer = answer
    widget.dataset.hint = params.hint ?? ""
    widget.dataset.maxWrong = params.max ?? params.lives ?? "6"
    widget.dataset.alphabet = params.alphabet ?? DEFAULT_ALPHABET

    pre.dataset.hangmanUpgraded = "true"
    if (nearestFigure) {
      nearestFigure.replaceWith(widget)
    } else {
      pre.replaceWith(widget)
    }
    initGame(widget)
  }
}

;(window as any).upgradeHangmanPlaceholders = upgradeHangmanPlaceholders
;(window as any).hydrateHangmanWidgets = hydrateHangmanWidgets

function bootHangman(root: ParentNode = document) {
  upgradeHangmanPlaceholders(root)
  hydrateHangmanWidgets(root)
}

;(window as any).bootHangman = bootHangman

document.addEventListener("nav", () => bootHangman(document))
document.addEventListener("DOMContentLoaded", () => bootHangman(document))
queueMicrotask(() => bootHangman(document))
