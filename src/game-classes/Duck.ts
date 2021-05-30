import { ConvertFunction, Dimensions, flipImage, mapPointInSight, PlotPlace, Point, VANISH_RATE } from "@/canvas-utility";
import { Vantage } from "./Vantage";


class Duck extends Vantage {

    get height() { return .5 }
    get width() { return .5 }
    get sheetName() { return "DUCK" }

    drawInSight(ctx: CanvasRenderingContext2D, convert: ConvertFunction, plotPlace: PlotPlace): void {
        const { place } = plotPlace

        const duckHeightAtDistance = this.height / (VANISH_RATE ** place.forward);
        const duckWidthAtDistance = this.width / (VANISH_RATE ** place.forward);

        const relativeDimensions: Dimensions = {
            x: duckWidthAtDistance, y: duckHeightAtDistance
        }

        const shadowSize: Dimensions = {
            x: duckWidthAtDistance / 3, y: duckHeightAtDistance / 12
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
        let selector: string;
        switch (plotPlace.relativeDirection) {
            case 'LEFT':
            case 'RIGHT':
                selector = `img[sheet=${this.sheetName}][frame=SIDE]`
                break
            default:
            case 'BACK':
            case 'FORWARD':
                selector = `img[sheet=${this.sheetName}][frame=${plotPlace.relativeDirection}]`
                break
        }

        const source = document.querySelector(selector) as HTMLImageElement
        if (!source) { return document.createElement('img') }
        return plotPlace.relativeDirection == 'LEFT' ? flipImage(source) : source
    }
}

export { Duck }