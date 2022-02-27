export type FontSource = "google" | "league" | "icons" | "other";

export interface FontSourceFontsAPIFont {
    id: string;
    family: string;
    subsets: string[];
    weights: (number | string)[];
    styles: string[];
    defSubset: string;
    variable: boolean;
    lastModified: string;
    category: string;
    version: string;
    type: FontSource;
}

export type FontSourceFontsAPIObject = FontSourceFontsAPIFont[];

export interface FontSourceFontsAPIFontWithFiles
    extends FontSourceFontsAPIFont {
    files: string[];
}

export type FontSourceFontsAPIObjectWithFiles =
    FontSourceFontsAPIFontWithFiles[];

export interface FontSourceFont extends FontSourceFontsAPIFont {
    css: string;
}

export class FontSourceFontList {
    private fonts: FontSourceFont[] = [];

    constructor(data: FontSourceFontsAPIObjectWithFiles) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            this.fonts.push(
                Object.assign(item, {
                    css: "data:text/plain,unresolved%20font",
                })
            );
        }
    }
}
