import { Direction } from './Direction'
import { ConvertFunction, mapPointOnFloor, PlotPlace, plotPolygon, Point } from '@/canvas/canvas-utility';
import { Game } from './Game';

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

        const targetX = this.gridX + direction.x;
        const targetY = this.gridY + direction.y;

        if (game.data.level.isBlocked(this.gridX, this.gridY, targetX, targetY)) { return }

        this.data.x = targetX
        this.data.y = targetY
    }

    isInSameSquareAs(otherPosition: Position): boolean {
        return this.gridX === otherPosition.gridX && this.gridY === otherPosition.gridY
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, plotPlace: PlotPlace, tickCount: number): void {
        const { place } = plotPlace
        const outDistance = .45;
        const foreLeft = mapPointOnFloor(place.forward - 1 + outDistance, place.right - outDistance)
        const backLeft = mapPointOnFloor(place.forward - 1 - outDistance, place.right - outDistance)
        const foreRight = mapPointOnFloor(place.forward - 1 + outDistance, place.right + outDistance)
        const backRight = mapPointOnFloor(place.forward - 1 - outDistance, place.right + outDistance)
        plotPolygon(ctx, convertFunction, [foreLeft, backRight], { noFill: false })
        plotPolygon(ctx, convertFunction, [foreRight, backLeft], { noFill: false })
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number): void {
        const { x, y } = this.data;
        const crossCenterX = (x + .5) * gridSize
        const crossCenterY = (y + .5) * gridSize

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