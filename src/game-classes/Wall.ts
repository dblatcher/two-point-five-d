import { PlotPlace, ConvertFunction, plotPolygon, mapPointOnCeiling, mapPointOnFloor } from "@/canvas-utility";
import { Color } from "./Color";
import { Direction } from "./Direction";
import { Position } from "./Position";



interface WallConfig {
    x: number
    y: number
    place: Direction
    color?: Color
}

class Wall extends Position {
    data: WallConfig

    constructor(config: WallConfig) {
        super(config)
        this.data = config
    }

    isFacing(direction: Direction): boolean {
        return this.data.place.x === direction.x && this.data.place.y === direction.y
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, plotPlace: PlotPlace): void {

        const { place, relativeDirection } = plotPlace

        const baseColor = this.data.color || Wall.defaultColor

        let points: { x: number, y: number }[] = []
        switch (relativeDirection) {
            case "LEFT":
                ctx.fillStyle = baseColor.darker(12 * (place.forward+.5)).css
                points = [
                    mapPointOnCeiling(place.forward - 1, place.right - .5),
                    mapPointOnCeiling(place.forward, place.right - .5),
                    mapPointOnFloor(place.forward, place.right - .5),
                    mapPointOnFloor(place.forward - 1, place.right - .5),
                ]
                break;
            case "RIGHT":
                ctx.fillStyle = baseColor.darker(12 * (place.forward+.5)).css
                points = [
                    mapPointOnCeiling(place.forward - 1, place.right + .5),
                    mapPointOnCeiling(place.forward, place.right + .5),
                    mapPointOnFloor(place.forward, place.right + .5),
                    mapPointOnFloor(place.forward - 1, place.right + .5),
                ]
                break;
            case "FORWARD":
                ctx.fillStyle = baseColor.darker(12 * (place.forward + 1)).css
                points = [
                    mapPointOnCeiling(place.forward, place.right - .5),
                    mapPointOnCeiling(place.forward, place.right + .5),
                    mapPointOnFloor(place.forward, place.right + .5),
                    mapPointOnFloor(place.forward, place.right - .5),
                ]
                break;
            case "BACK":
                ctx.fillStyle = baseColor.darker(12 * place.forward).css
                points = [
                    mapPointOnCeiling(place.forward - 1, place.right - .5),
                    mapPointOnCeiling(place.forward - 1, place.right + .5),
                    mapPointOnFloor(place.forward - 1, place.right + .5),
                    mapPointOnFloor(place.forward - 1, place.right - .5),
                ]
                break;
        }

        plotPolygon(ctx, convertFunction, points)
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        let startX: number, startY: number, endX: number, endY: number;

        startX = endX = this.data.x * gridSize;
        startY = endY = this.data.y * gridSize;
        switch (this.data.place.name) {
            case "NORTH":
                endX += gridSize;
                break;
            case "SOUTH":
                startY += gridSize;
                endY += gridSize;
                endX += gridSize;
                break;
            case "WEST":
                endY += gridSize
                break;
            case "EAST":
                startX += gridSize
                endX += gridSize
                endY += gridSize
                break;
        }

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    static get defaultColor():Color { return new Color(250, 250, 250, 1) }
}


export { Wall, WallConfig }