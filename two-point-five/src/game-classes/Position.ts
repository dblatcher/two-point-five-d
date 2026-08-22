import { Direction } from './Direction'
import { ConvertFunction, mapPointOnFloor, PlotConfig, plotPolygon, Point, RelativePoint } from '@/canvas/canvas-utility';
import { Game } from './Game';
import { RenderInstruction } from '@/canvas/RenderInstruction';
import { Blockage } from './Level';


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
    get isSquareWithFeatures(): boolean { return false }

    get gridX(): number {
        return Math.floor(this.data.x);
    }

    get gridY(): number {
        return Math.floor(this.data.y);
    }

    get squareX(): number {
        return this.data.x - this.gridX
    }

    set squareX(value: number) {
        this.data.x = this.gridX + value
    }

    get squareY(): number {
        return this.data.y - this.gridY
    }

    set squareY(value: number) {
        this.data.y = this.gridY + value
    }

    get coords(): [number, number] {
        return [this.gridX, this.gridY]
    }

    translate(vector: PositionConfig): Position {
        return new Position({ x: this.data.x + vector.x, y: this.data.y + vector.y });
    }

    changePosition(place: Point, game: Game): void {
        this.data.x = Position.roundCoordinate(place.x)
        this.data.y = Position.roundCoordinate(place.y)
    }

    moveAbsolute(direction: Direction, game: Game, ignoreWalls = false): Blockage | undefined {

        const targetX = this.gridX + (direction.x);
        const targetY = this.gridY + (direction.y);

        if (!ignoreWalls) {
            const blockage = game.data.level.findBlockage(this.gridX, this.gridY, targetX, targetY, this, game);
            if (blockage) { return blockage }
        }

        this.changePosition({ x: targetX + this.squareX, y: targetY + this.squareY }, game)
    }

    moveAbsoluteBy(distance: number, direction: Direction, game: Game, ignoreWalls = false): Blockage | undefined {
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
            let blockage;
            for (i = 0; i < squaresCovered.length - 1; i++) {
                blockage = (game.data.level.findBlockage(
                    squaresCovered[i].gridX, squaresCovered[i].gridY,
                    squaresCovered[i + 1].gridX, squaresCovered[i + 1].gridY,
                    this, game
                ));
                if (blockage) {
                    return blockage
                }
            }
        }

        this.changePosition(target.data, game)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shiftWithinSquare(point: Point, game: Game): void {
        function bind(n: number) { return Math.max(0, Math.min(n, .99)) }
        this.changePosition({ x: this.gridX + bind(point.x), y: this.gridY + bind(point.y) }, game)
    }

    isInSameSquareAs(otherPosition: Position): boolean {
        return this.gridX === otherPosition.gridX && this.gridY === otherPosition.gridY
    }

    isAlmostExactlyTheSamePlaceAs(otherPosition: Position, tolerance = .05): boolean {
        if (!this.isInSameSquareAs(otherPosition)) { return false }
        return Math.abs(this.squareX - otherPosition.squareX) < tolerance && Math.abs(this.squareY - otherPosition.squareY) < tolerance
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

        const convert = (p: Point) => [
            (gridX + .5 + p.x) * gridSize,
            (gridY + .5 + p.y) * gridSize,
        ] as [number, number]

        this.drawInMapPoints.forEach(polygon => {
            plotPolygon(
                ctx, convert,
                polygon,
                this.drawInMapConfig)
        })
    }


    drawInMapConfig: PlotConfig = { noClose: true, noFill: true }

    get drawInMapPoints(): Point[][] {
        const arm1 = [{ x: -.2, y: .2 }, { x: .2, y: -.2 }];
        const arm2 = [{ x: -.2, y: -.2 }, { x: .2, y: .2 }];
        return [arm1, arm2]
    }

    static roundCoordinate(value: number): number {
        return Math.floor(value * 100) / 100
    }
}


export { Position, PositionConfig }