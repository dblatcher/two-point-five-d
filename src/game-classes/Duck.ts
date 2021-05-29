import { ConvertFunction, mapPointInSight, PlotPlace, Point } from "@/canvas-utility";
import { Vantage } from "./Vantage";

function flipImage(source: HTMLImageElement): CanvasImageSource {
    if (!source.width || !source.height) {return source} 
    const board = document.createElement('canvas')
    board.setAttribute('height', source.height.toString())
    board.setAttribute('width', source.width.toString())
    const ctx = board.getContext('2d') as CanvasRenderingContext2D
    ctx.scale(-1, 1);
    ctx.drawImage(source, -source.width,0)
    return board
}


class Duck extends Vantage {


    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, plotPlace: PlotPlace): void {
        const { place } = plotPlace

        const duckHeight = .3
        const duckWidth = .3

        const duckHeightAtDistance = duckHeight / (Math.SQRT2 ** place.forward);
        const duckWidthAtDistance = duckWidth / (Math.SQRT2 ** place.forward);

        const relativeDimensions: Point = {
            x: duckWidthAtDistance, y: duckHeightAtDistance
        }

        const topLeft = mapPointInSight(place.forward - .5, place.right - duckWidth / 2, duckHeight)



        ctx.drawImage(
            this.getSprite(plotPlace),
            ...convertFunction(topLeft),
            ...convertFunction(relativeDimensions)
        );
    }

    getSprite(plotPlace: PlotPlace): CanvasImageSource {

        switch (plotPlace.relativeDirection) {
            case 'BACK': return document.images[2]
            case 'LEFT': return flipImage(document.images[1])
            case 'RIGHT': return document.images[1]
            default:
            case 'FORWARD': return document.images[0]
        }


    }

}

export { Duck }