import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { Wall } from "@/game-classes/Wall";
import { ConvertFunction, Dimensions } from "./canvas-utility";
import { perspectiveSkew, scaleTo } from "./manipulations";
import { RenderInstruction } from "./RenderInstruction";

interface TextBoardData {
    content: string[]
    size?: Dimensions
    offset?: Dimensions
}


class TextBoard {
    data: TextBoardData
    storedCanvas: HTMLCanvasElement

    constructor(config: TextBoardData) {
        this.data = config
        this.storedCanvas = this.createCanvas()
    }

    createCanvas(): HTMLCanvasElement {
        const { content } = this.data
        const resolution: Dimensions = { x: 800, y: 800 }

        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.setAttribute('height', resolution.y.toString())
        canvas.setAttribute('width', resolution.x.toString())
        const boardContext = canvas.getContext('2d');

        if (boardContext) {
            boardContext.fillRect(0, 0, resolution.x, resolution.y)
            boardContext.textAlign = "center"

            boardContext.font = "40px arial"
            boardContext.strokeStyle = "red"
            boardContext.fillStyle = "white"

            for (let index = 0; index < content.length; index++) {
                boardContext.strokeText(content[index], resolution.x / 2, (resolution.y / 4) + (index * 100), resolution.x)
                boardContext.fillText(content[index], resolution.x / 2, (resolution.y / 4) + (index * 100), resolution.x)
            }
            boardContext.stroke()
        }

        return canvas
    }
}

export { TextBoard, TextBoardData }