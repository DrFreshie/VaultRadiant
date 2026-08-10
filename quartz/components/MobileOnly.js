import { jsx as _jsx } from "preact/jsx-runtime";
export default ((component) => {
    const Component = component;
    const MobileOnly = (props) => {
        return _jsx(Component, { displayClass: "mobile-only", ...props });
    };
    MobileOnly.displayName = component.displayName;
    MobileOnly.afterDOMLoaded = component?.afterDOMLoaded;
    MobileOnly.beforeDOMLoaded = component?.beforeDOMLoaded;
    MobileOnly.css = component?.css;
    return MobileOnly;
});
