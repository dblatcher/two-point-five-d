import { Direction } from './Direction'
import store from '@/store'

interface PositionConfig {
    x: number
    y: number
}

class Position {
    data: PositionConfig

    constructor(config: PositionConfig) {
        this.data = config
    }

    translate(vector:PositionConfig) {
        return new Position({ x: this.data.x + vector.x, y: this.data.y + vector.y });
    }

    moveAbsolute(direction: Direction, state: typeof store.state) {

        const targetX = this.data.x + direction.x;
        const targetY = this.data.y + direction.y;

        if (state.floor.isBlocked(this.data.x, this.data.y, targetX, targetY)) { return }

        this.data.x = targetX
        this.data.y = targetY
    }

    drawInMap(ctx: CanvasRenderingContext2D, gridSize: number) {
        const { x, y } = this.data;
        const crossCenterX = (x + .5) * gridSize
        const crossCenterY = (y + .5) * gridSize

        const crossArmLength = gridSize * (1 / 3)

        ctx.beginPath();
        ctx.moveTo(crossCenterX - crossArmLength, crossCenterY - crossArmLength);
        ctx.lineTo(crossCenterX + crossArmLength, crossCenterY + crossArmLength);
        ctx.moveTo(crossCenterX + crossArmLength, crossCenterY - crossArmLength);
        ctx.lineTo(crossCenterX - crossArmLength, crossCenterY + crossArmLength);

        ctx.stroke();
    }
}


export { Position, PositionConfig }