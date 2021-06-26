import { ConvertFunction, Dimensions, mapPointInSight, VANISH_RATE } from "@/canvas/canvas-utility";
import { Vantage } from "./Vantage";

import { Sprite } from './Sprite'
import { Direction } from "./Direction";
import { Behaviour } from "./Behaviour";
import { Wall } from "./Wall";
import { RelativeDirection } from "./RelativeDirection";
import { RenderInstruction } from "@/canvas/RenderInstruction";

interface FigureConfig {
    x: number
    y: number
    direction: Direction
    sprite: Sprite
    height?: number
    width?: number
    behaviour?: Behaviour
    initialAnimation?: string
}

class Figure extends Vantage {
    data: FigureConfig
    actionName: string

    constructor(config: FigureConfig) {
        super(config)
        this.data = config
        this.actionName = config.initialAnimation || Sprite.defaultFigureAnimation
    }

    drawInSight(ctx: CanvasRenderingContext2D, convert: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        const { place, viewedFrom } = renderInstruction
        const { height = 1, width = 1, sprite } = this.data
        const aspect = (Wall.baseWidth / Wall.baseHeight)


        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(this);
        const exactPlace = {
            x: place.forward - 1.5 + rotatedSquarePosition.x,
            y: place.right - .5 + rotatedSquarePosition.y
        }

        const heightAtDistance = (height) / (VANISH_RATE ** (exactPlace.x));
        const widthAtDistance = (width * aspect) / (VANISH_RATE ** (exactPlace.x));

        const center = mapPointInSight(exactPlace.x, exactPlace.y, 0)
        const topLeft = mapPointInSight(exactPlace.x, exactPlace.y - width / 2, height)
        const topRight = mapPointInSight(exactPlace.x, exactPlace.y + width / 2, height)

        if (sprite.shadow) {
            const shadowSize: Dimensions = {
                x: widthAtDistance * sprite.shadow.x, y: heightAtDistance * sprite.shadow.y
            }
            ctx.beginPath()
            ctx.fillStyle = "black"
            ctx.ellipse(...convert(center), ...convert(shadowSize), 0, 0, Math.PI * 2)
            ctx.fill()
        }

        const relativeDimensions: Dimensions = {
            x: topRight.x - topLeft.x,
            y: center.y - topLeft.y
        }

        // topLeft.y += sprite.baseline * height

        ctx.drawImage(
            this.getSpriteImage(renderInstruction, tickCount),
            ...convert(topLeft),
            ...convert(relativeDimensions)
        );

    }

    getSpriteImage(renderInstruction: RenderInstruction, tickCount: number): CanvasImageSource {
        const { sprite } = this.data

        try {
            return sprite.provideImage(this.actionName, renderInstruction.relativeDirection || RelativeDirection.BACK, tickCount)
        } catch (error) {
            console.warn(error.message)
        }
        return document.createElement('img');
    }
}

export { Figure, FigureConfig }