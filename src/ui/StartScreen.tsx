import { profile } from '../content'
import { useGameStore } from '../store/gameStore'

export function StartScreen() {
  const setMode = useGameStore((s) => s.setMode)
  return (
    <main className="start">
      <h1 className="neon-title">{profile.name}</h1>
      <p className="muted">{profile.title}</p>
      <div className="start-actions">
        <button className="btn btn-primary" onClick={() => setMode('3d')}>
          Start
        </button>
        <button className="btn" onClick={() => setMode('2d')}>
          Versão rápida (2D)
        </button>
      </div>
      <p className="muted small">Passe o mouse nos portais · clique para entrar · Esc volta</p>
    </main>
  )
}
