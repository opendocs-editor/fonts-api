import axios from "axios";

const BASEURL = "https://www.googleapis.com/webfonts/v1";

export interface FontsAPIFont {
    family: string;
    variants: string[];
    subsets: string[];
    version: string;
    lastModified: string;
    files: {
        [key: string]: string;
    };
    category: string;
    kind: "webfonts#webfont";
    css: string;
}

export interface FontsAPIObject {
    kind: string;
    items: FontsAPIFont[];
}

export interface Font extends FontsAPIFont {
    css: string;
}

export class FontList {
    private items: Font[] = [];

    constructor(data: FontsAPIObject) {
        for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i];
            this.items.push(
                Object.assign(item, {
                    css: `https://fonts.googleapis.com/css?family=${item.family.replace(
                        /\s/gm,
                        "+"
                    )}`,
                })
            );
        }
    }

    names() {
        const names: string[] = [];
        this.items.forEach((font) => {
            if (!names.includes(font.family.replace(/\s/gm, "")))
                names.push(font.family.replace(/\s/gm, ""));
        });
        return names;
    }

    byName(name: string): Font | null {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.family.replace(/\s/gm, "").toLowerCase() == name)
                return item;
        }
        return null;
    }
}

const GoogleFontLibrary = async (key: string): Promise<FontList> => {
    const res = await axios.get(`${BASEURL}/webfonts?key=${key}`);
    return new FontList(res.data);
};

export default GoogleFontLibrary;
