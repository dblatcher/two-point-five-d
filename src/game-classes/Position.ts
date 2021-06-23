import { Direction } from './Direction'
import { ConvertFunction, mapPointOnFloor, plotPolygon, Point } from '@/canvas/canvas-utility';
import { Game } from './Game';
import { RenderInstruction } from '@/canvas/RenderInstruction';


interface PositionConfig {
    x: number
    y: number
}

class Position {
    data: PositionConfig

    constructor(config: PositionConfig) {
        this.data = config
    }

    get gridX() {
        return Math.floor(this.data.x);
    }

    get gridY() {
        return Math.floor(this.data.y);
    }

    get squareX() {
        return this.data.x - this.gridX
    }

    get squareY() {
        return this.data.y - this.gridY
    }

    get coords(): [number, number] {
        return [this.gridX, this.gridY]
    }

    translate(vector: PositionConfig): Position {
        return new Position({ x: this.data.x + vector.x, y: this.data.y + vector.y });
    }

    moveAbsolute(direction: Direction, game: Game): void {

        const targetX = this.gridX + (direction.x);
        const targetY = this.gridY + (direction.y);

        if (game.data.level.isBlocked(this.gridX, this.gridY, targetX, targetY)) { return }

        this.data.x = targetX
        this.data.y = targetY
    }

    isInSameSquareAs(otherPosition: Position): boolean {
        return this.gridX === otherPosition.gridX && this.gridY === otherPosition.gridY
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        const { place, viewedFrom } = renderInstruction

        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(this);
        const exactPlace = {
            x: place.forward - 1.5 + rotatedSquarePosition.x,
            y: place.right - .5 + rotatedSquarePosition.y
        }

        const outDistance = .15;

        const foreLeft = mapPointOnFloor(exactPlace.x + outDistance, exactPlace.y - outDistance)
        const backLeft = mapPointOnFloor(exactPlace.x - outDistance, exactPlace.y - outDistance)
        const foreRight = mapPointOnFloor(exactPlace.x + outDistance, exactPlace.y + outDistance)
        const backRight = mapPointOnFloor(exactPlace.x - outDistance, exactPlace.y + outDistance)
        plotPolygon(ctx, convertFunction, [foreLeft, backRight], { noFill: false })
        plotPolygon(ctx, convertFunction, [foreRight, backLeft], { noFill: false })
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        const { gridX, gridY } = this;
        const crossCenterX = (gridX + .5) * gridSize
        const crossCenterY = (gridY + .5) * gridSize

        const crossArmLength = gridSize * (1 / 3)

        ctx.beginPath();
        ctx.moveTo(crossCenterX - crossArmLength, crossCenterY - crossArmLength);
        ctx.lineTo(crossCenterX + crossArmLength, crossCenterY + crossArmLength);
        ctx.moveTo(crossCenterX + crossArmLength, crossCenterY - crossArmLength);
        ctx.lineTo(crossCenterX - crossArmLength, crossCenterY + crossArmLength);

        ctx.stroke();
    }
}


export { Position, PositionConfig }