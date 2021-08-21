import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { Sprite } from "@/canvas/Sprite";
import { Wall } from "@/game-classes/Wall";
import { ConvertFunction, Point } from "./canvas-utility";
import { perspectiveSkew, resizeFrame, scaleTo } from "./manipulations";
import { RenderInstruction } from "./RenderInstruction";
import { TextBoard } from "./TextBoard";


function getPatternFill(
    ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction,
    tickCount: number,
    sprite: Sprite, animationName: string, fullWallPoints: Point[],
    transitionPhase?:number,
    repeat?:string
): CanvasPattern | null {

    const { topLeft, convertedWallDimensions } = getMeasurements(fullWallPoints, convertFunction);

    let image: CanvasImageSource;
    try {
        image = sprite.provideImage(animationName, renderInstruction.wallFacingDirection, tickCount, transitionPhase)
    } catch (error) {
        console.warn(error.message)
        return null
    }

    return convertToPattern(image, convertedWallDimensions, topLeft, ctx, repeat)
}

function getTextPatternFill(
    ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction,
    textBoard: TextBoard
): CanvasPattern | null {

    const fullWallPoints = renderInstruction.mapWallShape(Wall.defaultShape);
    const { topLeft, convertedWallDimensions } = getMeasurements(fullWallPoints, convertFunction);

    let image: HTMLCanvasElement | HTMLImageElement = textBoard.storedCanvas
    const { size = Sprite.DEFAULT_SIZE } = textBoard.data
    image = resizeFrame(image, size)
    const facingDirection = renderInstruction.wallFacingDirection
    if (facingDirection == RelativeDirection.LEFT) {
        image = perspectiveSkew(image, size, false)
    }
    if (facingDirection == RelativeDirection.RIGHT) {
        image = perspectiveSkew(image, size, true)
    }

    return convertToPattern(image, convertedWallDimensions, topLeft, ctx)
}


function getMeasurements(fullWallPoints: Point[], convertFunction: ConvertFunction): {
    topLeft: [number, number], convertedWallDimensions: [number, number]
} {
    const xValues = fullWallPoints.map(point => point.x);
    const yValues = fullWallPoints.map(point => point.y);

    const topLeft = convertFunction({ x: Math.min(...xValues), y: Math.min(...yValues) });

    const convertedWallDimensions = convertFunction({
        x: Math.max(...xValues) - Math.min(...xValues),
        y: Math.max(...yValues) - Math.min(...yValues),
    })

    return { topLeft, convertedWallDimensions }
}

function convertToPattern(
    image: CanvasImageSource,
    convertedWallDimensions: [number, number],
    topLeft: [number, number],
    ctx: CanvasRenderingContext2D,
    repeat?: string
): CanvasPattern | null {
    image = scaleTo(image, convertedWallDimensions[0], convertedWallDimensions[1]);
    const pattern = ctx.createPattern(image, repeat || "no-repeat")

    if (self.DOMMatrix && pattern) {
        const matrix = new DOMMatrix();
        matrix.translateSelf(...topLeft)
        pattern.setTransform(matrix)
    }
    return pattern
}


function drawTextImage(ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction, textBoard: TextBoard): void {

    const { size = Sprite.DEFAULT_SIZE, offset = { x: .25, y: .25 } } = textBoard.data
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
        image = perspectiveSkew(image, size, false)
    }
    if (facingDirection == RelativeDirection.RIGHT) {
        image = perspectiveSkew(image, size, true)
    }

    image = scaleTo(image, convertedWallDimensions[0] * size.x, convertedWallDimensions[1] * size.y);
    ctx.drawImage(image, ...offsetPosition)

}


export { getPatternFill, drawTextImage, getTextPatternFill }