import { ConvertFunction, getPlacesInSight, getViewportMapFunction, mapPointOnFloor, MAX_VIEW_DISTANCE, plotPolygon, Point, VANISH_RATE } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { Sprite } from "@/canvas/Sprite";
import { Actor } from "@/game-classes/Actor";
import { Color } from "../canvas/Color";
import { Controller } from "./Controller";
import { Direction } from "./Direction";
import { Game, ticksPerMinute } from "./Game";
import { Item } from "./Item";
import { PointerLocator } from "./PointerLocator";
import { RelativeDirection } from "./RelativeDirection";
import { Sky } from "./Sky";
import { SquareWithFeatures } from "./SquareWithFeatures";
import { Vantage, VantageConfig } from "./Vantage";
import { Wall } from "./Wall"
import { Position } from "./Position"
import { PlayerVantage } from "./PlayerVantage";

const renderingZoneFrames = false;

interface VictoryTest {
    (level: Level, game: Game): boolean
}

interface Blockage {
    edgeOfLevel?: boolean
    wall?: Wall
    squareWithFeature?: SquareWithFeatures
    actor?: Actor
    playerVantage?: PlayerVantage
    blockageClass?: typeof Wall | typeof SquareWithFeatures | typeof Actor | typeof PlayerVantage
}

interface LevelConfig {
    width: number
    height: number
    walls: Wall[]
    squaresWithFeatures?: SquareWithFeatures[]
    defaultWallPattern?: Sprite
    floorColor?: Color
    sky?: Sky

    items: Item[]
    actors?: Actor[]

    controllers?: Controller[]
    victoryCondition?: VictoryTest
    victoryMessage?: string
    startingVantage?: VantageConfig
}


class Level {
    data: LevelConfig
    tickCount: number

    constructor(config: LevelConfig) {
        this.data = config
        this.tickCount = 0
    }

    static defaultFloorColor = new Color(80, 80, 80);

    get timeOfDay(): [number, number] {
        const hour = Math.floor((this.tickCount % (24 * ticksPerMinute)) / ticksPerMinute)
        const minute = Math.floor((this.tickCount % ticksPerMinute))
        return [hour, minute]
    }

    /**
     * Check if a moving actor or position is able to pass from one square to an adjacent square
     * @param startX the integer grid X of the starting position
     * @param startY the integer grid Y of the starting position
     * @param targetX the integer grid X of the target position
     * @param targetY the integer grid Y of the target position
     * @param movingActor 
     * @param game 
     * @returns whether the way is blocked
     */
    isBlocked(startX: number, startY: number, targetX: number, targetY: number, movingActor: Actor | Position, game: Game): boolean {
        const { squaresWithFeatures = [], walls = [], actors = [] } = this.data
        const { playerBlocksPassage } = game.rules

        if (targetX < 0) { return true }
        if (targetY < 0) { return true }
        if (targetX >= this.data.width) { return true }
        if (targetY >= this.data.height) { return true }

        if (squaresWithFeatures.find(
            squareWithFeature => {
                if (squareWithFeature.gridX != targetX || squareWithFeature.gridY != targetY) { return false }
                return squareWithFeature.data.floorFeatures.some(floorFeature => floorFeature.isBlocking)
            }

        )) { return true }

        if (actors.find(
            actor => {
                return actor != movingActor && actor.data.blocksSquare && actor.data.vantage?.gridX == targetX && actor.data.vantage?.gridY == targetY
            }
        )) { return true }

        if (movingActor !== game.data.playerVantage && playerBlocksPassage) {
            if (game.data.playerVantage.gridX == targetX && game.data.playerVantage.gridY == targetY) { return true }
        }

        const dX = targetX - startX
        const dY = targetY - startY

        if (walls.find(
            wall => wall.gridX == startX && wall.gridY == startY && wall.data.place.x == dX && wall.data.place.y == dY && wall.isBlocking
        )) { return true }

        if (walls.find(
            wall => wall.gridX == targetX && wall.gridY == targetY && wall.data.place.x == -dX && wall.data.place.y == -dY && wall.isBlocking
        )) { return true }

        return false
    }

/**
 * Find what is stopping a moving actor from passing from one square to an adjacent square
 * @param startX the integer grid X of the starting position
 * @param startY the integer grid Y of the starting position
 * @param targetX the integer grid X of the target position
 * @param targetY the integer grid Y of the target position
 * @param movingActor 
 * @param game 
 * @returns the blockage, or null
 */
    findBlockage(startX: number, startY: number, targetX: number, targetY: number, movingActor: Actor | Position, game: Game): Blockage | undefined {
        const { squaresWithFeatures = [], walls = [], actors = [] } = this.data
        const { playerBlocksPassage } = game.rules

        if (targetX < 0 || targetY < 0 || targetX >= this.data.width || targetY >= this.data.height) { return { edgeOfLevel: true } }

        const blockingSquare = squaresWithFeatures.find(
            squareWithFeature => {
                if (squareWithFeature.gridX != targetX || squareWithFeature.gridY != targetY) { return false }
                return squareWithFeature.data.floorFeatures.some(floorFeature => floorFeature.isBlocking)
            });

        if (blockingSquare) {
            return {
                squareWithFeature: blockingSquare,
                blockageClass: SquareWithFeatures,
            }
        }

        const blockingActor = (actors.find(
            actor => {
                return actor != movingActor && actor.data.blocksSquare && actor.data.vantage?.gridX == targetX && actor.data.vantage?.gridY == targetY
            }
        ))

        if (blockingActor) {
            return {
                actor: blockingActor,
                blockageClass: Actor,
            }
        }


        if (movingActor !== game.data.playerVantage && playerBlocksPassage) {
            if (game.data.playerVantage.gridX == targetX && game.data.playerVantage.gridY == targetY) {
                return {
                    playerVantage: game.data.playerVantage,
                    blockageClass: PlayerVantage
                }
            }
        }

        const dX = targetX - startX
        const dY = targetY - startY

        const blockingWall1 = walls.find(
            wall => wall.gridX == startX && wall.gridY == startY && wall.data.place.x == dX && wall.data.place.y == dY && wall.isBlocking
        );
        if (blockingWall1) {
            return {
                wall: blockingWall1,
                blockageClass: Wall,
            }
        }

        const blockingWall2 = walls.find(
            wall => wall.gridX == targetX && wall.gridY == targetY && wall.data.place.x == -dX && wall.data.place.y == -dY && wall.isBlocking
        )
        if (blockingWall2) {
            return {
                wall: blockingWall2,
                blockageClass: Wall,
            }
        }

        return undefined
    }

    hasWallInFace(vantage: Vantage): boolean {
        const wall1 = this.data.walls.find(wall =>
            wall.isInSameSquareAs(vantage) && wall.isFacing(vantage.data.direction) && (wall.isBlocking || wall.hasInteractableFeature)
        )
        const wall2 = this.data.walls.find(wall =>
            wall.isInSameSquareAs(vantage.translate(vantage.data.direction)) && wall.isFacing(vantage.data.direction.behind) && (wall.isBlocking || wall.hasInteractableFeature)
        )
        return !!(wall1 || wall2)
    }

    hasSquareAheadBlockedByWall(vantage: Vantage): boolean {
        const { walls = [] } = this.data
        const wall1 = walls.find(wall =>
            wall.isInSameSquareAs(vantage) && wall.isFacing(vantage.data.direction) && (wall.isBlocking || wall.hasBlockingFeature)
        )
        const wall2 = walls.find(wall =>
            wall.isInSameSquareAs(vantage.translate(vantage.data.direction)) && wall.isFacing(vantage.data.direction.behind) && (wall.isBlocking || wall.hasBlockingFeature)
        )
        return !!(wall1 || wall2)
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

        const { walls = [], squaresWithFeatures = [], actors = [] } = this.data

        walls.forEach(wall => { wall.drawInMap(ctx, gridSize) });
        squaresWithFeatures.forEach(thing => { thing.drawInMap(ctx, gridSize) })

        actors.filter(npc => npc.figure).forEach(npc => npc.figure?.drawInMap(ctx, gridSize))

        if (vantage) {
            vantage.drawInMap(ctx, gridSize);
        }
    }

    drawSightBackground(ctx: CanvasRenderingContext2D, toCanvasCoords: ConvertFunction, vantage: Vantage, aspect: number): void {
        const smallestWallHeight = Wall.baseHeight / (VANISH_RATE ** MAX_VIEW_DISTANCE)
        const floorColor = this.data.floorColor || Level.defaultFloorColor;

        ctx.fillStyle = Color.BLACK.css
        ctx.beginPath()
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: 1 }))


        const { timeOfDay } = this;

        if (this.data.sky) {
            this.data.sky.render(ctx, toCanvasCoords, vantage, aspect, smallestWallHeight, timeOfDay)
        } else {
            ctx.fillStyle = Color.GRAY.css
            ctx.beginPath()
            ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: .5 - smallestWallHeight / 2 }))
        }




        ctx.fillStyle = floorColor.css;
        ctx.beginPath()
        ctx.fillRect(...toCanvasCoords({ x: 0, y: .5 + smallestWallHeight / 2 }), ...toCanvasCoords({ x: 1, y: 1 }))

        function drawLineToHorizon(r: number): void {
            plotPolygon(ctx, toCanvasCoords, [mapPointOnFloor(-1, r), mapPointOnFloor(MAX_VIEW_DISTANCE, r)], { noClose: true, noFill: true, strokeStyle: floorColor.darker(35).css })
        }

        function drawLineParellelToHorizon(f: number): void {
            plotPolygon(ctx, toCanvasCoords, [mapPointOnFloor(f, -MAX_VIEW_DISTANCE), mapPointOnFloor(f, MAX_VIEW_DISTANCE)], { noClose: true, noFill: true, strokeStyle: floorColor.darker(35).css })
        }

        for (let r = -Math.floor(MAX_VIEW_DISTANCE / 2) - .5; r < Math.floor(MAX_VIEW_DISTANCE / 2) + .5; r++) {
            drawLineToHorizon(r)
        }
        for (let f = 0; f < MAX_VIEW_DISTANCE; f++) {
            drawLineParellelToHorizon(.5 + f)
        }
    }

    drawAsSight(canvas: HTMLCanvasElement, vantage: Vantage, viewWidth = 600, viewHeight = viewWidth * (2 / 3)): void {
        const { items = [], squaresWithFeatures = [], actors = [], walls = [] } = this.data

        canvas.setAttribute('width', viewWidth.toString());
        canvas.setAttribute('height', viewHeight.toString());
        const toCanvasCoords = getViewportMapFunction(viewWidth, viewHeight);
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.drawSightBackground(ctx, toCanvasCoords, vantage, viewWidth / viewHeight);

        const placesInSight = getPlacesInSight(vantage);
        let renderInstructions: RenderInstruction[] = [];

        walls.forEach(wall => {
            const place = placesInSight.find(place => place.position.isInSameSquareAs(wall))
            if (!place) { return }
            const relativeDirection = wall.data.place.relativeDirection(vantage.data.direction);
            if (relativeDirection == RelativeDirection.BACK && place.forward == 0) { return } // the back wall of row 0 is 'behind the camera'

            renderInstructions.push(new RenderInstruction({
                place, observer: vantage, subject: wall, level: this,
            }))
        })

        squaresWithFeatures.forEach(thing => {
            const place = placesInSight.find(place => place.position.isInSameSquareAs(thing))
            if (!place) { return }

            renderInstructions.push(new RenderInstruction({
                place, observer: vantage, subject: thing, level: this,
            }))
        })

        items.forEach(item => {
            const { figure: itemFigure } = item
            if (itemFigure) {
                const place = placesInSight.find(place => place.position.isInSameSquareAs(itemFigure))
                if (!place) { return }
                renderInstructions.push(new RenderInstruction({
                    place, observer: vantage, subject: itemFigure, level: this,
                }))
            }
        })

        actors.forEach(npc => {
            const { figure } = npc
            if (figure) {
                const place = placesInSight.find(place => place.position.isInSameSquareAs(figure))
                if (!place) { return }
                renderInstructions.push(new RenderInstruction({
                    place, observer: vantage, subject: figure, level: this,
                }))
            }
        })

        renderInstructions = RenderInstruction.putInOrder(renderInstructions);

        renderInstructions.forEach(renderInstruction => {
            if (renderInstruction.wall) {
                renderInstruction.wall.drawInSight(ctx, toCanvasCoords, renderInstruction, this.tickCount, this.data.defaultWallPattern)
            }
            if (renderInstruction.thing) {
                renderInstruction.thing.drawInSight(ctx, toCanvasCoords, renderInstruction, this.tickCount)
            }
        })

        if (renderingZoneFrames) {
            this.renderZoneFrames(ctx, vantage, toCanvasCoords);
        }

    }

    renderZoneFrames(ctx: CanvasRenderingContext2D, vantage: Vantage, toCanvasCoords: ConvertFunction): void {
        const locator = new PointerLocator()

        if (this.hasWallInFace(vantage)) {
            ctx.fillStyle = new Color(100, 255, 100, .125).css
            plotPolygon(ctx, toCanvasCoords, [
                locator.frontWall.topLeft,
                locator.frontWall.topRight,
                locator.frontWall.bottomRight,
                locator.frontWall.bottomLeft,
            ])
        } else {
            ctx.fillStyle = new Color(255, 100, 100, .25).css
            plotPolygon(ctx, toCanvasCoords, [
                locator.floor.forwardLeft,
                locator.floor.forwardRight,
                locator.floor.backRight,
                locator.floor.backLeft,
            ])

            ctx.fillStyle = new Color(100, 255, 100, .25).css
            plotPolygon(ctx, toCanvasCoords, [
                locator.backWall.topLeft,
                locator.backWall.topRight,
                locator.backWall.bottomRight,
                locator.backWall.bottomLeft,
            ])
        }

        ctx.fillStyle = new Color(255, 0, 255, .1).css
        plotPolygon(ctx, toCanvasCoords, [
            locator.leftWall.forwardTop,
            locator.leftWall.backTop,
            locator.leftWall.backBottom,
            locator.leftWall.forwardBottom,
        ])

        ctx.fillStyle = new Color(255, 0, 255, .1).css
        plotPolygon(ctx, toCanvasCoords, [
            locator.rightWall.forwardTop,
            locator.rightWall.backTop,
            locator.rightWall.backBottom,
            locator.rightWall.forwardBottom,
        ])
    }



    withWallsAround(config: { color?: Color, patternSprite?: Sprite, shape?: Point[] } = {}): Level {
        const { walls, width, height } = this.data;
        const { color, patternSprite, shape } = config;

        let x = 0, y = 0;
        for (x = 0; x < width; x++) {
            if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.data.place == Direction.north)) {
                walls.push(new Wall({ x, y, place: Direction.north, color, patternSprite, shape }))
            }
        }
        x = 0;
        for (y = 0; y < height; y++) {
            if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.data.place == Direction.west)) {
                walls.push(new Wall({ x, y, place: Direction.west, color, patternSprite, shape }))
            }
        }
        y = height - 1;
        for (x = 0; x < width; x++) {
            if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.data.place == Direction.south)) {
                walls.push(new Wall({ x, y, place: Direction.south, color, patternSprite, shape }))
            }
        }
        x = width - 1;
        for (y = 0; y < height; y++) {
            if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.data.place == Direction.east)) {
                walls.push(new Wall({ x, y, place: Direction.east, color, patternSprite, shape }))
            }
        }
        return this
    }
}


export { Level, LevelConfig, Blockage }