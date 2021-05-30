import { PlotPlace, ConvertFunction, plotPolygon, Point, mapPointInSight } from "@/canvas-utility";
import { Color } from "./Color";
import { Direction } from "./Direction";
import { Position } from "./Position";



interface WallConfig {
    x: number
    y: number
    place: Direction
    color?: Color
    shape?: Point[]
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
        const shape = this.data.shape || Wall.defaultShape

        let points: Point[] = []
        switch (relativeDirection) {
            case "LEFT":
                ctx.fillStyle = baseColor.darker(12 * (place.forward + .5)).css
                points = shape.map(point => {
                    return mapPointInSight(place.forward - point.x, place.right - .5, point.y)
                })
                break;
            case "RIGHT":
                ctx.fillStyle = baseColor.darker(12 * (place.forward + .5)).css
                points = shape.map(point => {
                    return mapPointInSight(place.forward - point.x, place.right + .5, point.y)
                })
                break;
            case "FORWARD":
                ctx.fillStyle = baseColor.darker(12 * (place.forward + 1)).css
                points = shape.map(point => {
                    return mapPointInSight(place.forward, place.right - .5 + point.x, point.y)
                })
                break;
            case "BACK":
                ctx.fillStyle = baseColor.darker(12 * place.forward).css
                points = shape.map(point => {
                    return mapPointInSight(place.forward - 1, place.right - .5 + point.x, point.y)
                })
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

    static get defaultColor(): Color { return new Color(250, 250, 250, 1) }

    static get defaultShape(): Point[] {
        return [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
        ]
    }

    static get baseHeight(): number {
        return .8
    }

    static get baseWidth(): number {
        return .8
    }
}


export { Wall, WallConfig }