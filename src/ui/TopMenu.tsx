import { profile } from '../content'
import { useGameStore, type PanelId } from '../store/gameStore'
import { ThemeToggle } from '../theme/ThemeToggle'
import { Icon } from './Icon'

export const PANEL_ITEMS: { id: PanelId; label: string; icon: string; key: string }[] = [
  { id: 'about', label: 'Sobre mim', icon: 'star', key: 'A' },
  { id: 'skills', label: 'Skills', icon: 'layers', key: 'S' },
  { id: 'contact', label: 'Contato', icon: 'mail', key: 'C' },
]

/** Barra de comando do launcher: identidade, painéis com atalhos, modo visual e saída. */
export function TopMenu() {
  const panel = useGameStore((s) => s.panel)
  const openPanel = useGameStore((s) => s.openPanel)
  const setMode = useGameStore((s) => s.setMode)

  return (
    <header className="lhud">
      <button type="button" className="lhud-brand" onClick={() => setMode('menu')} aria-label="Voltar ao início">
        <img src={profile.photo} alt="" />
        <span>
          <b>{profile.name}</b>
          <em>Launcher</em>
        </span>
      </button>

      <nav className="lhud-nav" aria-label="Menu do portfólio">
        {PANEL_ITEMS.map((item) => (
          <button key={item.id} type="button" className="lhud-btn" aria-pressed={panel === item.id} aria-keyshortcuts={item.key} onClick={() => openPanel(item.id)}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
            <kbd aria-hidden="true">{item.key}</kbd>
          </button>
        ))}
      </nav>

      <div className="lhud-right">
        <ThemeToggle />
        <button type="button" className="lhud-btn lhud-ghost" onClick={() => setMode('2d')}>
          <span>Versão rápida</span>
          <Icon name="arrow-up-right" />
        </button>
      </div>
    </header>
  )
}
