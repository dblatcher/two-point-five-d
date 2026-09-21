import { RelativeDirection } from "@/game-classes/RelativeDirection";
import { CSSProperties, useEffect, useState } from "react";
import { useGame } from "./GameContext";
import { clearIcon, drawAsIcon } from "@/canvas/draw-icons";


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
