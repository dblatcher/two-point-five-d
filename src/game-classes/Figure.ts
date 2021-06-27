import { ConvertFunction, Dimensions, mapPointInSight, Point, VANISH_RATE } from "@/canvas/canvas-utility";
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

    getRenderParams(viewedFrom: Direction, forward: number, right: number): {
        centerOnFloor: Point
        topLeft: Point
        topRight: Point
        heightAtDistance: number
        widthAtDistance: number
    } {
        const { height = 1, width = 1 } = this.data

        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(this);
        const exactPlace = {
            x: forward - 1.5 + rotatedSquarePosition.x,
            y: right - .5 + rotatedSquarePosition.y
        }

        const aspect = (Wall.baseWidth / Wall.baseHeight)
        const heightAtDistance = (height) / (VANISH_RATE ** (exactPlace.x));
        const widthAtDistance = (width * aspect) / (VANISH_RATE ** (exactPlace.x));

        return {
            centerOnFloor: mapPointInSight(exactPlace.x, exactPlace.y, 0),
            topLeft: mapPointInSight(exactPlace.x, exactPlace.y - width / 2, height),
            topRight: mapPointInSight(exactPlace.x, exactPlace.y + width / 2, height),
            heightAtDistance, widthAtDistance,
        }
    }

    drawInSight(ctx: CanvasRenderingContext2D, convert: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        const { place } = renderInstruction
        const { sprite } = this.data

        const { centerOnFloor, topLeft, topRight, widthAtDistance, heightAtDistance } = this.getRenderParams(renderInstruction.viewedFrom, place.forward, place.right);


        if (sprite.shadow) {
            const shadowSize: Dimensions = {
                x: widthAtDistance * sprite.shadow.x, y: heightAtDistance * sprite.shadow.y
            }
            ctx.beginPath()
            ctx.fillStyle = "black"
            ctx.ellipse(...convert(centerOnFloor), ...convert(shadowSize), 0, 0, Math.PI * 2)
            ctx.fill()
        }

        const relativeDimensions: Dimensions = {
            x: topRight.x - topLeft.x,
            y: centerOnFloor.y - topLeft.y
        }


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