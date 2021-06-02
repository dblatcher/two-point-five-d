import { cutFrameFromGridSheet, flipImage, perspectiveSkew, resizeFrame } from "@/canvas/manipulations"
import { Dimensions, Point } from "./canvas-utility"

interface SpriteSheetConfig {
    pattern: "SINGLE" | "GRID"
    rows?: number
    cols?: number
}



class SpriteSheet {
    id: string
    // eslint-disable-next-line
    src: any
    config: SpriteSheetConfig
    // eslint-disable-next-line 
    constructor(id: string, src: any, collection?: SpriteSheet[], config?: SpriteSheetConfig) {
        this.id = id
        this.src = src
        this.config = config || { pattern: "SINGLE" }
        if (collection) { collection.push(this) }
    }
}

interface Frame {
    key: string
    sheet: SpriteSheet
    row?: number
    col?: number
    transforms?: Array<"FLIP_H" | "SKEW_RIGHT" | "SKEW_LEFT" | "RESIZE_CENTER">
}

interface SpriteConfig {
    baseline?: number
    shadow?: Dimensions
    size?: Dimensions
    offset?: Point
}

class Sprite {
    name: string
    frames: Frame[]
    loadedFrames: Map<string, CanvasImageSource>
    baseline: number
    shadow?: Dimensions
    size?: Dimensions
    offset?: Point

    constructor(name: string, frames: Frame[], config: SpriteConfig = {}) {
        this.name = name
        this.frames = frames
        this.loadedFrames = new Map();
        this.baseline = config.baseline || 0
        this.shadow = config.shadow
        this.size = config.size
        this.offset = config.offset
    }

    /**
     * Get the CanvasImageSource for a frame of the sprite.
     * When called for the first time for a give frame,
     * image is loaded from the DOM, manipulated as required ,
     * then saved in the sprite's loadedFrames map property for
     * subsequent calls (only reads the DOM once).
     * 
     * @param key the identifier of the sprite frame to load the image for
     * @throws an Error is the image is not loaded on not found in the Dom
     * @returns the CanvasImageSource of the sprite frame
     */
    provideImage(key: string): CanvasImageSource {

        if (this.loadedFrames.has(key)) {
            return this.loadedFrames.get(key) as CanvasImageSource;
        }

        const frame = this.getFrame(key);
        const selector = this.getFrameSelector(key)
        if (!selector || !frame) {
            throw new Error(`invalid image key [${this.name}, ${key}]`);
        }
        const source = document.querySelector(selector) as HTMLImageElement
        if (!source) {
            throw new Error(`no image element found for [${this.name}, ${key}]`);
        }
        if (!source.complete) {
            throw new Error(`sprite image[${this.name}, ${key}] not loaded yet`);
        }

        let result: HTMLImageElement | HTMLCanvasElement = source;

        if (frame.sheet.config.pattern === 'GRID') {
            result = cutFrameFromGridSheet(source, frame.row || 0, frame.col || 0, frame.sheet.config.rows || 1, frame.sheet.config.cols || 1)
        }

        if (frame && frame.transforms) {
            frame.transforms.forEach(transform => {
                switch (transform) {
                    case "RESIZE_CENTER":
                        if (this.size) {
                            result = resizeFrame(result, this.size)
                        }
                    break
                    case "FLIP_H":
                        result = flipImage(result)
                        break;
                    case "SKEW_LEFT":
                        result = perspectiveSkew(result, false)
                        break;
                    case "SKEW_RIGHT":
                        result = perspectiveSkew(result, true)
                        break;
                }
            })
        }

        this.loadedFrames.set(key, result);
        return result;
    }

    getFrame(key: string): Frame | undefined {
        return this.frames.find(frame => frame.key == key)
    }

    getFrameSelector(key: string): string | undefined {
        const frame = this.getFrame(key)
        if (!frame) { return undefined }
        return `img[sheet-id=${frame.sheet.id}]`
    }

    /**
     * clear the loaded frames - may be needed for memory saving
     * if a sprite has loaded, but won't be required again
     */
    clearLoadedFrames(): void {
        this.loadedFrames.clear()
    }

    static patternSprite(name: string, sheet: SpriteSheet, config: SpriteConfig = {}): Sprite {
        return new Sprite(name, [
            { key: "FORWARD", sheet, transforms: ["RESIZE_CENTER"] },
            { key: "BACK", sheet, transforms: ["RESIZE_CENTER"] },
            { key: "LEFT", sheet, transforms: ["RESIZE_CENTER", "SKEW_LEFT"] },
            { key: "RIGHT", sheet, transforms: ["RESIZE_CENTER", "SKEW_RIGHT"] },
        ], config)
    }
}

export {
    SpriteSheet, Sprite,
}