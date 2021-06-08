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
    animations?: Map<string, Frame[]>
}

class Sprite {
    name: string
    animations: Map<string, Frame[]>
    loadedFrames: Map<string, CanvasImageSource>
    baseline: number
    shadow?: Dimensions
    size?: Dimensions
    offset?: Point

    constructor(name: string, config: SpriteConfig = {}) {
        this.name = name

        this.animations = config.animations || new Map();

        this.loadedFrames = new Map();
        this.baseline = config.baseline || 0
        this.shadow = config.shadow
        this.size = config.size
        this.offset = config.offset
    }

    /**
     * Get the CanvasImageSource for a frame of the sprite.
     * When called for the first time for a given frame,
     * image is loaded from the DOM, manipulated as required ,
     * then saved in the sprite's loadedFrames map property for
     * subsequent calls (only reads the DOM once).
     * 
     * @param frame sprite frame to load the image for
     * @param franimationFrameKeyame the string describing the frame's action, direction and index
     * @throws an Error is the image is not loaded on not found in the Dom
     * @returns the CanvasImageSource of the sprite frame
     */
    provideImage(frame: Frame, animationFrameKey: string): CanvasImageSource {


        if (this.loadedFrames.has(animationFrameKey)) {
            return this.loadedFrames.get(animationFrameKey) as CanvasImageSource;
        }

        const selector = this.getFrameSelector(frame)

        const source = document.querySelector(selector) as HTMLImageElement
        if (!source) {
            throw new Error(`no image element found for [${this.name}, ${animationFrameKey}]`);
        }
        if (!source.complete) {
            throw new Error(`source image[${this.name}, ${animationFrameKey}] not loaded yet`);
        }

        let result: HTMLImageElement | HTMLCanvasElement = source;

        if (frame.sheet.config.pattern === 'GRID') {
            result = cutFrameFromGridSheet(source, frame.row || 0, frame.col || 0, frame.sheet.config.rows || 1, frame.sheet.config.cols || 1)
        }

        if (frame.transforms) {
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

        this.loadedFrames.set(animationFrameKey, result);
        return result;
    }

    provideAnimationImage(actionName: string, direction: "FORWARD" | "BACK" | "LEFT" | "RIGHT", tickCount: number): CanvasImageSource {

        const animationKey = `${actionName}_${direction}`

        if (!this.animations.has(animationKey)) {
            throw new Error(`Invalid animation key, ${animationKey}`);
        }

        const animation = this.animations.get(animationKey) as Frame[];
        if (animation.length == 0) {
            throw new Error(`No frames in animation ${animationKey}`);
        }

        const frameIndex = tickCount % animation.length
        const animationFrameKey = `${actionName}_${direction}_${frameIndex.toString()}`;

        return this.provideImage(animation[frameIndex], animationFrameKey);
    }


    getFrameSelector(frame: Frame): string {
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

        config.animations = new Map()
            .set("STAND_FORWARD", [
                { key: "STAND_FORWARD_0", sheet, transforms: ["RESIZE_CENTER"] },
            ])
            .set("STAND_BACK", [
                { key: "STAND_BACK_0", sheet, transforms: ["RESIZE_CENTER"] },
            ])
            .set("STAND_LEFT", [
                { key: "STAND_LEFT_0", sheet, transforms: ["RESIZE_CENTER", "SKEW_LEFT"] },
            ])
            .set("STAND_RIGHT", [
                { key: "STAND_RIGHT_0", sheet, transforms: ["RESIZE_CENTER", "SKEW_RIGHT"] },
            ]);

        return new Sprite(name, config)
    }
}

export {
    SpriteSheet, Sprite, Frame
}