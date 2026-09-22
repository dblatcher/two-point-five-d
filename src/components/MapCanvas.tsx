import { CSSProperties, useEffect, useState } from "react"
import { useGame } from "./GameContext"

interface Props {
    style?: CSSProperties
}


export const MapCanvas = ({ style }: Props) => {
    const { gameData, game } = useGame()
    const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!mapCanvas) {
            return
        }
        const gameInstance = game();
        gameInstance.currentLevel.drawAsMap(mapCanvas, gameData.playerVantage, 25)
    }, [mapCanvas, gameData])

    return <canvas ref={setMapCanvas} style={style}></canvas>

}