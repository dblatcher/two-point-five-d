import { cutFrameFromGridSheet, transformSpriteImage } from "@/canvas/manipulations"
import { Dimensions, Point } from "./canvas-utility"
import { RelativeDirection } from "../game-classes/RelativeDirection"
import { SpriteSheet } from "./SpriteSheet"



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
    plotShift?:Point
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
    plotShift?:Point
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
        this.plotShift = config.plotShift
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


    /**
     * Get the src for the spritesheet used by the first frame of an animation
     * @param actionName 
     * @param direction 
     * @returns the src path for the first frame of the animation, or null if there is none
     */
    provideSrc(actionName: string, direction: RelativeDirection = RelativeDirection.BACK): string | null {
        const animation = this.getFrameList(actionName, direction);

        if (animation == null) {
            console.warn(`Invalid animation key on ${this.name}: ${actionName} (${direction.name})`);
            return null
        }

        if (animation.length == 0) {
            console.warn(`No frames in animation ${actionName} (${direction.name}) of ${this.name}`);
            return null
        }

        return animation[0].sheet.src;
    }


    /**
     * get the list of frames for an action and direction, or null if there is non
     * @param actionName 
     * @param direction 
     * @return the list of frames for the animation, or null
     */
    getFrameList(actionName: string, direction: RelativeDirection): Frame[] | null {
        const animationWithDirection = `${actionName}_${direction.name}`
        const animationWithoutDirection = `${actionName}`
        return this.animations.get(animationWithDirection) || this.animations.get(animationWithoutDirection) || null
    }

    /**
     * Get the index of the frame to use given the tickCount and transition
     * @param animation a list of frames
     * @param tickCount the game's tickcount
     * @param transitionPhase
     * @returns the index of the frame
     */
    getFrameIndex(animation: Frame[], tickCount: number, transitionPhase?: number): number {
        if (typeof transitionPhase == 'number') {
            return (Math.floor(transitionPhase * (animation.length - 1)))
        }

        return tickCount % animation.length
    }

    /**
     * 
     * @param actionName The string describing what the sprite is doing 
     * @param direction The relative direction the sprite is facing
     * @param tickCount the game's current tick count
     * @param transitionPhase 
     * @throws an error is there is no animation for the action and direction, or if that animation is empty
     * @returns the image to draw
     */
    provideImage(actionName: string, direction: RelativeDirection, tickCount: number, transitionPhase?: number): CanvasImageSource {

        const animation = this.getFrameList(actionName, direction);

        if (animation === null) {
            throw new Error(`Invalid animation key on ${this.name}: ${actionName} (${direction.name})`);
        }

        if (animation.length == 0) {
            throw new Error(`No frames in animation ${actionName} (${direction.name}) of ${this.name}`);
        }

        const frameIndex = this.getFrameIndex(animation, tickCount, transitionPhase);

        const animationFrameKey = `${actionName}_${direction.name}_${frameIndex.toString()}`;

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
                { sheet, transforms: ["RESIZE_OFFSET"], ...gridCell },
            ])
            .set(`${Sprite.defaultWallAnimation}_LEFT`, [
                { sheet, transforms: ["RESIZE_OFFSET", "SKEW_LEFT"], ...gridCell },
            ])
            .set(`${Sprite.defaultWallAnimation}_RIGHT`, [
                { sheet, transforms: ["RESIZE_OFFSET", "SKEW_RIGHT"], ...gridCell },
            ]);

        return new Sprite(name, config)
    }

    static animatedPatternSprite(name: string, sheet: SpriteSheet, config: SpriteConfig = {}, gridCells?: { row?: number, col?: number }[]): Sprite {

        if (!gridCells) {
            gridCells = []
            for (let i = 0; i < (sheet.config.cols || 1); i++) {
                for (let j = 0; j < (sheet.config.rows || 1); j++) {
                    gridCells.push({ row: j, col: i })
                }
            }
        }

        config.animations = new Map<string, Frame[]>()
            .set(`${Sprite.defaultWallAnimation}`,
                gridCells.map(gridCell => { return { sheet, transforms: ["RESIZE_CENTER"], row: gridCell.row, col: gridCell.col } })
            )
            .set(`${Sprite.defaultWallAnimation}_LEFT`,
                gridCells.map(gridCell => { return { sheet, transforms: ["RESIZE_CENTER", "SKEW_LEFT"], row: gridCell.row, col: gridCell.col } })
            )
            .set(`${Sprite.defaultWallAnimation}_RIGHT`,
                gridCells.map(gridCell => { return { sheet, transforms: ["RESIZE_CENTER", "SKEW_RIGHT"], row: gridCell.row, col: gridCell.col } })
            );

        return new Sprite(name, config)
    }

    static itemSpriteOneFrame(name: string, frames: Frame[] | Frame, config: SpriteConfig = {}): Sprite {

        const framesInArray = Array.isArray(frames) ? frames : [frames];

        config.animations = new Map<string, Frame[]>()
            .set(Sprite.defaultFigureAnimation, framesInArray)

        config.size = config.size || Sprite.DEFAULT_SIZE
        config.shadow = config.shadow || { x: config.size.x * (3 / 5), y: .1 }

        return new Sprite(name, config)
    }

    static itemSpriteDirectional(name: string, frames: { back: Frame[], left: Frame[], right: Frame[], forward: Frame[] }, config: SpriteConfig = {}): Sprite {

        config.animations = new Map<string, Frame[]>()
            .set(Sprite.defaultFigureAnimation + "_BACK", frames.back)
            .set(Sprite.defaultFigureAnimation + "_LEFT", frames.left)
            .set(Sprite.defaultFigureAnimation + "_FORWARD", frames.forward)
            .set(Sprite.defaultFigureAnimation + "_RIGHT", frames.right)

        config.size = config.size || Sprite.DEFAULT_SIZE
        config.shadow = config.shadow || { x: config.size.x * (3 / 5), y: .1 }

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
    Sprite, Frame, SpriteConfig
}