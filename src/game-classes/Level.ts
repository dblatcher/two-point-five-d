import { ConvertFunction, getPlacesInSight, getViewportMapFunction, mapPointOnFloor, MAX_VIEW_DISTANCE, plotPolygon, VANISH_RATE } from "@/canvas/canvas-utility";
import { RenderInstruction } from "@/canvas/RenderInstruction";
import { Sprite } from "@/canvas/Sprite";
import { Color } from "../canvas/Color";
import { Direction } from "./Direction";
import { Item } from "./Item";
import { PointerLocator } from "./PointerLocator";
import { Position } from "./Position";
import { RelativeDirection } from "./RelativeDirection";
import { SquareWithFeatures } from "./SquareWithFeatures";
import { Vantage } from "./Vantage";
import { Wall } from "./Wall"

const renderingZoneFrames = false;

interface LevelConfig {
    width: number
    height: number
    walls: Wall[]
    contents: Array<Vantage | Position>
    defaultWallPattern?: Sprite
    floorColor?: Color
    items: Item[]
}

class Level {
    data: LevelConfig
    tickCount: number

    constructor(config: LevelConfig) {
        this.data = config
        this.tickCount = 0
    }

    static defaultFloorColor = new Color(80, 80, 80);

    isBlocked(startX: number, startY: number, targetX: number, targetY: number): boolean {
        if (targetX < 0) { return true }
        if (targetY < 0) { return true }
        if (targetX >= this.data.width) { return true }
        if (targetY >= this.data.height) { return true }

        const dX = targetX - startX
        const dY = targetY - startY

        if (this.data.contents.find(
            item => {
                if (item.gridX != targetX || item.gridY != targetY) { return false }
                if (item.isSquareWithFeatures) {
                    const squareWithFeatures = (item as SquareWithFeatures)
                    return squareWithFeatures.data.floorFeatures.some(floorFeature => floorFeature.isBlocking)
                }
                return false
            }

        )) { return true }

        if (this.data.walls.find(
            wall => wall.gridX == startX && wall.gridY == startY && wall.data.place.x == dX && wall.data.place.y == dY && wall.isBlocking
        )) { return true }

        if (this.data.walls.find(
            wall => wall.gridX == targetX && wall.gridY == targetY && wall.data.place.x == -dX && wall.data.place.y == -dY && wall.isBlocking
        )) { return true }

        return false
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

    hasSquareAheadBlocked(vantage: Vantage): boolean {
        const wall1 = this.data.walls.find(wall =>
            wall.isInSameSquareAs(vantage) && wall.isFacing(vantage.data.direction) && (wall.isBlocking || wall.hasBlockingFeature)
        )
        const wall2 = this.data.walls.find(wall =>
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
        this.data.walls.forEach((wall) => { wall.drawInMap(ctx, gridSize) });
        this.data.contents.forEach(thing => { thing.drawInMap(ctx, gridSize) })

        if (vantage) {
            vantage.drawInMap(ctx, gridSize);
        }
    }

    drawSightBackground(ctx: CanvasRenderingContext2D, toCanvasCoords: ConvertFunction): void {
        const smallestWallHeight = Wall.baseHeight / (VANISH_RATE ** MAX_VIEW_DISTANCE)
        const floorColor = this.data.floorColor || Level.defaultFloorColor;

        ctx.beginPath()
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: 1 }))
        ctx.fillStyle = 'grey';
        ctx.beginPath()
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: .5 - smallestWallHeight / 2 }))
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
        canvas.setAttribute('width', viewWidth.toString());
        canvas.setAttribute('height', viewHeight.toString());
        const toCanvasCoords = getViewportMapFunction(viewWidth, viewHeight);
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.drawSightBackground(ctx, toCanvasCoords);

        const placesInSight = getPlacesInSight(vantage);
        let renderInstructions: RenderInstruction[] = [];

        this.data.walls.forEach(wall => {
            const place = placesInSight.find(place => place.position.isInSameSquareAs(wall))
            if (!place) { return }
            const relativeDirection = wall.data.place.relativeDirection(vantage.data.direction);
            if (relativeDirection == RelativeDirection.BACK && place.forward == 0) { return } // the back wall of row 0 is 'behind the camera'

            renderInstructions.push(new RenderInstruction({
                place, observer: vantage, subject: wall, level: this,
            }))
        })

        this.data.contents.forEach(thing => {
            const place = placesInSight.find(place => place.position.isInSameSquareAs(thing))
            if (!place) { return }

            renderInstructions.push(new RenderInstruction({
                place, observer: vantage, subject: thing, level: this,
            }))
        })

        this.data.items.
            forEach(item => {
                const { figure: itemFigure } = item
                if (itemFigure) {
                    const place = placesInSight.find(place => place.position.isInSameSquareAs(itemFigure))
                    if (!place) { return }
                    renderInstructions.push(new RenderInstruction({
                        place, observer: vantage, subject: itemFigure, level: this,
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

    withWallsAround(): Level {
        const { walls, width, height } = this.data;
        let x = 0, y = 0;
        for (x = 0; x < width; x++) {
            if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.data.place == Direction.north)) {
                walls.push(new Wall({ x, y, place: Direction.north }))
            }
        }
        x = 0;
        for (y = 0; y < height; y++) {
            if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.data.place == Direction.west)) {
                walls.push(new Wall({ x, y, place: Direction.west }))
            }
        }
        y = height - 1;
        for (x = 0; x < width; x++) {
            if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.data.place == Direction.south)) {
                walls.push(new Wall({ x, y, place: Direction.south }))
            }
        }
        x = width - 1;
        for (y = 0; y < height; y++) {
            if (!walls.find(wall => wall.gridX == x && wall.gridY == y && wall.data.place == Direction.east)) {
                walls.push(new Wall({ x, y, place: Direction.east }))
            }
        }
        return this
    }
}


export { Level, LevelConfig }