import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { game } from '@/test-world/'

function App() {

  console.log(game)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  const renderSight = useCallback(() => {
    if (canvas) {
      const { playerVantage, level } = game.data;
      level.drawAsSight(canvas, playerVantage)
    }
  }, [canvas])

  const move = useCallback((direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") => {
    game.queuePlayerMovementAction({ action: 'MOVE', direction })
    game.tick();
    renderSight()
  }, [renderSight])

  const turn = useCallback((direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") => {
    game.queuePlayerMovementAction({ action: 'TURN', direction })
    game.tick();
    renderSight()
  }, [renderSight])

  useEffect(() => {
    console.log(canvas)
    game.loadImages().then(() => {
      renderSight()
    })
  }, [renderSight])

  return (
    <>
      <p>hello</p>
      <button onClick={() => { renderSight() }}>render</button>
      <button onClick={() => { move('FORWARD') }}>forward</button>
      <button onClick={() => { move('BACK') }}>back</button>
      <button onClick={() => { turn('LEFT') }}>left</button>
      <button onClick={() => { turn('RIGHT') }}>right</button>
      <canvas ref={setCanvas}></canvas>
    </>
  )
}

export default App
