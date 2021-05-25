import { Direction } from "./Direction";
import { Position } from "./Position";
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

    isBlocked(startX: number, startY: number, targetX: number, targetY: number): boolean {
        if (targetX < 0) { return true }
        if (targetY < 0) { return true }
        if (targetX >= this.data.width) { return true }
        if (targetY >= this.data.height) { return true }

        const dX = targetX - startX
        const dY = targetY - startY

        if (this.data.walls.find(
            wall => wall.data.x == startX && wall.data.y == startY && wall.data.place.x == dX && wall.data.place.y == dY
        )) { return true }

        if (this.data.walls.find(
            wall => wall.data.x == targetX && wall.data.y == targetY && wall.data.place.x == -dX && wall.data.place.y == -dY
        )) { return true }

        return false
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
        this.data.walls.forEach((wall) => { wall.drawInMap(ctx, gridSize) });

        if (vantage) {
            vantage.drawInMap(ctx, gridSize);
        }
    }

    drawAsSight(canvas: HTMLCanvasElement, vantage: Vantage, viewWidth = 400, viewHeight = viewWidth): void {
        canvas.setAttribute('width', viewWidth.toString());
        canvas.setAttribute('height', viewHeight.toString());

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, viewWidth, viewHeight)

        const facing = vantage.data.direction;

        const row0Forward = [
            vantage.translate(Direction.combine([facing.leftOf, facing.leftOf, facing.leftOf,facing.leftOf])),
            vantage.translate(Direction.combine([facing.leftOf, facing.leftOf, facing.leftOf])),
            vantage.translate(Direction.combine([facing.leftOf, facing.leftOf])),
            vantage.translate(Direction.combine([facing.leftOf])),
            vantage.translate(Direction.combine([])),
            vantage.translate(Direction.combine([facing.rightOf])),
            vantage.translate(Direction.combine([facing.rightOf, facing.rightOf])),
            vantage.translate(Direction.combine([facing.rightOf, facing.rightOf, facing.rightOf])),
            vantage.translate(Direction.combine([facing.rightOf, facing.rightOf, facing.rightOf, facing.rightOf])),
        ]
        const row1Forward = row0Forward.map(position => position.translate(facing))
        const row2Forward = row1Forward.map(position => position.translate(facing))
        const row3Forward = row2Forward.map(position => position.translate(facing))
        const row4Forward = row3Forward.map(position => position.translate(facing))

        const drawForwardWallRow = (row: Position[], distance: number, fillstyle:string): void => {

            const width = .8 / (2**distance)

            const midLine = .5;
            const xStart = -((row.length * width)-1) / 2;

            let wallToDraw: Wall | undefined;
            let leftEdge = 0;

            for (let index = 0; index < row.length; index++) {

                wallToDraw = this.data.walls.find(wall => {

                    const placeOnOtherSide = row[index].translate(facing)

                    return (wall.data.x === row[index].data.x
                        && wall.data.y === row[index].data.y
                        && wall.data.place.name === facing.name)
                        || (wall.data.x === placeOnOtherSide.data.x
                            && wall.data.y === placeOnOtherSide.data.y
                            && wall.data.place.name === facing.behind.name)
                })

                if (wallToDraw) {
                    leftEdge = (index * width) + xStart
                    ctx.fillStyle = fillstyle;
                    pgon([[leftEdge, midLine - width / 2], [leftEdge + width, midLine - width / 2], [leftEdge + width, midLine + width / 2], [leftEdge, midLine + width / 2]])
                    ctx.fill()
                    ctx.stroke()
                }
            }

        }

        drawForwardWallRow(row4Forward, 4, 'rgba(200,100,100,.7)');
        drawForwardWallRow(row3Forward, 3, 'rgba(200,100,100,.7)');
        drawForwardWallRow(row2Forward, 2, 'rgba(200,100,100,.7)');
        drawForwardWallRow(row1Forward, 1, 'rgba(200,100,100,.7)');
        drawForwardWallRow(row0Forward, 0, 'rgba(200,100,100,.7)');

        function pgon(shape: [number, number][]): void {
            ctx.beginPath()
            ctx.moveTo(...p(...shape[0]));
            for (let index = 1; index < shape.length; index++) {
                ctx.lineTo(...p(...shape[index]))
            }
            ctx.closePath()
        }

        function p(x: number, y: number): [number, number] {
            return [x * viewHeight, y * viewHeight]
        }
    }
}


export { Floor, FloorConfig }