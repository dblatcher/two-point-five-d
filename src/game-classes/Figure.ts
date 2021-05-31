import { ConvertFunction, Dimensions, mapPointInSight, PlotPlace, VANISH_RATE } from "@/canvas/canvas-utility";
import { Vantage } from "./Vantage";

import { Sprite } from '../canvas/Sprite'
import { Direction } from "./Direction";

interface FigureConfig {
    x: number
    y: number
    direction: Direction
    sprite: Sprite
    height?: number
    width?: number
}

class Figure extends Vantage {
    data: FigureConfig

    constructor(config: FigureConfig) {
        super(config)
        this.data = config
    }

    drawInSight(ctx: CanvasRenderingContext2D, convert: ConvertFunction, plotPlace: PlotPlace): void {
        const { place } = plotPlace
        const { height = 1, width = 1, sprite } = this.data

        const heightAtDistance = height / (VANISH_RATE ** place.forward);
        const widthAtDistance = width / (VANISH_RATE ** place.forward);

        const relativeDimensions: Dimensions = {
            x: widthAtDistance, y: heightAtDistance
        }

        const center = mapPointInSight(place.forward - .5, place.right, 0)
        const topLeft = mapPointInSight(place.forward - .5, place.right - width / 2, height - sprite.baseline)

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
            this.getSpriteImage(plotPlace),
            ...convert(topLeft),
            ...convert(relativeDimensions)
        );
    }

    getSpriteImage(plotPlace: PlotPlace): CanvasImageSource {
        const key = plotPlace.relativeDirection as string

        try {
            return this.data.sprite.provideImage(key)
        } catch (error) {
            console.warn(error.message)
        }
        return document.createElement('img');
    }
}

export { Figure, FigureConfig }