import { useCallback, useEffect, useRef, useState } from 'react'
// import './App.css'
import { game } from '@/travels-in-generica'
import { GameContext } from './components/GameContext'
import { RpgGameLayout } from './components/RpgGameLayout'

function App() {

  const gameRef = useRef(game)
  const [gameData, setGameData] = useState(gameRef.current.data)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [ready, setReady] = useState(false)

  const renderSight = useCallback(() => {
    if (canvas) {
      const { playerVantage, level } = gameRef.current.data;
      level.drawAsSight(canvas, playerVantage)
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


  if (!ready) {
    return null
  }

  return (
    <GameContext.Provider value={{
      game: () => gameRef.current,
      gameData
    }}>
      <RpgGameLayout canvas={canvas} setCanvas={setCanvas} />
    </GameContext.Provider>
  )
}

export default App
