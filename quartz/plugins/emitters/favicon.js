import sharp from "sharp";
import { joinSegments, QUARTZ } from "../../util/path";
import { write } from "./helpers";
export const Favicon = () => ({
    name: "Favicon",
    async *emit({ argv }) {
        const iconPath = joinSegments(QUARTZ, "static", "icon.png");
        const faviconContent = sharp(iconPath).resize(48, 48).toFormat("png");
        yield write({
            ctx: { argv },
            slug: "favicon",
            ext: ".ico",
            content: faviconContent,
        });
    },
    async *partialEmit() { },
});
