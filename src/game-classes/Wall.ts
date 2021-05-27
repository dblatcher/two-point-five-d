import { plotPolygon, ConvertFunction, Point } from "@/canvas-utility";
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

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, points: Point[]): void {
        ctx.fillStyle = this.data.color ? this.data.color.css : Wall.defaultColor.css
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

    static get defaultColor() { return new Color(100, 100, 100, 1) }
}


export { Wall, WallConfig }