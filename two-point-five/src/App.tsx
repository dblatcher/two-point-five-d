// import './App.css'
// import { game } from '@/duck-puzzle'
import { game } from '@/travels-in-generica'
import { GameContext } from './components/GameContext'
import { RpgGameLayout } from './components/RpgGameLayout'
import { useGameRunner } from './useGameRunner'

function App() {
  const { ready, gameData, gameRef, emitter } = useGameRunner(game)
  if (!ready) {
    return null
  }

  return (
    <GameContext.Provider value={{
      game: () => gameRef.current,
      gameData,
      emitter
    }}>
      <RpgGameLayout />
    </GameContext.Provider>
  )
}

export default App
