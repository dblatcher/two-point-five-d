import { cutFrameFromGridSheet, transformSpriteImage } from "@/canvas/manipulations"
import { Dimensions, Point } from "./canvas-utility"
import { RelativeDirection } from "../game-classes/RelativeDirection"

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
    transforms?: Array<"FLIP_H" | "SKEW_RIGHT" | "SKEW_LEFT" | "RESIZE_CENTER" | "RESIZE_OFFSET" | "CROP_BASE">
}

interface SpriteConfig {
    baseline?: number
    shadow?: Dimensions
    size?: Dimensions
    offset?: Point
    animations?: Map<string, Frame[]>
    transforms?: Array<"FLIP_H" | "SKEW_RIGHT" | "SKEW_LEFT" | "RESIZE_CENTER" | "RESIZE_OFFSET" | "CROP_BASE">
}

class Sprite {
    name: string
    animations: Map<string, Frame[]>
    baseline: number
    shadow?: Dimensions
    size?: Dimensions
    offset?: Point
    transforms?: Array<"FLIP_H" | "SKEW_RIGHT" | "SKEW_LEFT" | "RESIZE_CENTER" | "RESIZE_OFFSET" | "CROP_BASE">
    loadedFrames: Map<string, CanvasImageSource>

    static get defaultWallAnimation(): "NEUTRAL" { return "NEUTRAL" }
    static get defaultFigureAnimation(): "STAND" { return "STAND" }
    static get defaultPortraitAnimation(): "NEUTRAL" { return "NEUTRAL" }

    constructor(name: string, config: SpriteConfig = {}) {
        this.name = name
        this.animations = config.animations || new Map<string, Frame[]>();
        this.baseline = config.baseline || 0
        this.shadow = config.shadow
        this.size = config.size
        this.offset = config.offset
        this.transforms = config.transforms
        this.loadedFrames = new Map<string, CanvasImageSource>();
    }

    /**
     * Load the CanvasImageSource for a frame of the sprite.
     * The image is loaded from the DOM, manipulated as required,
     * then saved in the sprite's loadedFrames map property for
     * subsequent calls to provideImage.
     * 
     * @param frame sprite frame to load the image for
     * @param franimationFrameKeyame the string describing the frame's action, direction and index
     * @throws an Error is the image is not loaded on not found in the Dom
     * @returns the CanvasImageSource of the sprite frame
     */
    loadImage(frame: Frame, animationFrameKey: string): CanvasImageSource {

        const selector = this.getFrameSelector(frame)

        const source = document.querySelector(selector) as HTMLImageElement
        if (!source) {
            throw new Error(`no image element found for [${this.name}, ${animationFrameKey}]`);
        }
        if (!source.complete) {
            throw new Error(`source image[${this.name}, ${animationFrameKey}] not loaded yet`);
        }

        let image: HTMLImageElement | HTMLCanvasElement = source;

        if (frame.sheet.config.pattern === 'GRID') {
            image = cutFrameFromGridSheet(source, frame.row || 0, frame.col || 0, frame.sheet.config.rows || 1, frame.sheet.config.cols || 1)
        }

        if (frame.transforms || this.transforms) {
            const transforms = [
                ...(this.transforms || []),
                ...(frame.transforms || []),
            ]
            image = transformSpriteImage(image, transforms, this);
        }

        this.loadedFrames.set(animationFrameKey, image);
        return image;
    }


    provideSrc(actionName: string, direction: RelativeDirection = RelativeDirection.BACK): string | null {

        const directionName = direction.name;

        const animationWithDirection = `${actionName}_${directionName}`
        const animationWithoutDirection = `${actionName}`
        let animationKey = `${actionName}_${directionName}`

        if (this.animations.has(animationWithDirection)) {
            animationKey = animationWithDirection
        } else if (this.animations.has(animationWithoutDirection)) {
            animationKey = animationWithoutDirection
        } else {
            console.warn(`Invalid animation key on ${this.name}: ${animationWithDirection}`);
            return null
        }

        const animation = this.animations.get(animationKey) as Frame[];
        if (animation.length == 0) {
            console.warn(`No frames in animation ${animationKey} of ${this.name}`);
            return null
        }

        return animation[0].sheet.src;
    }

    /**
     * 
     * @param actionName The string descibing what the sprite is doing 
     * @param direction The relative direction the sprite is facing
     * @param tickCount the game's current tick count
     * @throws an error is there is no animation for the action and direction, or if that animation is empty
     * @returns the image to draw
     */
    provideImage(actionName: string, direction: RelativeDirection, tickCount: number): CanvasImageSource {

        const directionName = direction.name;

        const animationWithDirection = `${actionName}_${directionName}`
        const animationWithoutDirection = `${actionName}`
        let animationKey = `${actionName}_${directionName}`

        if (this.animations.has(animationWithDirection)) {
            animationKey = animationWithDirection
        } else if (this.animations.has(animationWithoutDirection)) {
            animationKey = animationWithoutDirection
        } else {
            throw new Error(`Invalid animation key on ${this.name}: ${animationWithDirection}`);
        }

        const animation = this.animations.get(animationKey) as Frame[];
        if (animation.length == 0) {
            throw new Error(`No frames in animation ${animationKey} of ${this.name}`);
        }

        const frameIndex = tickCount % animation.length
        const animationFrameKey = `${actionName}_${directionName}_${frameIndex.toString()}`;

        if (this.loadedFrames.has(animationFrameKey)) {
            return this.loadedFrames.get(animationFrameKey) as CanvasImageSource;
        }

        return this.loadImage(animation[frameIndex], animationFrameKey);
    }

    get keyArray(): string[] {
        const list: string[] = []
        this.animations.forEach((value: Frame[], key: string) => { list.push(key) })
        return list
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

    static patternSprite(name: string, sheet: SpriteSheet, config: SpriteConfig = {}, gridCell: { row?: number, col?: number } = {}): Sprite {

        config.animations = new Map<string, Frame[]>()
            .set(`${Sprite.defaultWallAnimation}`, [
                { sheet, transforms: ["RESIZE_CENTER"], ...gridCell },
            ])
            .set(`${Sprite.defaultWallAnimation}_LEFT`, [
                { sheet, transforms: ["RESIZE_CENTER", "SKEW_LEFT"], ...gridCell },
            ])
            .set(`${Sprite.defaultWallAnimation}_RIGHT`, [
                { sheet, transforms: ["RESIZE_CENTER", "SKEW_RIGHT"], ...gridCell },
            ]);

        return new Sprite(name, config)
    }

    static itemSprite(name: string, frame: Frame, config: SpriteConfig = {}): Sprite {

        config.animations = new Map<string, Frame[]>()
            .set(Sprite.defaultFigureAnimation, [
                frame
            ])

        config.size = config.size || Sprite.DEFAULT_SIZE
        config.shadow = config.shadow || { x: config.size.x*(3/5), y: .1 }

        return new Sprite(name, config)
    }

    static portraitSprite(name: string, sheet: SpriteSheet): Sprite {
        return new Sprite(name, {
            animations: new Map<string, Frame[]>()
                .set(Sprite.defaultPortraitAnimation, [{ sheet }])
        })
    }

    static DEFAULT_SIZE: Dimensions = { x: .5, y: .5 }
}

export {
    SpriteSheet, Sprite, Frame
}