import { Direction } from './Direction'
import { ConvertFunction, mapPointOnFloor, PlotPlace, Point } from '@/canvas/canvas-utility';
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

    get coords(): [number, number] {
        return [this.data.x, this.data.y]
    }

    translate(vector: PositionConfig): Position {
        return new Position({ x: this.data.x + vector.x, y: this.data.y + vector.y });
    }

    moveAbsolute(direction: Direction, game: Game): void {

        const targetX = this.data.x + direction.x;
        const targetY = this.data.y + direction.y;

        if (game.data.level.isBlocked(this.data.x, this.data.y, targetX, targetY)) { return }

        this.data.x = targetX
        this.data.y = targetY
    }

    isSamePlaceAs(otherPosition: Position): boolean {
        return this.data.x === otherPosition.data.x && this.data.y === otherPosition.data.y
    }

    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, plotPlace: PlotPlace, tickCount:number): void {
        const { place } = plotPlace
        const outDistance = .2;
        const points: Point[] = [
            mapPointOnFloor(place.forward - .5 + outDistance, place.right - outDistance),
            mapPointOnFloor(place.forward - .5 + outDistance, place.right + outDistance),
            mapPointOnFloor(place.forward - .5 - outDistance, place.right + outDistance),
            mapPointOnFloor(place.forward - .5 - outDistance, place.right - outDistance),
        ]
        ctx.beginPath();
        ctx.moveTo(...convertFunction(points[0]));
        ctx.lineTo(...convertFunction(points[2]));
        ctx.moveTo(...convertFunction(points[1]));
        ctx.lineTo(...convertFunction(points[3]));
        ctx.stroke();
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