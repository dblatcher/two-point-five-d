import { Color } from "@/canvas/Color";
import { Sprite } from "@/canvas/Sprite";
import { SpriteSheet } from "@/canvas/SpriteSheet";
import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { CSSProperties, useEffect, useState } from "react";
import { useGame } from "./GameContext";


interface Props {
    spriteId?: string;
    backgroundFill?: CanvasFillStrokeStyles['fillStyle'];
    size?: number;
    style?: CSSProperties;
    actionName?: string;
    direction?: RelativeDirection;
}

const styles = {
    frame: {
        display: 'inline-flex',
        aspectRatio: 1,
    }
} satisfies Record<string, CSSProperties>

const drawAsIcon = (
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

const clearIcon = (
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

export const SpriteIcon = ({
    spriteId,
    backgroundFill,
    actionName,
    direction,
    size = 50,
    style
}: Props) => {
    const { game } = useGame()
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    useEffect(() => {
        if (!canvas) {
            return
        }
        if (!spriteId) {
            return clearIcon(canvas, backgroundFill)
        }
        const { spriteRecord, spriteSheetMap } = game()
        const sprite = spriteRecord[spriteId];
        if (!sprite) {
            return clearIcon(canvas, backgroundFill)
        }

        drawAsIcon(sprite, spriteSheetMap, canvas, backgroundFill, actionName, direction)

    }, [spriteId, backgroundFill, actionName, direction, canvas])

    return <div title={spriteId} style={style ?? styles.frame}>
        <canvas
            height={size} width={size}
            style={{ width: "100%", height: "100%" }}
            ref={setCanvas}
        ></canvas>
    </div>
}
