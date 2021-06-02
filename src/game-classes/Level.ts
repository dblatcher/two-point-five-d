import { getPlacesInSight, getViewportMapFunction, MAX_VIEW_DISTANCE, PlotPlace, VANISH_RATE } from "@/canvas/canvas-utility";
import { Sprite } from "@/canvas/Sprite";
import { Position } from "./Position";
import { Vantage } from "./Vantage";
import { Wall } from "./Wall"



interface LevelConfig {
    width: number
    height: number
    walls: Wall[]
    contents: Array<Vantage | Position>
}

class Level {
    data: LevelConfig

    constructor(config: LevelConfig) {
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
        this.data.contents.forEach(thing => { thing.drawInMap(ctx, gridSize) })

        if (vantage) {
            vantage.drawInMap(ctx, gridSize);
        }
    }

    drawAsSight(canvas: HTMLCanvasElement, vantage: Vantage, viewWidth = 400, viewHeight = viewWidth): void {
        canvas.setAttribute('width', viewWidth.toString());
        canvas.setAttribute('height', viewHeight.toString());
        const toCanvasCoords = getViewportMapFunction(viewWidth, viewHeight);

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const smallestWallHeight = Wall.baseHeight / (VANISH_RATE ** MAX_VIEW_DISTANCE)

        ctx.beginPath()
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: 1 }))
        ctx.fillStyle = 'grey';
        ctx.beginPath()
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: .5 - smallestWallHeight / 2 }))
        ctx.fillStyle = 'grey';
        ctx.beginPath()
        ctx.fillRect(...toCanvasCoords({ x: 0, y: .5 + smallestWallHeight / 2 }), ...toCanvasCoords({ x: 1, y: 1 }))


        const placesInSight = getPlacesInSight(vantage);

        const plotPlaces: PlotPlace[] = [];

        this.data.walls.forEach(wall => {
            const place = placesInSight.find(place => place.position.isSamePlaceAs(wall))
            if (!place) { return }
            const relativeDirection = wall.data.place.relativeDirection(vantage.data.direction);
            if (relativeDirection == "BACK" && place.forward == 0) { return } // the back wall of row 0 is 'behind the camera'
            plotPlaces.push({ wall, place, relativeDirection })
        })

        this.data.contents.forEach(thing => {
            const place = placesInSight.find(place => place.position.isSamePlaceAs(thing))
            if (!place) { return }

                let relativeDirection;
                if (Object.keys(thing.data).includes('direction')) {
                    relativeDirection = (thing as Vantage).data.direction.relativeDirection(vantage.data.direction)
                }

                plotPlaces.push({ thing, place, relativeDirection})
        })

        plotPlaces.sort((itemA, itemB) => {
            if (itemB.place.forward !== itemA.place.forward) {
                return itemB.place.forward - itemA.place.forward
            }

            function rateDirection(item: PlotPlace): number {
                if (!item.relativeDirection || item.thing) { return 1.5 }

                if (item.relativeDirection === "BACK") { return 1 }
                if (item.relativeDirection === "FORWARD") { return 4 }
                if (item.relativeDirection == 'LEFT' && item.place.right <= 0) { return 2 }
                if (item.relativeDirection == 'RIGHT' && item.place.right >= 0) { return 2 }
                return 3
            }
            return rateDirection(itemB) - rateDirection(itemA)
        })

        plotPlaces.forEach(item => {
            if (item.wall) {
                item.wall.drawInSight(ctx, toCanvasCoords, item)
            }
            if (item.thing) {
                item.thing.drawInSight(ctx, toCanvasCoords, item)
            }
        })

    }
}


export { Level, LevelConfig }