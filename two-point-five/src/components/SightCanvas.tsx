import { VIEWSIZE } from "@/constants";
import { useCallback, useState } from "react";
import { useGame, useGameTick } from "./GameContext";

interface Props {
    viewSize?: number
}

export const SightCanvas = ({ viewSize = VIEWSIZE }: Props) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const { game } = useGame()
    const renderSight = useCallback(() => {
        if (canvas) {
            game().renderSight(canvas, viewSize)
        }
    }, [canvas, game])
    useGameTick(renderSight)

    return (
        <canvas
            style={{
                maxWidth: viewSize
            }}
            ref={setCanvas}
            onClick={(event) => {
                if (!canvas) { return }
                const rect = canvas.getBoundingClientRect();
                game().handleSightClick({
                    x: (event.clientX - rect.left) / rect.width,
                    y: (event.clientY - rect.top) / rect.height,
                })
            }}></canvas>
    )

}