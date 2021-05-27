import { getPlacesInSight, getViewportMapFunction, mapPointOnCeiling, mapPointOnFloor, plotPolygon } from "@/canvas-utility";
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

        const toCanvasCoords = getViewportMapFunction(viewWidth, viewHeight);

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        ctx.beginPath()
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: 1 }))
        ctx.fillStyle = 'brown';
        ctx.beginPath()
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: .5 }))


        const placesInSight = getPlacesInSight(vantage);

        ctx.fillStyle = 'red';
        //ORDERING!! can't plot in wall order, need to collect points then sort by forward distance descending
        this.data.walls.forEach(wall => {
            const placeInSight = placesInSight.find(place => place.position.isSamePlaceAs(wall))

            if (!placeInSight) { return }

            const relativeDirection = wall.data.place.relativeDirection(vantage.data.direction);

            if (relativeDirection == "BACK" && placeInSight.forward == 0) {
                console.log('not plotting the wall behind me')
                return
            }

            console.log(`need to draw a wall facing ${relativeDirection}, ${placeInSight.forward} square forward and ${placeInSight.right} square right`)


            let points: { x: number, y: number }[] = []

            switch (relativeDirection) {
                case "LEFT":
                    points = [
                        mapPointOnCeiling(placeInSight.forward - 1, placeInSight.right - .5),
                        mapPointOnCeiling(placeInSight.forward, placeInSight.right - .5),
                        mapPointOnFloor(placeInSight.forward, placeInSight.right - .5),
                        mapPointOnFloor(placeInSight.forward - 1, placeInSight.right - .5),
                    ]
                    break;
                case "RIGHT":
                    points = [
                        mapPointOnCeiling(placeInSight.forward - 1, placeInSight.right + .5),
                        mapPointOnCeiling(placeInSight.forward, placeInSight.right + .5),
                        mapPointOnFloor(placeInSight.forward, placeInSight.right + .5),
                        mapPointOnFloor(placeInSight.forward - 1, placeInSight.right + .5),
                    ]
                    break;
                case "FORWARD":
                    points = [
                        mapPointOnCeiling(placeInSight.forward, placeInSight.right - .5),
                        mapPointOnCeiling(placeInSight.forward, placeInSight.right + .5),
                        mapPointOnFloor(placeInSight.forward, placeInSight.right + .5),
                        mapPointOnFloor(placeInSight.forward, placeInSight.right - .5),
                    ]
                    break;
                case "BACK":
                    points = [
                        mapPointOnCeiling(placeInSight.forward - 1, placeInSight.right - .5),
                        mapPointOnCeiling(placeInSight.forward - 1, placeInSight.right + .5),
                        mapPointOnFloor(placeInSight.forward - 1, placeInSight.right + .5),
                        mapPointOnFloor(placeInSight.forward - 1, placeInSight.right - .5),
                    ]
                    break;
            }

            //ORDERING!! can't plot in wall order, need to collect points then sort by forward distance descending
            if (points.length) {
                plotPolygon(ctx, toCanvasCoords, points)
            }

        })




    }
}


export { Floor, FloorConfig }