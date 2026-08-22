import { Dimensions, Point } from "./canvas-utility";
import { Color } from "./Color";

interface TextBoardData {
    content: string[]
    size?: Dimensions
    offset?: Point
    backgroundColor?: Color
    textColor?: Color
    textScale?: number
    resolution?: number
    font?:string
}


class TextBoard {
    data: TextBoardData
    storedCanvas: HTMLCanvasElement

    constructor(config: TextBoardData) {
        this.data = config
        this.storedCanvas = this.createCanvas()
    }

    createCanvas(): HTMLCanvasElement {
        const { content, backgroundColor = Color.TRANSPARENT, textColor = Color.BLACK, resolution = 1, textScale = 1, font='arial' } = this.data

        const dimensions: Dimensions = { x: 800 * resolution, y: 450 * resolution }

        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.setAttribute('height', dimensions.y.toString())
        canvas.setAttribute('width', dimensions.x.toString())
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.fillStyle = backgroundColor.css;
            ctx.fillRect(0, 0, dimensions.x, dimensions.y)
            ctx.textAlign = "center"

            ctx.font = `${resolution * textScale * 30}px ${font}`
            ctx.strokeStyle = textColor.css
            ctx.fillStyle = textColor.css

            for (let index = 0; index < content.length; index++) {
                ctx.strokeText(content[index], dimensions.x / 2, (dimensions.y / 4) + (index * 100), dimensions.x)
                ctx.fillText(content[index], dimensions.x / 2, (dimensions.y / 4) + (index * 100), dimensions.x)
            }

        }

        return canvas
    }
}

export { TextBoard, TextBoardData }