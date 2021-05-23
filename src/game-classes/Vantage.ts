import { Direction } from './Direction'
import store from '@/store'

interface VantageConfig {
    x: number
    y: number
    direction: Direction
}

class Vantage {
    data: VantageConfig

    constructor(config: VantageConfig) {
        this.data = config
    }

    move(relativeDirection: "FORWARD" | "LEFT" | "RIGHT" | "BACK", state: typeof store.state) {
        let direction = Direction.nowhere;
        switch (relativeDirection) {
            case "FORWARD":
                direction = this.data.direction
                break;
            case "BACK":
                direction = this.data.direction.behind
                break;
            case "LEFT":
                direction = this.data.direction.leftOf
                break;
            case "RIGHT":
                direction = this.data.direction.rightOf
                break;
        }

        const targetX = this.data.x + direction.x;
        const targetY = this.data.y + direction.y;

        if (state.floor.isBlocked(this.data.x, this.data.y, targetX, targetY)) { return }

        this.data.x = targetX
        this.data.y = targetY
    }

    turn(direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") {
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

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number) {
        const { x, y, direction: d } = this.data;
        const arrowCenterX = (x + .5) * gridSize
        const arrowCenterY = (y + .5) * gridSize

        let arrowEndX = arrowCenterX,
            arrowEndY = arrowCenterY,
            arrowLeftX = arrowCenterX,
            arrowLeftY = arrowCenterY,
            arrowRightX = arrowCenterX,
            arrowRightY = arrowCenterY;

        arrowEndX += gridSize * .45 * d.x
        arrowEndY += gridSize * .45 * d.y
        arrowLeftX += gridSize * .35 * d.x
        arrowLeftY += gridSize * .35 * d.y
        arrowLeftX += gridSize * .15 * d.leftOf.x
        arrowLeftY += gridSize * .15 * d.leftOf.y
        arrowRightX += gridSize * .35 * d.x
        arrowRightY += gridSize * .35 * d.y
        arrowRightX += gridSize * .15 * d.rightOf.x
        arrowRightY += gridSize * .15 * d.rightOf.y

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