import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { game } from '@/travels-in-generica'
import { DirectionName } from './types'
import { Arrows } from './components/Arrows'

function App() {

  const gameRef = useRef(game)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  const renderSight = useCallback(() => {
    if (canvas) {
      const { playerVantage, level } = gameRef.current.data;
      level.drawAsSight(canvas, playerVantage)
    }
  }, [canvas])

  const move = useCallback((direction: DirectionName) => {
    gameRef.current.queuePlayerMovementAction({ action: 'MOVE', direction })
    gameRef.current.tick();
    renderSight()
  }, [renderSight])

  const turn = useCallback((direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") => {
    gameRef.current.queuePlayerMovementAction({ action: 'TURN', direction })
    gameRef.current.tick();
    renderSight()
  }, [renderSight])

  useEffect(() => {
    gameRef.current.loadImages().then(() => {
      renderSight()
    })
  }, [renderSight])

  return (
    <>
      <canvas ref={setCanvas}></canvas>
      <Arrows move={move} turn={turn} />
    </>
  )
}

export default App
