import { useCallback, useEffect, useRef, useState } from "react"
import { Game } from "./game-classes/Game"


export const useGameRunner = (game: Game) => {
    const gameRef = useRef(game)
    const [gameData, setGameData] = useState(gameRef.current.data)
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
    const [ready, setReady] = useState(false)

    const renderSight = useCallback(() => {
        if (canvas) {
            gameRef.current.renderSight(canvas)
        }
    }, [canvas])

    useEffect(() => {
        if (ready) {
            return
        }
        gameRef.current.loadImages().then(() => {
            setReady(true)
            renderSight()
        })
    }, [renderSight, ready])

    useEffect(() => {
        const runTick = () => {
            if (!ready) {
                return
            }
            gameRef.current.tick()
            renderSight()
            setGameData({ ...gameRef.current.data })
        }
        const interval = setInterval(runTick, 100)
        return () => {
            clearInterval(interval)
        }
    }, [renderSight, ready])

    return {
        ready, canvas, setCanvas, gameData, gameRef
    }
}