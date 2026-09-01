import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { Sprite } from "./Sprite";
import { SpriteSheet } from "./SpriteSheet";
import { Color } from "./Color";

export const drawAsIcon = (
    sprite: Sprite,
    spriteSheetMap: Map<string, SpriteSheet>,
    canvas: HTMLCanvasElement,
    backgroundFill: CanvasFillStrokeStyles['fillStyle'] = Color.TRANSPARENT.css,
    actionName: string | undefined = Sprite.defaultFigureAnimation,
    direction = RelativeDirection.BACK,
): void => {
    const ctx = canvas.getContext("2d");
    if (!ctx) { return }
    const height = Number(canvas.getAttribute('height') || "100");
    const width = Number(canvas.getAttribute('width') || "100");
    try {

        const icon = sprite.provideImage(spriteSheetMap, actionName, direction, 0)
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(icon, 0, 0, width, height)
    } catch (err) {
        console.warn(err)
    }
}

export const clearIcon = (
    canvas: HTMLCanvasElement,
    backgroundFill?: CanvasFillStrokeStyles['fillStyle'],
): void => {
    const ctx = canvas.getContext("2d");
    if (!ctx) { return }
    const height = Number(canvas.getAttribute('height') || "100");
    const width = Number(canvas.getAttribute('width') || "100");
    ctx.clearRect(0, 0, width, height)
    if (backgroundFill) {
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(0, 0, width, height)
    }
}