const $ = (id) => document.getElementById(id)
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1 }
const rint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const nonZero = (max) => { let n = 0; while (n === 0) n = rint(-max, max); return n }
const nonTriv = (max) => { let n = 0; while (n === 0 || Math.abs(n) === 1) n = rint(-max, max); return n }
const sign = (n) => n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`
const term = (a) => a === 1 ? "x" : a === -1 ? "-x" : `${a}x`
const reduce = (num, den) => { const g = gcd(num, den); let n = num / g, d = den / g; if (d < 0) { n = -n; d = -d } return [n, d] }
const parseFraction = (raw) => {
  const s = raw.trim().replace(/−/g, "-").replace(/,/g, ".")
  if (/^-?\d+$/.test(s)) return { num: Number(s), den: 1 }
  const m = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (!m || Number(m[2]) === 0) return null
  return { num: Number(m[1]), den: Number(m[2]) }
}

let level = 1
let eq = null
let step = 0
let streak = Number(localStorage.getItem("matly-streak") || 0)
$("streak").textContent = streak

function makeEquation() {
  if (level === 1) {
    while (true) {
      const a = nonZero(10), b = nonZero(10), c = rint(-10, 10)
      if (c === b) continue
      const numerator = c - b, denominator = a
      const [rn, rd] = reduce(numerator, denominator)
      return { a, b, c, numerator, denominator, rn, rd }
    }
  }
  if (level === 2) {
    while (true) {
      const a = nonZero(10), c = nonZero(10), b = nonZero(10), d = rint(-10, 10)
      if (a === c || d === b) continue
      const denominator = a - c, numerator = d - b
      const [rn, rd] = reduce(numerator, denominator)
      return { a, b, c, d, denominator, numerator, rn, rd }
    }
  }
  while (true) {
    const a = nonTriv(10), b = nonZero(10), c = nonZero(10), d = nonZero(10)
    const e = nonTriv(10), f = nonZero(10), g = nonZero(10), h = nonZero(10)
    const lhsCoeff = a * b, lhsConst = a * c + d, rhsCoeff = e * f, rhsConst = e * g + h
    const numerator = rhsConst - lhsConst, denominator = lhsCoeff - rhsCoeff
    if (denominator === 0) continue
    const [rn, rd] = reduce(numerator, denominator)
    return { a, b, c, d, e, f, g, h, lhsCoeff, lhsConst, rhsCoeff, rhsConst, numerator, denominator, rn, rd }
  }
}

function equationText() {
  if (level === 1) return `${term(eq.a)} ${sign(eq.b)} = ${eq.c}`
  if (level === 2) return `${term(eq.a)} ${sign(eq.b)} = ${term(eq.c)} ${sign(eq.d)}`
  return `${eq.a}(${term(eq.b)} ${sign(eq.c)}) ${sign(eq.d)} = ${eq.e}(${term(eq.f)} ${sign(eq.g)}) ${sign(eq.h)}`
}

function expected() {
  if (level === 1) return step === 0 ? eq.numerator : { num: eq.rn, den: eq.rd }
  if (level === 2) return step === 0 ? eq.denominator : step === 1 ? eq.numerator : { num: eq.rn, den: eq.rd }
  return [
    `${eq.lhsCoeff}, ${eq.a * eq.c}, ${eq.rhsCoeff}, ${eq.e * eq.g}`,
    `${eq.lhsConst}, ${eq.rhsConst}`,
    eq.denominator,
    eq.numerator,
    { num: eq.rn, den: eq.rd },
  ][step]
}

function render() {
  $("equation").textContent = equationText()
  const steps = []
  if (level === 1) steps.push(`Flyt konstanten: ${term(eq.a)} = ?`, "Isolér x: x = ?")
  if (level === 2) steps.push("Saml x-leddene: ?x = …", "Saml tallene: … = ?", "Isolér x: x = ?")
  if (level === 3) steps.push("Gang parenteserne ud: skriv fire tal adskilt med komma", "Saml konstanterne: skriv to tal adskilt med komma", "Saml x-leddene: ?x = …", "Saml tallene: … = ?", "Isolér x: x = ?")
  $("steps").innerHTML = steps.map((s, i) => `<li${i === step ? ' class="current"' : ''}>${i < step ? "✓ " : ""}${s}</li>`).join("")
  $("answer-label").textContent = step === steps.length - 1 ? "x =" : "Svar"
  $("answer").value = ""
  $("answer").focus()
}

function setFeedback(text, cls = "") { $("feedback").textContent = text; $("feedback").className = `feedback ${cls}` }
function bump(ok) { streak = ok ? streak + 1 : 0; localStorage.setItem("matly-streak", streak); $("streak").textContent = streak }
function newGame() { eq = makeEquation(); step = 0; setFeedback(""); render() }

function check() {
  const raw = $("answer").value.trim()
  let ok = false
  const exp = expected()
  if (typeof exp === "number") ok = Number(raw) === exp
  else if (typeof exp === "string") ok = raw.replace(/\s+/g, "") === exp.replace(/\s+/g, "")
  else {
    const ans = parseFraction(raw)
    ok = !!ans && ans.num === exp.num && ans.den === exp.den
  }
  if (!ok) { bump(false); setFeedback("Ikke helt. Prøv igen — eller brug hint.", "bad"); return }
  step++
  const total = level === 1 ? 2 : level === 2 ? 3 : 5
  if (step >= total) { bump(true); setFeedback("Korrekt! Flot løst. Tryk ‘Ny ligning’ for næste opgave.", "ok") }
  else { setFeedback("Korrekt — videre til næste trin.", "ok"); render() }
}

$("answer-form").addEventListener("submit", (e) => { e.preventDefault(); check() })
$("new").addEventListener("click", newGame)
$("hint").addEventListener("click", () => setFeedback(`Hint: forventet format her er ${typeof expected() === "object" ? "en forkortet brøk, fx -3/4" : "et helt tal"}.`, ""))
document.querySelectorAll(".level").forEach((btn) => btn.addEventListener("click", () => {
  level = Number(btn.dataset.level)
  document.querySelectorAll(".level").forEach((b) => b.classList.toggle("is-active", b === btn))
  newGame()
}))
newGame()
