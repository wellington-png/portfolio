import { coverOf, projects } from '../content'
import { useGameStore } from '../store/gameStore'
import { InfoPanel } from '../ui/InfoPanel'
import { TopMenu } from '../ui/TopMenu'
import { Shelf } from './Shelf'
import { Tour } from './Tour'
import { useGamepad, useLauncherKeys } from './launcherKeys'
import '../ui/overlay.css'
import './launcher.css'

/** Modo jogo: um launcher de console. Estante de projetos, tour guiado pelas telas reais e conquistas. */
export function Launcher() {
  const view = useGameStore((s) => s.view)
  const selected = useGameStore((s) => s.selected)
  const project = projects[selected]
  useLauncherKeys()
  useGamepad()

  return (
    <div className="lnc" data-view={view} style={{ ['--accent' as string]: project.color }}>
      <div className="lnc-bg" aria-hidden="true">
        {projects.map((p, i) => (
          <img key={p.id} src={coverOf(p).src} alt="" data-on={i === selected || undefined} draggable={false} />
        ))}
        <span className="lnc-shade" />
      </div>

      <TopMenu />
      {view === 'shelf' ? <Shelf /> : <Tour key={project.id} project={project} />}

      <p className="lnc-hints" aria-hidden="true">
        {view === 'shelf' ? (
          <>
            <kbd>←</kbd>
            <kbd>→</kbd> escolher <kbd>Enter</kbd> abrir o tour <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>C</kbd> painéis <kbd>Esc</kbd> voltar
          </>
        ) : (
          <>
            <kbd>←</kbd>
            <kbd>→</kbd> telas <kbd>↑</kbd>
            <kbd>↓</kbd> detalhes <kbd>Espaço</kbd> pausar <kbd>Esc</kbd> biblioteca
          </>
        )}
      </p>
      <InfoPanel />
    </div>
  )
}
