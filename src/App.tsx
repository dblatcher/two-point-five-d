// import './App.css'
import { game } from '@/duck-puzzle'
// import { game } from '@/travels-in-generica'
import { GameProvider } from './components/GameContext'
import { PuzzleGameLayout } from './components/PuzzleGameLayout'

function App() {

  return (
    <GameProvider game={game}>
      <PuzzleGameLayout />
    </GameProvider>
  )
}

export default App
