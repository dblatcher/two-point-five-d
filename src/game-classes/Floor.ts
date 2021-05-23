import { Vantage } from "./Vantage";
import { Wall } from "./Wall"

interface FloorConfig {
    width: number
    height: number
    walls: Wall[]
}

class Floor {
    data: FloorConfig

    constructor(config: FloorConfig) {
        this.data = config
    }

    drawAsMap(canvas: HTMLCanvasElement, vantage?: Vantage, gridSize = 10): void {

        canvas.setAttribute('width', (gridSize * this.data.width).toString());
        canvas.setAttribute('height', (gridSize * this.data.height).toString());

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, gridSize * this.data.width, gridSize * this.data.height)

        ctx.beginPath();
        ctx.rect(0, 0, this.data.width * gridSize, this.data.height * gridSize);
        ctx.stroke();

        ctx.setLineDash([1, 3]);
        for (let index = 1; index < this.data.height; index++) {
            ctx.beginPath();
            ctx.moveTo(0, index * gridSize);
            ctx.lineTo(this.data.width * gridSize, index * gridSize);
            ctx.stroke();
        }
        for (let index = 1; index < this.data.width; index++) {
            ctx.beginPath();
            ctx.moveTo(index * gridSize, 0);
            ctx.lineTo(index * gridSize, this.data.height * gridSize,);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.data.walls.forEach((wall) => {wall.drawInMap(ctx,gridSize)});

        if (vantage) {
            vantage.drawInMap(ctx,gridSize);
        }
    }
}


export { Floor, FloorConfig }