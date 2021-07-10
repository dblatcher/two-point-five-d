import { Dimensions, Point } from "./canvas-utility";
import { Color } from "./Color";

interface TextBoardData {
    content: string[]
    size?: Dimensions
    offset?: Point
    backgroundColor?: Color
    textColor?: Color
    resolution?: Dimensions
}


class TextBoard {
    data: TextBoardData
    storedCanvas: HTMLCanvasElement

    constructor(config: TextBoardData) {
        this.data = config
        this.storedCanvas = this.createCanvas()
    }

    createCanvas(): HTMLCanvasElement {
        const { content, backgroundColor = Color.TRANSPARENT, textColor = Color.BLACK, resolution = { x: 800, y: 600 } } = this.data

        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.setAttribute('height', resolution.y.toString())
        canvas.setAttribute('width', resolution.x.toString())
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.fillStyle = backgroundColor.css;
            ctx.fillRect(0, 0, resolution.x, resolution.y)
            ctx.textAlign = "center"

            ctx.font = "40px arial"
            ctx.strokeStyle = textColor.css
            ctx.fillStyle = textColor.css

            for (let index = 0; index < content.length; index++) {
                ctx.strokeText(content[index], resolution.x / 2, (resolution.y / 4) + (index * 100), resolution.x)
                ctx.fillText(content[index], resolution.x / 2, (resolution.y / 4) + (index * 100), resolution.x)
            }

        }

        return canvas
    }
}

export { TextBoard, TextBoardData }