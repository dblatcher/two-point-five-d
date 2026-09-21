// import './App.css'
import { game } from '@/duck-puzzle'
// import { game } from '@/travels-in-generica'
import { GameProvider } from './components/GameContext'
import { RpgGameLayout } from './components/RpgGameLayout'

function App() {

  return (
    <GameProvider game={game}>
      <RpgGameLayout />
    </GameProvider>
  )
}

export default App
