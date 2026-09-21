import { useEffect, useRef, useState } from "react"
import { Game } from "./game-classes/Game"


export const useGameRunner = (game: Game) => {
    const gameRef = useRef(game)
    const [gameData, setGameData] = useState(gameRef.current.data)
    const [emitter] = useState(new EventTarget()) 
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (ready) {
            return
        }
        gameRef.current.loadImages().then(() => {
            setReady(true)
        })
    }, [ ready])

    useEffect(() => {
        const runTick = () => {
            if (!ready) {
                return
            }
            gameRef.current.tick()
            emitter.dispatchEvent(new Event('tick'))
            setGameData({ ...gameRef.current.data })
        }
        const interval = setInterval(runTick, 100)
        return () => {
            clearInterval(interval)
        }
    }, [ready])

    return {
        ready, gameData, gameRef, emitter
    }
}