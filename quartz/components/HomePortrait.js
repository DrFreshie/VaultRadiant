import { jsx as _jsx } from "preact/jsx-runtime";
import { classNames } from "../util/lang";
const homePortraitCss = `
.home-portrait {
  margin-top: 1rem;
}

.home-portrait img {
  display: block;
  width: 100%;
  border-radius: 8px;
}
`;
export default (() => {
    const HomePortrait = ({ fileData, displayClass }) => {
        if (fileData.slug !== "index")
            return null;
        return (_jsx("div", { class: classNames(displayClass, "home-portrait"), children: _jsx("img", { src: "/imgs/Portrait.jpg", alt: "Portrait", loading: "lazy" }) }));
    };
    HomePortrait.css = homePortraitCss;
    return HomePortrait;
});
