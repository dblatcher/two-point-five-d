import { getPlacesInSight, getViewportMapFunction, mapPointOnCeiling, mapPointOnFloor, maxViewDistance, plotPolygon, wall0Height } from "@/canvas-utility";
import { Direction } from "./Direction";
import { Position } from "./Position";
import { Vantage } from "./Vantage";
import { Wall } from "./Wall"

interface Point { x: number, y: number }

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

        const toCanvasCoords = getViewportMapFunction(viewWidth, viewHeight);

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        const smallestWallHeight = wall0Height / (Math.SQRT2 ** maxViewDistance)

        ctx.beginPath()
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: 1 }))
        ctx.fillStyle = 'grey';
        ctx.beginPath()
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: .5 - smallestWallHeight / 2 }))
        ctx.fillStyle = 'grey';
        ctx.beginPath()
        ctx.fillRect(...toCanvasCoords({ x: 0, y: .5 + smallestWallHeight/2 }), ...toCanvasCoords({ x: 1, y: 1 }))


        const placesInSight = getPlacesInSight(vantage);
        ctx.fillStyle = 'yellow';

        const wallsToPlot: { points: Point[], wall: Wall, place: { position: Position, forward: number, right: number }, relativeDirection: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }[] = [];

        this.data.walls.forEach(wall => {
            const place = placesInSight.find(place => place.position.isSamePlaceAs(wall))

            if (!place) { return }

            const relativeDirection = wall.data.place.relativeDirection(vantage.data.direction);

            // the back wall of row 0 is 'behind the camera'
            if (relativeDirection == "BACK" && place.forward == 0) { return }

            let points: { x: number, y: number }[] = []

            switch (relativeDirection) {
                case "LEFT":
                    points = [
                        mapPointOnCeiling(place.forward - 1, place.right - .5),
                        mapPointOnCeiling(place.forward, place.right - .5),
                        mapPointOnFloor(place.forward, place.right - .5),
                        mapPointOnFloor(place.forward - 1, place.right - .5),
                    ]
                    break;
                case "RIGHT":
                    points = [
                        mapPointOnCeiling(place.forward - 1, place.right + .5),
                        mapPointOnCeiling(place.forward, place.right + .5),
                        mapPointOnFloor(place.forward, place.right + .5),
                        mapPointOnFloor(place.forward - 1, place.right + .5),
                    ]
                    break;
                case "FORWARD":
                    points = [
                        mapPointOnCeiling(place.forward, place.right - .5),
                        mapPointOnCeiling(place.forward, place.right + .5),
                        mapPointOnFloor(place.forward, place.right + .5),
                        mapPointOnFloor(place.forward, place.right - .5),
                    ]
                    break;
                case "BACK":
                    points = [
                        mapPointOnCeiling(place.forward - 1, place.right - .5),
                        mapPointOnCeiling(place.forward - 1, place.right + .5),
                        mapPointOnFloor(place.forward - 1, place.right + .5),
                        mapPointOnFloor(place.forward - 1, place.right - .5),
                    ]
                    break;
            }

            if (points.length) {
                wallsToPlot.push({ points, wall, place, relativeDirection })
            }
        })

        wallsToPlot.sort((itemA, itemB) => {
            if (itemB.place.forward !== itemA.place.forward) {
                return itemB.place.forward - itemA.place.forward
            }

            const directionRatingA = itemA.relativeDirection === "FORWARD"
                ? 3
                : itemA.relativeDirection === "BACK"
                    ? 1 : 2
            const directionRatingB = itemB.relativeDirection === "FORWARD"
                ? 3
                : itemB.relativeDirection === "BACK"
                    ? 1 : 2
            return directionRatingB - directionRatingA
        })

        wallsToPlot.forEach(item => {
            plotPolygon(ctx, toCanvasCoords, item.points)
        })

    }
}


export { Floor, FloorConfig }