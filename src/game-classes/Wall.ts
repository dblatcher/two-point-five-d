import { Direction } from "./Direction";
import { Position } from "./Position";

interface WallConfig {
    x: number
    y: number
    place: Direction
}

class Wall extends Position {
    data: WallConfig

    constructor(config: WallConfig) {
        super(config)
        this.data = config
    }

    isFacing(direction:Direction):boolean {
        return this.data.place.x === direction.x && this.data.place.y === direction.y
    }

    drawInMap(ctx:CanvasRenderingContext2D, gridSize:number):void {
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
}


export { Wall, WallConfig }