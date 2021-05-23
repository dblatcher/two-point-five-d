interface WallConfig {
    x: number
    y: number
    place: "NORTH" | "SOUTH" | "EAST" | "WEST"
}

class Wall {
    data: WallConfig

    constructor(config: WallConfig) {
        this.data = config
    }

    drawInMap(ctx:CanvasRenderingContext2D, gridSize:number) {
        let startX: number, startY: number, endX: number, endY: number;

        startX = endX = this.data.x * gridSize;
        startY = endY = this.data.y * gridSize;
        switch (this.data.place) {
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