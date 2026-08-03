function normalizeMaterialsHeading(text: string) {
  return text.replace(/^[^\p{L}\p{N}]+/gu, "").trim().toLowerCase()
}

function moveMaterialsSection() {
  const rightSidebar = document.querySelector(".sidebar.right") as HTMLElement | null
  const lessonContent = document.querySelector(".lesson-content") as HTMLElement | null
  if (!rightSidebar || !lessonContent) return
  if (rightSidebar.querySelector(".materials-sidebar-section")) return

  const headings = Array.from(lessonContent.querySelectorAll(":scope > h2")) as HTMLHeadingElement[]
  const materialsHeading = headings.find(
    (heading) => normalizeMaterialsHeading(heading.textContent ?? "") === "materials",
  )
  if (!materialsHeading) return

  const panel = document.createElement("section")
  panel.className = "materials-sidebar-section"

  const title = document.createElement("h3")
  title.textContent = materialsHeading.textContent ?? "Materials"
  panel.appendChild(title)

  const content = document.createElement("div")
  content.className = "materials-sidebar-content"
  panel.appendChild(content)

  let node: ChildNode | null = materialsHeading.nextSibling
  materialsHeading.remove()

  while (node) {
    const next = node.nextSibling
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "H2") {
      break
    }

    content.appendChild(node)
    node = next
  }

  rightSidebar.appendChild(panel)
}

document.addEventListener("nav", moveMaterialsSection)
document.addEventListener("DOMContentLoaded", moveMaterialsSection)
queueMicrotask(moveMaterialsSection)
