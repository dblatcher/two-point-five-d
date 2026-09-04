import { Dimensions, DrawingContext, mapPointInSight, Point, RelativePoint, VANISH_RATE } from "@/canvas/canvas-utility";
import { Vantage, VantageConfig } from "./Vantage";

import { Color } from "@/canvas/Color";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { SpriteSheet } from "@/canvas/SpriteSheet";
import { Sprite } from '../canvas/Sprite';
import { Direction } from "./Direction";
import { RelativeDirection } from "./RelativeDirection";
import { Wall } from "./Wall";

type FigureConfig = VantageConfig &  {
    sprite: Sprite
    height?: number
    width?: number

    initialAnimation?: string
    altitude?: number
    transitionPhase?: number
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
        const exactPlace: RelativePoint = {
            f: forward - 1.5 + rotatedSquarePosition.x,
            r: right - .5 + rotatedSquarePosition.y
        }

        const aspect = (Wall.baseWidth / Wall.baseHeight)
        const heightAtDistance = (height) / (VANISH_RATE ** (exactPlace.f));
        const widthAtDistance = (width * aspect) / (VANISH_RATE ** (exactPlace.f));

        return {
            centerOnFloor: mapPointInSight(exactPlace.f, exactPlace.r, 0),
            topLeft: mapPointInSight(exactPlace.f, exactPlace.r - width / 2, height),
            topRight: mapPointInSight(exactPlace.f, exactPlace.r + width / 2, height),
            heightAtDistance, widthAtDistance,
        }
    }

    drawInSight(
        drawingContext: DrawingContext,
        renderInstruction: RenderInstruction,
        tickCount: number
    ): void {
        const { place } = renderInstruction
        const { ctx, spriteSheetMap, convertFunction } = drawingContext
        const { sprite, altitude = 0 } = this.data

        const { centerOnFloor, topLeft, topRight, widthAtDistance, heightAtDistance } = this.getRenderParams(renderInstruction.viewedFrom, place.forward, place.right);

        const { shadow } = sprite.data
        if (shadow) {
            const shadowSize: Dimensions = {
                x: widthAtDistance * shadow.x, y: heightAtDistance * shadow.y
            }
            ctx.beginPath()
            ctx.fillStyle = Color.BLACK.opacityAt(.5).css
            ctx.ellipse(...convertFunction(centerOnFloor), ...convertFunction(shadowSize), 0, 0, Math.PI * 2)
            ctx.fill()
        }

        const bottomPastBaseline = sprite.data.plotShift?.y || 0

        const relativeDimensions: Dimensions = {
            x: topRight.x - topLeft.x,
            y: (centerOnFloor.y - topLeft.y) * (1 + bottomPastBaseline)
        }

        const topLeftAtAltitude: Point = {
            x: topLeft.x,
            y: topLeft.y - altitude
        }

        ctx.drawImage(
            this.getSpriteImage(spriteSheetMap, renderInstruction, tickCount),
            ...convertFunction(topLeftAtAltitude),
            ...convertFunction(relativeDimensions)
        );

    }

    private getSpriteImage(spriteSheetMap: Map<string, SpriteSheet>, renderInstruction: RenderInstruction, tickCount: number): CanvasImageSource {
        const { sprite } = this.data

        try {
            return sprite.provideImage(spriteSheetMap, this.actionName, renderInstruction.relativeDirection || RelativeDirection.BACK, tickCount, this.data.transitionPhase)
        } catch (error) {
            console.warn(error instanceof Error ? error.message : error)
        }
        return document.createElement('img');
    }
}

export { Figure, FigureConfig };
