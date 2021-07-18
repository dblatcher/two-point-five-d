import { Direction } from './Direction'
import { ConvertFunction, mapPointOnFloor, plotPolygon, Point, RelativePoint } from '@/canvas/canvas-utility';
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
        this.data.x = Position.roundCoordinate(this.data.x)
        this.data.y = Position.roundCoordinate(this.data.y)
    }

    get isVantage(): boolean { return false }
    get isFloorFeature(): boolean { return false }

    get gridX(): number {
        return Math.floor(this.data.x);
    }

    get gridY(): number {
        return Math.floor(this.data.y);
    }

    get squareX(): number {
        return this.data.x - this.gridX
    }

    get squareY(): number {
        return this.data.y - this.gridY
    }

    get coords(): [number, number] {
        return [this.gridX, this.gridY]
    }

    translate(vector: PositionConfig): Position {
        return new Position({ x: this.data.x + vector.x, y: this.data.y + vector.y });
    }

    moveAbsolute(direction: Direction, game: Game, ignoreWalls = false): void {

        const targetX = this.gridX + (direction.x);
        const targetY = this.gridY + (direction.y);

        if (!ignoreWalls) {
            if (game.data.level.isBlocked(this.gridX, this.gridY, targetX, targetY)) { return }
        }

        this.data.x = Position.roundCoordinate(targetX + this.squareX)
        this.data.y = Position.roundCoordinate(targetY + this.squareX)
    }

    moveAbsoluteBy(distance: number, direction: Direction, game: Game, ignoreWalls = false): void {
        const target = new Position({
            x: this.data.x + distance * direction.x,
            y: this.data.y + distance * direction.y
        })

        if (!ignoreWalls && !target.isInSameSquareAs(this)) {
            let nextPositionInPath: Position = new Position(this.data);
            const squaresCovered: Position[] = [nextPositionInPath];
            let failsafe = 0
            do {
                failsafe++
                nextPositionInPath = nextPositionInPath.translate(direction)
                squaresCovered.push(nextPositionInPath)

                if (failsafe == 99) {
                    console.log({ target, distance, first: squaresCovered[0] })
                }
            } while (!nextPositionInPath.isInSameSquareAs(target) && failsafe < 100);

            let i = 0;
            for (i = 0; i < squaresCovered.length - 1; i++) {
                if (game.data.level.isBlocked(
                    squaresCovered[i].gridX, squaresCovered[i].gridY,
                    squaresCovered[i + 1].gridX, squaresCovered[i + 1].gridY,
                )) { return }
            }
        }

        this.data.x = Position.roundCoordinate(target.data.x)
        this.data.y = Position.roundCoordinate(target.data.y)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shiftWithinSquare(point: Point, game: Game): void {
        function bind(n: number) { return Math.max(0, Math.min(n, .99)) }
        this.data.x = Position.roundCoordinate(this.gridX + bind(point.x))
        this.data.y = Position.roundCoordinate(this.gridY + bind(point.y))
    }

    isInSameSquareAs(otherPosition: Position): boolean {
        return this.gridX === otherPosition.gridX && this.gridY === otherPosition.gridY
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drawInSight(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, tickCount: number): void {
        const { place, viewedFrom } = renderInstruction

        const rotatedSquarePosition = viewedFrom.rotateSquarePosition(this);
        const exactPlace: RelativePoint = {
            f: place.forward - 1.5 + rotatedSquarePosition.x,
            r: place.right - .5 + rotatedSquarePosition.y
        }

        const outDistance = .15;

        const foreLeft = mapPointOnFloor(exactPlace.f + outDistance, exactPlace.r - outDistance)
        const backLeft = mapPointOnFloor(exactPlace.f - outDistance, exactPlace.r - outDistance)
        const foreRight = mapPointOnFloor(exactPlace.f + outDistance, exactPlace.r + outDistance)
        const backRight = mapPointOnFloor(exactPlace.f - outDistance, exactPlace.r + outDistance)
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

    static roundCoordinate(value: number): number {
        return  Math.floor(value * 100) / 100
    }
}


export { Position, PositionConfig }