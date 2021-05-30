import { ConvertFunction, Dimensions, flipImage, mapPointInSight, PlotPlace, VANISH_RATE } from "@/canvas-utility";
import { Vantage } from "./Vantage";

import { duckSprite } from '@/store/sprites'
import { Sprite } from './Sprite'

class Duck extends Vantage {

    get height(): number { return .5 }
    get width(): number { return .5 }
    get sprite(): Sprite { return duckSprite }

    drawInSight(ctx: CanvasRenderingContext2D, convert: ConvertFunction, plotPlace: PlotPlace): void {
        const { place } = plotPlace

        const heightAtDistance = this.height / (VANISH_RATE ** place.forward);
        const widthAtDistance = this.width / (VANISH_RATE ** place.forward);

        const relativeDimensions: Dimensions = {
            x: widthAtDistance, y: heightAtDistance
        }

        const shadowSize: Dimensions = {
            x: widthAtDistance / 3, y: heightAtDistance / 12
        }

        const center = mapPointInSight(place.forward - .5, place.right, 0)
        const topLeft = mapPointInSight(place.forward - .5, place.right - this.width / 2, this.height)


        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.ellipse(...convert(center), ...convert(shadowSize), 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.drawImage(
            this.getSprite(plotPlace),
            ...convert(topLeft),
            ...convert(relativeDimensions)
        );
    }

    //TO DO - get the data from DOM once, not on every render!
    getSprite(plotPlace: PlotPlace): CanvasImageSource {

        const frame = this.sprite.getFrame(plotPlace.relativeDirection as string);
        const selector = this.sprite.getFrameSelector(plotPlace.relativeDirection as string)

        if (!selector) { return document.createElement('img') }
        const source = document.querySelector(selector) as HTMLImageElement
        if (!source) { return document.createElement('img') }

        let result: CanvasImageSource = source;
        if (frame && frame.transforms) {
            frame.transforms.forEach(transform => {
                if (transform === "FLIP_H") {result = flipImage(result)}
            })
        }

        return result;
    }
}

export { Duck }