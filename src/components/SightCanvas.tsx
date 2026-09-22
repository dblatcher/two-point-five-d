import { VIEWSIZE } from "@/constants";
import { CSSProperties, useCallback, useState } from "react";
import { useGame, useGameTick } from "./GameContext";
import { Game } from "@/game-classes/Game";
import { Vantage } from "@/game-classes/Vantage";

interface Props {
    viewSize?: number
    getPOV?: { (game: Game): Vantage }
    style?: CSSProperties
}

export const SightCanvas = ({ viewSize = VIEWSIZE, getPOV, style = {} }: Props) => {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const { game } = useGame()
    const renderSight = useCallback(() => {
        if (canvas) {
            if (getPOV) {
                const vantage = getPOV(game())
                game().renderPov(vantage, canvas, viewSize)
            } else {
                game().renderSight(canvas, viewSize)
            }
        }
    }, [canvas, game, getPOV])

    useGameTick(renderSight)

    return (
        <canvas
            style={{
                ...style,
                maxWidth: viewSize,
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