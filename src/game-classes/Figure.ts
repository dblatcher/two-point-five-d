import { ConvertFunction, Dimensions, mapPointInSight, PlotPlace, VANISH_RATE } from "@/canvas/canvas-utility";
import { Vantage } from "./Vantage";

import { Frame, Sprite } from '../canvas/Sprite'
import { Direction } from "./Direction";
import { Behaviour } from "./Behaviour";
import { Wall } from "./Wall";

interface FigureConfig {
    x: number
    y: number
    direction: Direction
    sprite: Sprite
    height?: number
    width?: number

    behaviour?: Behaviour
}

class Figure extends Vantage {
    data: FigureConfig

    constructor(config: FigureConfig) {
        super(config)
        this.data = config
    }

    drawInSight(ctx: CanvasRenderingContext2D, convert: ConvertFunction, plotPlace: PlotPlace, tickCount: number): void {
        const { place } = plotPlace
        const { height = 1, width = 1, sprite } = this.data

        const aspect = (Wall.baseWidth / Wall.baseHeight)

        const heightAtDistance = (height) / (VANISH_RATE ** place.forward);
        const widthAtDistance = (width * aspect) / (VANISH_RATE ** place.forward);

        const relativeDimensions: Dimensions = {
            x: widthAtDistance, y: heightAtDistance
        }

        const center = mapPointInSight(place.forward - .5, place.right, 0)
        const topLeft = mapPointInSight(place.forward - .5, place.right - width / 2, height - (sprite.baseline * 4))

        if (sprite.shadow) {
            const shadowSize: Dimensions = {
                x: widthAtDistance * sprite.shadow.x, y: heightAtDistance * sprite.shadow.y
            }
            ctx.beginPath()
            ctx.fillStyle = "black"
            ctx.ellipse(...convert(center), ...convert(shadowSize), 0, 0, Math.PI * 2)
            ctx.fill()
        }

        ctx.drawImage(
            this.getSpriteImage(plotPlace, tickCount),
            ...convert(topLeft),
            ...convert(relativeDimensions)
        );
    }

    getSpriteImage(plotPlace: PlotPlace, tickCount: number): CanvasImageSource {
        const { sprite } = this.data

        const walkAnimationKey = `WALK_${plotPlace.relativeDirection}`

        if (sprite.animations.has(walkAnimationKey)) {

            const animation = sprite.animations.get(walkAnimationKey) as Frame[];

            const frameIndex = tickCount % animation.length

            try {
                return sprite.provideAnimationImage(walkAnimationKey, frameIndex)
            } catch (error) {
                console.warn(error.message)
            }
        } else {
            const key = plotPlace.relativeDirection as string
            try {
                return sprite.provideImage(sprite.getFrame(key) as Frame)
            } catch (error) {
                console.warn(error.message)
            }
        }

        return document.createElement('img');
    }
}

export { Figure, FigureConfig }