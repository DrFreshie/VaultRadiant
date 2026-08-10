import { jsx as _jsx } from "preact/jsx-runtime";
export default ((component) => {
    const Component = component;
    const DesktopOnly = (props) => {
        return _jsx(Component, { displayClass: "desktop-only", ...props });
    };
    DesktopOnly.displayName = component.displayName;
    DesktopOnly.afterDOMLoaded = component?.afterDOMLoaded;
    DesktopOnly.beforeDOMLoaded = component?.beforeDOMLoaded;
    DesktopOnly.css = component?.css;
    return DesktopOnly;
});
