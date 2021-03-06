import axios from "axios";

const BASEURL = "https://api.fontsource.org/v1";

export interface VariantsObject {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                url: {
                    woff2: string;
                    woff: string;
                    ttf: string;
                };
            };
        };
    };
}

export const build = (font: string, variants: VariantsObject) => {
    let css = ``;

    const k_i = Object.keys(variants);
    k_i.forEach((k) => {
        const k_j = Object.keys(variants[k]);
        k_j.forEach((j) => {
            const l = Object.keys(variants[k][j])[0];
            css += `@font-face {
                font-family: "${font}";
                src: url("${variants[k][j][l].url.ttf}") format("truetype"),
                     url("${variants[k][j][l].url.woff}") format("woff"),
                     url("${variants[k][j][l].url.woff2}") format("woff2");
                font-weight: "${k}";
                font-style: "${j}";
            }`;
        });
    });

    css = css.replace(/(?:\s\s\s\s|\t|\n)/gm, "");

    return css;
};

export const FontSourceCSSBuilder = {
    buildOne: build,
    buildMultiple: async (fontNames: string[]) => {
        let css = `/*\n *\n *  Generated by the OpenDocs fonts API.\n *  Data fetched from FontSource.\n *    https://fontsource.org/\n *\n */\n\n\n`;
        const fonts: {
            font: string;
            variants: VariantsObject | null;
            errored: boolean;
        }[] = [];
        for (let i = 0; i < fontNames.length; i++) {
            try {
                console.log(
                    `[${i} / ${fontNames.length - 1}] Querying font ${
                        fontNames[i]
                    }...`
                );
                const res = (
                    await axios.get(`${BASEURL}/fonts/${fontNames[i]}`)
                ).data;
                fonts.push({
                    font: fontNames[i],
                    variants: res.variants,
                    errored: false,
                });
            } catch (e) {
                fonts.push({
                    font: fontNames[i],
                    variants: null,
                    errored: true,
                });
                continue;
            }
        }
        fonts.forEach((f, i) => {
            console.log(
                `[${i} / ${fonts.length - 1}] Writing font ${f.font}...`
            );
            if (f.errored || !f.variants || !f.font) {
                css += `/* --------------------------- Failed to generate: ${f.font} --------------------------- */\n\n\n`;
            } else {
                css += `/* --------------------------- Generated: ${
                    f.font
                } --------------------------- */\n\n${build(
                    f.font,
                    f.variants
                )}\n\n\n`;
            }
        });
        return css.trim();
    },
};

export default FontSourceCSSBuilder;
