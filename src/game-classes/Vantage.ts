import { Direction } from './Direction'
import store from '@/store'
import { Position } from './Position'

interface VantageConfig {
    x: number
    y: number
    direction: Direction
}

class Vantage extends Position {
    data: VantageConfig

    constructor(config: VantageConfig) {
        super(config)
        this.data = config
    }

    getAbsoluteDirection(relativeDirection: "FORWARD" | "LEFT" | "RIGHT" | "BACK"): Direction {
        switch (relativeDirection) {
            case "FORWARD":
                return this.data.direction
            case "BACK":
                return this.data.direction.behind
            case "LEFT":
                return this.data.direction.leftOf
            case "RIGHT":
                return this.data.direction.rightOf
        }
    }

    move(relativeDirection: "FORWARD" | "LEFT" | "RIGHT" | "BACK", state: typeof store.state):void {
        const direction = this.getAbsoluteDirection(relativeDirection);
        this.moveAbsolute(direction, state)
    }

    turn(direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK"):void {
        switch (direction) {
            case "LEFT":
                this.data.direction = this.data.direction.leftOf;
                break;
            case "RIGHT":
                this.data.direction = this.data.direction.rightOf;
                break;
            case "BACK":
                this.data.direction = this.data.direction.behind;
                break;
        }
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number):void {
        const { x, y, direction: d } = this.data;
        const arrowCenterX = (x + .5) * gridSize
        const arrowCenterY = (y + .5) * gridSize

        let arrowEndX = arrowCenterX,
            arrowEndY = arrowCenterY,
            arrowLeftX = arrowCenterX,
            arrowLeftY = arrowCenterY,
            arrowRightX = arrowCenterX,
            arrowRightY = arrowCenterY;

        arrowEndX += gridSize * .4 * d.x
        arrowEndY += gridSize * .4 * d.y
        arrowLeftX += gridSize * .3 * d.x
        arrowLeftY += gridSize * .3 * d.y
        arrowLeftX += gridSize * .15 * d.leftOf.x
        arrowLeftY += gridSize * .15 * d.leftOf.y
        arrowRightX += gridSize * .3 * d.x
        arrowRightY += gridSize * .3 * d.y
        arrowRightX += gridSize * .1 * d.rightOf.x
        arrowRightY += gridSize * .1 * d.rightOf.y

        ctx.beginPath();
        ctx.moveTo(arrowCenterX, arrowCenterY);
        ctx.lineTo(arrowEndX, arrowEndY);
        ctx.lineTo(arrowLeftX, arrowLeftY);
        ctx.lineTo(arrowEndX, arrowEndY);
        ctx.lineTo(arrowRightX, arrowRightY);
        ctx.stroke();
    }
}


export { Vantage, VantageConfig }