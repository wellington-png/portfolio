import { useGameStore, type PanelId } from '../store/gameStore'

const ITEMS: { id: PanelId; label: string }[] = [
  { id: 'about', label: 'Sobre mim' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contato' },
]

export function TopMenu() {
  const phase = useGameStore((s) => s.phase)
  const openPanel = useGameStore((s) => s.openPanel)
  const setMode = useGameStore((s) => s.setMode)

  if (phase !== 'hub') return null

  return (
    <nav className="top-menu" aria-label="Menu do portfólio">
      {ITEMS.map((item) => (
        <button key={item.id} className="btn" onClick={() => openPanel(item.id)}>
          {item.label}
        </button>
      ))}
      <button className="btn" onClick={() => setMode('2d')}>
        Versão rápida
      </button>
    </nav>
  )
}
