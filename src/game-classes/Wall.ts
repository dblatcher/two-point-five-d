import { PlotPlace, ConvertFunction, plotPolygon } from "@/canvas-utility";
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

        const { points, place, relativeDirection } = plotPlace
        const { forward, right } = place

        const baseColor = this.data.color || Wall.defaultColor

        if (relativeDirection === 'FORWARD') {
            ctx.fillStyle = baseColor.darker(12 * (forward + 1)).css
        } else if (relativeDirection === 'BACK') {
            ctx.fillStyle = baseColor.darker(12 * forward).css
        } else {
            ctx.fillStyle = baseColor.darker(12 * (forward+.5)).css
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

    static get defaultColor() { return new Color(250, 250, 250, 1) }
}


export { Wall, WallConfig }