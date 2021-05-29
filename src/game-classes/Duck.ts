import { ConvertFunction, mapPointInSight, PlotPlace, Point } from "@/canvas-utility";
import { Vantage } from "./Vantage";

function flipImage(source: HTMLImageElement): CanvasImageSource {
    if (!source.width || !source.height) { return source }
    const board = document.createElement('canvas')
    board.setAttribute('height', source.height.toString())
    board.setAttribute('width', source.width.toString())
    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    ctx.scale(-1, 1);
    ctx.drawImage(source, -source.width, 0)
    return board
}


class Duck extends Vantage {

    drawInSight(ctx: CanvasRenderingContext2D, convert: ConvertFunction, plotPlace: PlotPlace): void {
        const { place } = plotPlace

        const duckHeight = .5
        const duckWidth = .5

        const duckHeightAtDistance = duckHeight / (Math.SQRT2 ** place.forward);
        const duckWidthAtDistance = duckWidth / (Math.SQRT2 ** place.forward);

        const relativeDimensions: Point = {
            x: duckWidthAtDistance, y: duckHeightAtDistance
        }

        const shadowSize: Point = {
            x: duckWidthAtDistance / 3, y: duckHeightAtDistance / 12
        }

        const center = mapPointInSight(place.forward - .5, place.right, 0)
        const topLeft = mapPointInSight(place.forward - .5, place.right - duckWidth / 2, duckHeight)


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
                selector = `img[sheet=DUCK][frame=SIDE]`
                break
            default:
            case 'BACK':
            case 'FORWARD':
                selector = `img[sheet=DUCK][frame=${plotPlace.relativeDirection}]`
                break
        }

        const source = document.querySelector(selector) as HTMLImageElement
        if (!source) { return document.createElement('img')}
        return plotPlace.relativeDirection == 'LEFT' ? flipImage(source) : source
    }
}

export { Duck }