import { jsx as _jsx } from "preact/jsx-runtime";
import { randomUUID } from "crypto";
export function JSResourceToScriptElement(resource, preserve) {
    const scriptType = resource.moduleType ?? "application/javascript";
    const spaPreserve = preserve ?? resource.spaPreserve;
    if (resource.contentType === "external") {
        return (_jsx("script", { src: resource.src, type: scriptType, "data-persist": spaPreserve }, resource.src));
    }
    else {
        const content = resource.script;
        return (_jsx("script", { type: scriptType, "data-persist": spaPreserve, dangerouslySetInnerHTML: { __html: content } }, randomUUID()));
    }
}
export function CSSResourceToStyleElement(resource, preserve) {
    const spaPreserve = preserve ?? resource.spaPreserve;
    if (resource.inline ?? false) {
        return _jsx("style", { children: resource.content });
    }
    else {
        return (_jsx("link", { href: resource.content, rel: "stylesheet", type: "text/css", "data-persist": spaPreserve }, resource.content));
    }
}
export function concatenateResources(...resources) {
    return resources
        .filter((resource) => resource !== undefined)
        .flat();
}
