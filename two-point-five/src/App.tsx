import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { game } from '@/travels-in-generica'
import { DirectionName } from './types'
import { Arrows } from './components/Arrows'
import { Intersitial } from './components/Intersitial'
import { ItemSlot } from './components/ItemSlot'
import { GameContext } from './components/GameContext'
import { SightCanvas } from './components/SightCanvas'
import { CharacterBar } from './components/CharacterBar'

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

  const move = useCallback((direction: DirectionName) => {
    gameRef.current.queuePlayerMovementAction({ action: 'MOVE', direction })
  }, [])

  const turn = useCallback((direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK") => {
    gameRef.current.queuePlayerMovementAction({ action: 'TURN', direction })
  }, [])

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
      gameRef.current.tick()
      renderSight()
      setGameData({ ...gameRef.current.data })
    }
    const interval = setInterval(runTick, 100)
    return () => {
      clearInterval(interval)
    }
  }, [renderSight])

  const getItemInHand = useCallback(() => gameRef.current.data.itemInHand, [])

  if (!ready) {
    return null
  }

  return (
    <GameContext.Provider value={{
      game: () => gameRef.current,
      gameData
    }}>
      <main>
        <CharacterBar />

        <section style={{
          display: 'grid',
          gridTemplateColumns: "500px 1fr",
        }}>
          <SightCanvas canvas={canvas} setCanvas={setCanvas} />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex',
              padding: 5
            }}>
              <ItemSlot
                itemData={gameData.itemInHand?.data}
                getItem={getItemInHand}
              />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <Arrows move={move} turn={turn} />
            </div>

          </div>
        </section>

        {gameData.intersitial && (
          <Intersitial
            intersitialData={gameData.intersitial.data}
            selectOption={(index) => gameRef.current.handleInterstitialOptionClick(index)} />
        )}
      </main>

    </GameContext.Provider>
  )
}

export default App
