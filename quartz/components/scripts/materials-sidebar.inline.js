"use strict";
function normalizeSidebarHeading(text) {
    return text.replace(/^[^\p{L}\p{N}]+/gu, "").trim().toLowerCase();
}
function moveLessonSectionToSidebar(sectionName, className) {
    const rightSidebar = document.querySelector(".sidebar.right");
    const lessonContent = document.querySelector(".lesson-content");
    if (!rightSidebar || !lessonContent)
        return null;
    if (rightSidebar.querySelector(`.${className}`)) {
        return rightSidebar.querySelector(`.${className} .materials-sidebar-content`);
    }
    const headings = Array.from(lessonContent.querySelectorAll(":scope > h2"));
    const heading = headings.find((candidate) => normalizeSidebarHeading(candidate.textContent ?? "") === sectionName);
    if (!heading)
        return null;
    const panel = document.createElement("section");
    panel.className = className;
    const title = document.createElement("h3");
    title.textContent = heading.textContent ?? sectionName;
    panel.appendChild(title);
    const content = document.createElement("div");
    content.className = "materials-sidebar-content";
    panel.appendChild(content);
    let node = heading.nextSibling;
    heading.remove();
    while (node) {
        const next = node.nextSibling;
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "H2") {
            break;
        }
        content.appendChild(node);
        node = next;
    }
    rightSidebar.appendChild(panel);
    return content;
}
const wiktionaryCache = new Map();
const dictionaryStorageKey = "quartz-wiktionary-last-term";
function fetchWiktionary(term, lang) {
    const normalizedTerm = term.trim().toLowerCase();
    const key = `${lang}:${normalizedTerm}`;
    const cached = wiktionaryCache.get(key);
    if (cached)
        return cached;
    const request = fetch(`https://${lang}.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(normalizedTerm)}`).then(async (response) => {
        if (!response.ok)
            throw new Error(`HTTP ${response.status}`);
        const data = (await response.json());
        const entries = Array.isArray(data[lang]) ? data[lang] : [];
        const entry = entries.find((candidate) => candidate.definitions && candidate.definitions.length > 0);
        const definition = entry?.definitions
            ?.map((item) => item.definition?.trim())
            .find((item) => Boolean(item));
        if (!entry || !definition)
            throw new Error("No definition found");
        return { entry, definition };
    });
    wiktionaryCache.set(key, request);
    return request;
}
function absolutizeWiktionaryLinks(container, lang) {
    for (const link of Array.from(container.querySelectorAll("a"))) {
        const href = link.getAttribute("href");
        if (!href)
            continue;
        if (href.startsWith("/")) {
            link.setAttribute("href", `https://${lang}.wiktionary.org${href}`);
        }
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noreferrer noopener");
    }
}
function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
async function getDictionaryEntry(term, lang) {
    return fetchWiktionary(term, lang);
}
function renderDictionaryResult(host, term, lang, html) {
    host.innerHTML = html;
    host.dataset.term = term;
    absolutizeWiktionaryLinks(host, lang);
}
function createDictionaryWidget(existingContent) {
    const rightSidebar = document.querySelector(".sidebar.right");
    if (!rightSidebar)
        return;
    let panel = rightSidebar.querySelector(".dictionary-sidebar-section");
    let content = panel?.querySelector(".materials-sidebar-content");
    if (panel?.querySelector(".dictionary-search-form"))
        return;
    if (!panel || !content) {
        panel = document.createElement("section");
        panel.className = "dictionary-sidebar-section";
        const title = document.createElement("h3");
        title.textContent = "Dictionary";
        panel.appendChild(title);
        content = document.createElement("div");
        content.className = "materials-sidebar-content dictionary-sidebar-content";
        panel.appendChild(content);
        rightSidebar.appendChild(panel);
    }
    else {
        content.classList.add("dictionary-sidebar-content");
    }
    if (!content)
        return;
    if (existingContent && existingContent !== content && existingContent.childNodes.length > 0) {
        const intro = document.createElement("div");
        intro.className = "dictionary-sidebar-intro";
        intro.append(...Array.from(existingContent.childNodes));
        content.appendChild(intro);
    }
    const form = document.createElement("form");
    form.className = "dictionary-search-form";
    form.innerHTML = `
    <div class="dictionary-search-row">
      <input id="dictionary-search-input" class="dictionary-search-input" name="term" type="search" placeholder="Type a word" autocomplete="off" />
      <button class="dictionary-search-button" type="submit">Search</button>
    </div>
  `;
    content.appendChild(form);
    const results = document.createElement("div");
    results.className = "dictionary-search-results";
    results.innerHTML = `<p class="wiktionary-status">Search for a word to see its definition.</p>`;
    content.appendChild(results);
    const input = form.querySelector(".dictionary-search-input");
    if (!input)
        return;
    const lang = "en";
    const submitSearch = async (rawTerm) => {
        const term = rawTerm.trim();
        if (!term) {
            renderDictionaryResult(results, "", lang, `<p class="wiktionary-status">Type a word to search.</p>`);
            return;
        }
        renderDictionaryResult(results, term, lang, `<p class="wiktionary-status">Looking up <strong>${escapeHtml(term)}</strong>…</p>`);
        try {
            const { entry, definition } = await getDictionaryEntry(term, lang);
            localStorage.setItem(dictionaryStorageKey, term);
            renderDictionaryResult(results, term, lang, `
          <article class="wiktionary-entry">
            <p class="wiktionary-term-row">
              <strong class="wiktionary-term">${escapeHtml(term)}</strong>
              ${entry.partOfSpeech ? `<span class="wiktionary-pos">${escapeHtml(entry.partOfSpeech)}</span>` : ""}
            </p>
            <div class="wiktionary-definition">${definition}</div>
            <p class="wiktionary-source"><a href="https://${lang}.wiktionary.org/wiki/${encodeURIComponent(term)}">Source: Wiktionary</a></p>
          </article>
        `);
        }
        catch {
            renderDictionaryResult(results, term, lang, `
          <p class="wiktionary-status">No definition found for <strong>${escapeHtml(term)}</strong>.</p>
          <p class="wiktionary-source"><a href="https://${lang}.wiktionary.org/wiki/${encodeURIComponent(term)}">Open in Wiktionary</a></p>
        `);
        }
    };
    function getSelectedWord() {
        const selection = document.getSelection();
        const text = selection?.toString().trim() ?? "";
        if (!text || /\s/.test(text))
            return "";
        return text.replace(/^[^\p{L}\p{N}'-]+|[^\p{L}\p{N}'-]+$/gu, "");
    }
    const floatingButton = document.createElement("button");
    floatingButton.type = "button";
    floatingButton.className = "dictionary-define-popup";
    floatingButton.hidden = true;
    document.body.appendChild(floatingButton);
    function hideFloatingButton() {
        floatingButton.hidden = true;
    }
    function showFloatingButton() {
        const selection = document.getSelection();
        const selectedWord = getSelectedWord();
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
        if (!selectedWord || !range || selection?.isCollapsed) {
            hideFloatingButton();
            return;
        }
        const rect = range.getBoundingClientRect();
        if (!rect.width && !rect.height) {
            hideFloatingButton();
            return;
        }
        floatingButton.textContent = `Define`;
        floatingButton.dataset.term = selectedWord;
        floatingButton.style.left = `${window.scrollX + rect.left + rect.width / 2}px`;
        floatingButton.style.top = `${window.scrollY + rect.top - 12}px`;
        floatingButton.hidden = false;
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        void submitSearch(input.value);
    });
    floatingButton.addEventListener("click", () => {
        const selectedWord = floatingButton.dataset.term?.trim() ?? "";
        if (!selectedWord)
            return;
        input.value = selectedWord;
        hideFloatingButton();
        void submitSearch(selectedWord);
    });
    document.addEventListener("selectionchange", () => {
        queueMicrotask(showFloatingButton);
    });
    document.addEventListener("scroll", hideFloatingButton, true);
    document.addEventListener("pointerdown", (event) => {
        if (event.target === floatingButton)
            return;
        hideFloatingButton();
    });
    if (window.addCleanup) {
        window.addCleanup(() => {
            floatingButton.remove();
        });
    }
    const initialTerm = existingContent?.querySelector("[data-term]")?.getAttribute("data-term")?.trim();
    const savedTerm = localStorage.getItem(dictionaryStorageKey)?.trim();
    const termToLoad = initialTerm || savedTerm;
    if (termToLoad) {
        input.value = termToLoad;
        void submitSearch(termToLoad);
    }
}
function initSidebarEnhancements() {
    const lessonContent = document.querySelector(".lesson-content");
    if (!lessonContent)
        return;
    moveLessonSectionToSidebar("materials", "materials-sidebar-section");
    const dictionaryContent = moveLessonSectionToSidebar("dictionary", "dictionary-sidebar-section");
    createDictionaryWidget(dictionaryContent);
}
document.addEventListener("nav", initSidebarEnhancements);
document.addEventListener("DOMContentLoaded", initSidebarEnhancements);
queueMicrotask(initSidebarEnhancements);
