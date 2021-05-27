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

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, viewWidth, viewHeight)

        const facing = vantage.data.direction;

        const row0Forward = [
            vantage.translate(Direction.combine([facing.leftOf, facing.leftOf, facing.leftOf, facing.leftOf, facing.leftOf])),
            vantage.translate(Direction.combine([facing.leftOf, facing.leftOf, facing.leftOf, facing.leftOf])),
            vantage.translate(Direction.combine([facing.leftOf, facing.leftOf, facing.leftOf])),
            vantage.translate(Direction.combine([facing.leftOf, facing.leftOf])),
            vantage.translate(Direction.combine([facing.leftOf])),
            vantage.translate(Direction.combine([])),
            vantage.translate(Direction.combine([facing.rightOf])),
            vantage.translate(Direction.combine([facing.rightOf, facing.rightOf])),
            vantage.translate(Direction.combine([facing.rightOf, facing.rightOf, facing.rightOf])),
            vantage.translate(Direction.combine([facing.rightOf, facing.rightOf, facing.rightOf, facing.rightOf])),
            vantage.translate(Direction.combine([facing.rightOf, facing.rightOf, facing.rightOf, facing.rightOf, facing.rightOf])),
        ]


        const rowsAhead = [
            row0Forward
        ]
        rowsAhead.unshift(rowsAhead[0].map(position => position.translate(facing)))
        rowsAhead.unshift(rowsAhead[0].map(position => position.translate(facing)))
        rowsAhead.unshift(rowsAhead[0].map(position => position.translate(facing)))
        rowsAhead.unshift(rowsAhead[0].map(position => position.translate(facing)))
        rowsAhead.unshift(rowsAhead[0].map(position => position.translate(facing)))

        const midLine = .5;

        ctx.fillStyle = 'brown';
        ctx.beginPath()
        pgon([
            [0, 0],
            [1, 0],
            [1, .49],
            [0, .49],
        ])
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()


        rowsAhead.forEach((row, index) => {
            const distance = rowsAhead.length - index - 1

            const farWidth = .8 / (2 ** distance)
            const farXStart = -((row.length * farWidth) - 1) / 2;
            const fillstyle = 'blue'

            const drawFarSideWallIfPresent = (place: Position, index: number): void => {
                const onLeft = index <= row.length / 2
                const leftWallToDraw = this.data.walls.find(wall => {
                    return (wall.isSamePlaceAs(place) && wall.isFacing(facing.leftOf))
                        || (wall.isSamePlaceAs(place.translate(facing.leftOf)) && wall.isFacing(facing.rightOf))
                });
                const rightWallToDraw = this.data.walls.find(wall => {
                    return (wall.isSamePlaceAs(place) && wall.isFacing(facing.rightOf))
                        || (wall.isSamePlaceAs(place.translate(facing.rightOf)) && wall.isFacing(facing.leftOf))
                })

                if (!leftWallToDraw) { return }

                let shape: [number, number][] = [];
                if (onLeft) {
                    const rightEdge = (index * farWidth) + farXStart - (.5 * farWidth)
                    const leftEdge = (index * farWidth) + farXStart

                    const d = (leftEdge - rightEdge)
                    shape = [
                        [leftEdge, midLine - d],
                        [rightEdge, midLine - farWidth],
                        [rightEdge, midLine + farWidth],
                        [leftEdge, midLine + d]
                    ]


                } else {
                    const rightEdge = (index * farWidth) + farXStart + (.5 * farWidth)
                    const leftEdge = (index * farWidth) + farXStart

                    const d = (leftEdge - rightEdge)

                    shape = [
                        [rightEdge, midLine - farWidth],
                        [leftEdge, midLine + d],
                        [leftEdge, midLine - d],
                        [rightEdge, midLine + farWidth],
                    ]
                }

                ctx.fillStyle = fillstyle
                ctx.beginPath()
                pgon(shape)
                ctx.fill()
                ctx.stroke()

            }



            row.forEach((place, index) => {
                const backWall = this.data.walls.find(wall => place.isSamePlaceAs(wall)&&wall.isFacing(vantage.data.direction) )
                if (backWall) {
                    plotBackWall(index,row.length, distance, backWall);
                }
            })

            row.forEach((place, index) => {
                //check - right wall will always be overleft? need to reverse order after half way?
                const leftWall = this.data.walls.find(wall => place.isSamePlaceAs(wall)&&wall.isFacing(vantage.data.direction.leftOf) )
                if (leftWall) {
                    plotLeftWall(index,row.length, distance, leftWall);
                }

                const rightWall = this.data.walls.find(wall => place.isSamePlaceAs(wall)&&wall.isFacing(vantage.data.direction.rightOf) )
                if (rightWall) {
                    plotRightWall(index,row.length, distance, rightWall);
                }
            })

            row.forEach((place, index) => {
                const frontWall = distance > 0 && this.data.walls.find(wall => place.isSamePlaceAs(wall)&&wall.isFacing(vantage.data.direction.behind) )
                if (frontWall ) {
                    plotFrontWall(index,row.length, distance, frontWall);
                }
 
            })


        })

        function plotBackWall (index:number, rowLength:number, distance:number, wall:Wall) {
            const width = .8 / (2 ** distance)
            const xStart = -((rowLength * width) - 1) / 2;
            const leftEdge = (index * width) + xStart
            ctx.fillStyle = 'rgba(0,0,250,.5)';
            ctx.beginPath()
            pgon([[leftEdge, midLine - width / 2], [leftEdge + width, midLine - width / 2], [leftEdge + width, midLine + width / 2], [leftEdge, midLine + width / 2]])
            ctx.fill()
            ctx.stroke()
        }

        function plotLeftWall (index:number, rowLength:number, distance:number, wall:Wall) {
            const width = .8 / (2 ** distance)
            const xStart = -((rowLength * width) - 1) / 2;
            const rightEdge = (index * width) + xStart

            const shortHeight = .8 / (2 ** distance)
            const tallHeight = .8 / (2 ** (distance-1))

            const leftEdge = (index * width) + xStart -( width/2)

            const isLeftOfVantage = index < rowLength/2

            ctx.fillStyle = 'yellow';
            ctx.beginPath()

            if (isLeftOfVantage) {
                pgon([
                    [leftEdge, midLine - tallHeight / 2], 
                    [rightEdge, midLine - shortHeight / 2], 
                    [rightEdge, midLine + shortHeight / 2], 
                    [leftEdge, midLine + tallHeight / 2]
                ])
            } else {
                pgon([
                    [leftEdge, midLine - shortHeight / 2], 
                    [rightEdge, midLine - tallHeight / 2], 
                    [rightEdge, midLine + tallHeight / 2], 
                    [leftEdge, midLine + shortHeight / 2]
                ])
            }
            ctx.fill()
            ctx.stroke()
        }

        function plotRightWall (index:number, rowLength:number, distance:number, wall:Wall) {
            const width = .8 / (2 ** distance)
            const xStart = -((rowLength * width) - 1) / 2;
            const leftEdge = ((index+1.5) * width) + xStart

            const shortHeight = .8 / (2 ** distance)
            const tallHeight = .8 / (2 ** (distance-1))

            const rightEdge = leftEdge - ( width/2)

            const isRightOfVantage = index > rowLength/2

            ctx.fillStyle = 'rgba(40,200,30,.5)';
            ctx.beginPath()

            if (isRightOfVantage) {

                pgon([
                    [leftEdge, midLine - shortHeight / 2], 
                    [rightEdge, midLine - tallHeight / 2], 
                    [rightEdge, midLine + tallHeight / 2], 
                    [leftEdge, midLine + shortHeight / 2]
                ])
            } else {
                pgon([
                    [leftEdge, midLine - tallHeight / 2], 
                    [rightEdge, midLine - shortHeight / 2], 
                    [rightEdge, midLine + shortHeight / 2], 
                    [leftEdge, midLine + tallHeight / 2]
                ])
            }
            ctx.fill()
            ctx.stroke()
        }

        function plotFrontWall (index:number, rowLength:number, distance:number, wall:Wall) {

            const width = .8 / (2 ** (distance-1))
            const xStart = -((rowLength * width) - 1) / 2;

            const leftEdge = (index * width) + xStart

            ctx.fillStyle = 'blue';
            ctx.beginPath()
            pgon([[leftEdge, midLine - width / 2], [leftEdge + width, midLine - width / 2], [leftEdge + width, midLine + width / 2], [leftEdge, midLine + width / 2]])
            ctx.fill()
            ctx.stroke()

        }

        function pgon(shape: [number, number][]): void {
            ctx.moveTo(...p(...shape[0]));
            for (let index = 1; index < shape.length; index++) {
                ctx.lineTo(...p(...shape[index]))
            }
            ctx.closePath()
        }

        function p(x: number, y: number): [number, number] {
            return [x * viewWidth, y * viewHeight]
        }
    }
}


export { Floor, FloorConfig }