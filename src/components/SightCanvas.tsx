import { VIEWSIZE } from "@/constants";
import { useCallback, useState } from "react";
import { useGame, useGameTick } from "./GameContext";
import { Game } from "@/game-classes/Game";

interface Props {
    viewSize?: number
    getPOV?: { (game: Game, canvas: HTMLCanvasElement, viewSize: number): void }
}

export const SightCanvas = ({ viewSize = VIEWSIZE, getPOV }: Props) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const { game } = useGame()
    const renderSight = useCallback(() => {
        if (canvas) {
            if (getPOV) {
                getPOV(game(), canvas, viewSize)
            } else {
                game().renderSight(canvas, viewSize)
            }
        }
    }, [canvas, game, getPOV])
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