// import './App.css'
import { game } from '@/travels-in-generica'
import { GameContext } from './components/GameContext'
import { RpgGameLayout } from './components/RpgGameLayout'
import { useGameRunner } from './useGameRunner'

function App() {

  const { ready, gameData, gameRef, setCanvas, canvas } = useGameRunner(game)

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
