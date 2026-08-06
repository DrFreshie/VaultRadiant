function decorateExplorer() {}

document.addEventListener("nav", decorateExplorer)
document.addEventListener("DOMContentLoaded", decorateExplorer)
queueMicrotask(decorateExplorer)
