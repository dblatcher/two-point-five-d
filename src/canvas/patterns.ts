import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { Sprite } from "@/game-classes/Sprite";
import { ConvertFunction, Point } from "./canvas-utility";
import { scaleTo } from "./manipulations";
import { RenderInstruction } from "./RenderInstruction";

// to do - get facingDirection from the renderInstruction, remove it as an argument
function getPatternFill(
    ctx: CanvasRenderingContext2D, convertFunction: ConvertFunction, renderInstruction: RenderInstruction,
    tickCount: number, 
    sprite: Sprite, animationName: string, fullWallPoints: Point[]
): CanvasPattern | null {

    const { place, relativeDirection = RelativeDirection.BACK } = renderInstruction
    const facingDirection = getWallFacingDirection(place.right, relativeDirection)
    const xValues = fullWallPoints.map(point => point.x);
    const yValues = fullWallPoints.map(point => point.y);

    const topLeft = convertFunction({ x: Math.min(...xValues), y: Math.min(...yValues) })

    const convertedDimensions = convertFunction({
        x: Math.max(...xValues) - Math.min(...xValues),
        y: Math.max(...yValues) - Math.min(...yValues),
    })

    try {
        let image = sprite.provideImage(animationName, facingDirection, tickCount)
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

function getWallFacingDirection(gridRight: number, relativeDirection: RelativeDirection = RelativeDirection.BACK): RelativeDirection {
    return relativeDirection.name == "BACK" || relativeDirection.name == "FORWARD"
        ? RelativeDirection.FORWARD
        : gridRight > 0
            ? RelativeDirection.RIGHT
            : gridRight < 0
                ? RelativeDirection.LEFT
                : relativeDirection;
}

export { getPatternFill, getWallFacingDirection }