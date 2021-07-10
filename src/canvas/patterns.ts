import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { Sprite } from "@/canvas/Sprite";
import { Wall } from "@/game-classes/Wall";
import { ConvertFunction, Point } from "./canvas-utility";
import { perspectiveSkew, scaleTo } from "./manipulations";
import { RenderInstruction } from "./RenderInstruction";
import { TextBoard } from "./TextBoard";


function getPatternFill(
    ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction,
    tickCount: number,
    sprite: Sprite, animationName: string, fullWallPoints: Point[]
): CanvasPattern | null {

    const xValues = fullWallPoints.map(point => point.x);
    const yValues = fullWallPoints.map(point => point.y);

    const topLeft = convertFunction({ x: Math.min(...xValues), y: Math.min(...yValues) })

    const convertedDimensions = convertFunction({
        x: Math.max(...xValues) - Math.min(...xValues),
        y: Math.max(...yValues) - Math.min(...yValues),
    })

    try {
        let image = sprite.provideImage(animationName, renderInstruction.wallFacingDirection, tickCount)
        image = scaleTo(image, convertedDimensions[0], convertedDimensions[1]);
        const pattern = ctx.createPattern(image, "no-repeat")

        if (self.DOMMatrix && pattern) {
            const matrix = new DOMMatrix();
            matrix.translateSelf(...topLeft)
            pattern.setTransform(matrix)
        }
        return pattern

    } catch (error) {
        console.warn(error.message)
        return null
    }
}


function drawTextImage(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, textBoard: TextBoard): void {

    const { size = { x: .5, y: .5 }, offset = { x: .25, y: .25 } } = textBoard.data
    let image: HTMLCanvasElement | HTMLImageElement = textBoard.storedCanvas

    const fullWallPoints = renderInstruction.mapWallShape(Wall.defaultShape);

    const xValues = fullWallPoints.map(point => point.x);
    const yValues = fullWallPoints.map(point => point.y);

    const topLeft = convertFunction({ x: Math.min(...xValues), y: Math.min(...yValues) });

    const convertedWallDimensions = convertFunction({
        x: Math.max(...xValues) - Math.min(...xValues),
        y: Math.max(...yValues) - Math.min(...yValues),
    })

    const offsetPosition: [number, number] = [
        topLeft[0] + offset.x * convertedWallDimensions[0],
        topLeft[1] + offset.y * convertedWallDimensions[1],
    ]



    const facingDirection = renderInstruction.wallFacingDirection
    if (facingDirection == RelativeDirection.LEFT) {
        image = perspectiveSkew(image, false)
    }
    if (facingDirection == RelativeDirection.RIGHT) {
        image = perspectiveSkew(image, true)
    }

    image = scaleTo(image, convertedWallDimensions[0] * size.x, convertedWallDimensions[1] * size.y);
    ctx.drawImage(image, ...offsetPosition)

}


export { getPatternFill, drawTextImage }