// import './App.css'
// import { game } from '@/duck-puzzle'
import { game } from '@/travels-in-generica'
import { GameContext } from './components/GameContext'
import { RpgGameLayout } from './components/RpgGameLayout'
import { useGameRunner } from './useGameRunner'
import { VIEWSIZE } from './constants'

function App() {

  const { ready, gameData, gameRef, setCanvas, canvas } = useGameRunner(game, VIEWSIZE)

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
