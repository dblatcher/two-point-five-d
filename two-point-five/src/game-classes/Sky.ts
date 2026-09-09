import { ConvertFunction } from "@/canvas/canvas-utility";
import { Color, ColorParams } from "@/canvas/Color";
import { Direction } from "./Direction";
import { ticksPerMinute } from "./Game";
import { Vantage } from "./Vantage";

interface SkyData {
    skyBaseColor: Color
    sun?: boolean
    indoors?: boolean
}

interface SkyInput {
    skyBaseColor: ColorParams
    sun?: boolean
    indoors?: boolean
}

class Sky {
    data: SkyData

    static dawn = 2
    static night = 22
    static noon = 12

    constructor(data: SkyInput) {
        this.data = {
            ...data,
            skyBaseColor: Color.fromConfig(data.skyBaseColor)
        }
    }
    serialise(): SkyInput {
        return {
            ...this.data,
            skyBaseColor: this.data.skyBaseColor.serialise(),
        }
    }

    decimalTime(time: [number, number]): number {
        return time[0] + (time[1] / ticksPerMinute)
    }

    currentColor(time: [number, number]): Color {
        const { skyBaseColor } = this.data
        if (this.data.indoors) { return skyBaseColor }

        if (time[0] < Sky.dawn || time[0] > Sky.night) { return Color.BLACK }

        const decimalTime = this.decimalTime(time)
        const darkness = Math.abs(decimalTime - Sky.noon) * 20
        return skyBaseColor.darker(darkness)
    }

    sunPosition(time: [number, number]): { direction: Direction, size: number, height: number } | null {

        if (time[0] < Sky.dawn || time[0] > Sky.night) { return null }

        const decimalTime = this.decimalTime(time)
        const direction = decimalTime < Sky.noon ? Direction.east : Direction.west;
        const darkness = Math.abs(decimalTime - Sky.noon)
        const height = .5 - (darkness / (Sky.night - Sky.dawn))

        return {
            direction,
            size: .05,
            height,
        }

    }

    render(ctx: CanvasRenderingContext2D, toCanvasCoords: ConvertFunction, vantage: Vantage, aspect: number, _smallestWallHeight: number, timeOfDay: [number, number]): void {
        ctx.fillStyle = this.currentColor(timeOfDay).css
        ctx.beginPath()
        ctx.fillRect(0, 0, ...toCanvasCoords({ x: 1, y: .5 }))

        if (this.data.sun) {
            const sunPosition = this.sunPosition(timeOfDay)
            if (sunPosition && vantage.data.direction == sunPosition.direction.name) {
                ctx.fillStyle = Color.YELLOW.lighter(30).css;
                ctx.beginPath()

                ctx.ellipse(...toCanvasCoords({ x: .5, y: .5 - sunPosition.height }), ...toCanvasCoords({ x: sunPosition.size, y: sunPosition.size * aspect }), 0, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fill()
            }
        }
    }
}


export { Sky, SkyData, SkyInput }