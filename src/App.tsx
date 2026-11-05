import { lazy, Suspense } from 'react'
import { Fallback2D } from './fallback2d/Fallback2D'
import { useGameStore } from './store/gameStore'
import { GameErrorBoundary } from './ui/GameErrorBoundary'
import { StartScreen } from './ui/StartScreen'

// A cena 3D e a física só são baixadas quando o jogador aperta Start.
const Game = lazy(() => import('./game/Game'))

export default function App() {
  const mode = useGameStore((s) => s.mode)
  const setMode = useGameStore((s) => s.setMode)

  if (mode === '2d') return <Fallback2D />
  if (mode === 'menu') return <StartScreen />

  return (
    <GameErrorBoundary onError={() => setMode('2d', 'Não foi possível carregar o mundo 3D. Você está vendo a versão rápida.')}>
      <Suspense fallback={<div className="loading">Carregando…</div>}>
        <Game />
      </Suspense>
    </GameErrorBoundary>
  )
}
