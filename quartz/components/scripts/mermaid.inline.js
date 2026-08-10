import { registerEscapeHandler, removeAllChildren } from "./util";
class DiagramPanZoom {
    container;
    content;
    isDragging = false;
    startPan = { x: 0, y: 0 };
    currentPan = { x: 0, y: 0 };
    scale = 1;
    MIN_SCALE = 0.5;
    MAX_SCALE = 3;
    cleanups = [];
    constructor(container, content) {
        this.container = container;
        this.content = content;
        this.setupEventListeners();
        this.setupNavigationControls();
        this.resetTransform();
    }
    setupEventListeners() {
        // Mouse drag events
        const mouseDownHandler = this.onMouseDown.bind(this);
        const mouseMoveHandler = this.onMouseMove.bind(this);
        const mouseUpHandler = this.onMouseUp.bind(this);
        const resizeHandler = this.resetTransform.bind(this);
        this.container.addEventListener("mousedown", mouseDownHandler);
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        window.addEventListener("resize", resizeHandler);
        this.cleanups.push(() => this.container.removeEventListener("mousedown", mouseDownHandler), () => document.removeEventListener("mousemove", mouseMoveHandler), () => document.removeEventListener("mouseup", mouseUpHandler), () => window.removeEventListener("resize", resizeHandler));
    }
    cleanup() {
        for (const cleanup of this.cleanups) {
            cleanup();
        }
    }
    setupNavigationControls() {
        const controls = document.createElement("div");
        controls.className = "mermaid-controls";
        // Zoom controls
        const zoomIn = this.createButton("+", () => this.zoom(0.1));
        const zoomOut = this.createButton("-", () => this.zoom(-0.1));
        const resetBtn = this.createButton("Reset", () => this.resetTransform());
        controls.appendChild(zoomOut);
        controls.appendChild(resetBtn);
        controls.appendChild(zoomIn);
        this.container.appendChild(controls);
    }
    createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.className = "mermaid-control-button";
        button.addEventListener("click", onClick);
        window.addCleanup(() => button.removeEventListener("click", onClick));
        return button;
    }
    onMouseDown(e) {
        if (e.button !== 0)
            return; // Only handle left click
        this.isDragging = true;
        this.startPan = { x: e.clientX - this.currentPan.x, y: e.clientY - this.currentPan.y };
        this.container.style.cursor = "grabbing";
    }
    onMouseMove(e) {
        if (!this.isDragging)
            return;
        e.preventDefault();
        this.currentPan = {
            x: e.clientX - this.startPan.x,
            y: e.clientY - this.startPan.y,
        };
        this.updateTransform();
    }
    onMouseUp() {
        this.isDragging = false;
        this.container.style.cursor = "grab";
    }
    zoom(delta) {
        const newScale = Math.min(Math.max(this.scale + delta, this.MIN_SCALE), this.MAX_SCALE);
        // Zoom around center
        const rect = this.content.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const scaleDiff = newScale - this.scale;
        this.currentPan.x -= centerX * scaleDiff;
        this.currentPan.y -= centerY * scaleDiff;
        this.scale = newScale;
        this.updateTransform();
    }
    updateTransform() {
        this.content.style.transform = `translate(${this.currentPan.x}px, ${this.currentPan.y}px) scale(${this.scale})`;
    }
    resetTransform() {
        this.scale = 1;
        const svg = this.content.querySelector("svg");
        this.currentPan = {
            x: svg.getBoundingClientRect().width / 2,
            y: svg.getBoundingClientRect().height / 2,
        };
        this.updateTransform();
    }
}
const cssVars = [
    "--secondary",
    "--tertiary",
    "--gray",
    "--light",
    "--lightgray",
    "--highlight",
    "--dark",
    "--darkgray",
    "--codeFont",
];
let mermaidImport = undefined;
document.addEventListener("nav", async () => {
    const center = document.querySelector(".center");
    const nodes = center.querySelectorAll("code.mermaid");
    if (nodes.length === 0)
        return;
    mermaidImport ||= await import(
    // @ts-ignore
    "https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs");
    const mermaid = mermaidImport.default;
    const textMapping = new WeakMap();
    for (const node of nodes) {
        textMapping.set(node, node.innerText);
    }
    async function renderMermaid() {
        // de-init any other diagrams
        for (const node of nodes) {
            node.removeAttribute("data-processed");
            const oldText = textMapping.get(node);
            if (oldText) {
                node.innerHTML = oldText;
            }
        }
        const computedStyleMap = cssVars.reduce((acc, key) => {
            acc[key] = window.getComputedStyle(document.documentElement).getPropertyValue(key);
            return acc;
        }, {});
        const darkMode = document.documentElement.getAttribute("saved-theme") === "dark";
        mermaid.initialize({
            startOnLoad: false,
            securityLevel: "loose",
            theme: darkMode ? "dark" : "base",
            themeVariables: {
                fontFamily: computedStyleMap["--codeFont"],
                primaryColor: computedStyleMap["--light"],
                primaryTextColor: computedStyleMap["--darkgray"],
                primaryBorderColor: computedStyleMap["--tertiary"],
                lineColor: computedStyleMap["--darkgray"],
                secondaryColor: computedStyleMap["--secondary"],
                tertiaryColor: computedStyleMap["--tertiary"],
                clusterBkg: computedStyleMap["--light"],
                edgeLabelBackground: computedStyleMap["--highlight"],
            },
        });
        await mermaid.run({ nodes });
    }
    await renderMermaid();
    document.addEventListener("themechange", renderMermaid);
    window.addCleanup(() => document.removeEventListener("themechange", renderMermaid));
    for (let i = 0; i < nodes.length; i++) {
        const codeBlock = nodes[i];
        const pre = codeBlock.parentElement;
        const clipboardBtn = pre.querySelector(".clipboard-button");
        const expandBtn = pre.querySelector(".expand-button");
        const clipboardStyle = window.getComputedStyle(clipboardBtn);
        const clipboardWidth = clipboardBtn.offsetWidth +
            parseFloat(clipboardStyle.marginLeft || "0") +
            parseFloat(clipboardStyle.marginRight || "0");
        // Set expand button position
        expandBtn.style.right = `calc(${clipboardWidth}px + 0.3rem)`;
        pre.prepend(expandBtn);
        // query popup container
        const popupContainer = pre.querySelector("#mermaid-container");
        if (!popupContainer)
            return;
        let panZoom = null;
        function showMermaid() {
            const container = popupContainer.querySelector("#mermaid-space");
            const content = popupContainer.querySelector(".mermaid-content");
            if (!content)
                return;
            removeAllChildren(content);
            // Clone the mermaid content
            const mermaidContent = codeBlock.querySelector("svg").cloneNode(true);
            content.appendChild(mermaidContent);
            // Show container
            popupContainer.classList.add("active");
            container.style.cursor = "grab";
            // Initialize pan-zoom after showing the popup
            panZoom = new DiagramPanZoom(container, content);
        }
        function hideMermaid() {
            popupContainer.classList.remove("active");
            panZoom?.cleanup();
            panZoom = null;
        }
        expandBtn.addEventListener("click", showMermaid);
        registerEscapeHandler(popupContainer, hideMermaid);
        window.addCleanup(() => {
            panZoom?.cleanup();
            expandBtn.removeEventListener("click", showMermaid);
        });
    }
});
