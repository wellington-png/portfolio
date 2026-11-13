import { useRef, type PointerEvent } from 'react'
import { coverOf, projects, stepsOf } from '../content'
import { stepTitle } from '../fallback2d/palette'
import { useGameStore } from '../store/gameStore'
import { THEMES } from '../theme/themes'
import { useThemeStore } from '../theme/themeStore'
import { Icon } from '../ui/Icon'

/** Estante: o projeto escolhido em destaque, com prévia inclinável, e a fila de projetos embaixo. */
export function Shelf() {
  const selected = useGameStore((s) => s.selected)
  const unlocked = useGameStore((s) => s.unlocked)
  const select = useGameStore((s) => s.select)
  const openTour = useGameStore((s) => s.openTour)
  const copy = THEMES[useThemeStore((s) => s.theme)].copy
  const preview = useRef<HTMLDivElement>(null)

  const p = projects[selected]
  const steps = stepsOf(p)
  const won = (unlocked[p.id] ?? []).length

  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    const el = preview.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${((0.5 - (e.clientY - r.top) / r.height) * 10).toFixed(2)}deg`)
  }
  const flat = () => {
    preview.current?.style.setProperty('--ry', '0deg')
    preview.current?.style.setProperty('--rx', '0deg')
  }

  return (
    <main className="shelf">
      <section className="shelf-info" key={p.id}>
        <p className="shelf-kicker">
          {p.kind} · {copy.level} {selected + 1}/{projects.length}
        </p>
        <h1>{p.title}</h1>
        <p className="shelf-tag">{p.tagline}</p>
        <p className="shelf-desc">{p.description}</p>
        <ul className="chips">
          {p.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="shelf-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={openTour}>
            <Icon name="play" /> Ver o tour
          </button>
          <a className="btn btn-lg" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
            Ver site <Icon name="arrow-up-right" />
          </a>
        </div>
        <p className="shelf-trophies" aria-label={`${won} de ${steps.length} conquistas`}>
          <Icon name="trophy" /> {won}/{steps.length} conquistas
        </p>
      </section>

      <div className="shelf-preview" ref={preview} onPointerMove={tilt} onPointerLeave={flat} aria-hidden="true">
        <div className="shelf-frame" key={p.id}>
          <div className="sc-bar">
            <i />
            <i />
            <i />
            <span className="sc-url">{new URL(p.liveUrl).host}</span>
          </div>
          <img src={coverOf(p).src} alt="" draggable={false} />
          <span className="shelf-glare" />
        </div>
        <ul className="shelf-chips">
          {steps.slice(0, 3).map((s) => (
            <li key={s.image.src}>{stepTitle(s.image.alt)}</li>
          ))}
        </ul>
      </div>

      <ul className="tiles" role="listbox" aria-label="Projetos">
        {projects.map((pr, i) => {
          const seen = (unlocked[pr.id] ?? []).length
          const total = stepsOf(pr).length
          return (
            <li key={pr.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={i === selected}
                className="tile"
                data-on={i === selected || undefined}
                style={{ ['--c' as string]: pr.color }}
                onClick={() => (i === selected ? openTour() : select(i))}
                onMouseEnter={() => select(i)}
              >
                <img src={coverOf(pr).src} alt="" loading="lazy" draggable={false} />
                <span className="tile-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="tile-t">{pr.title}</span>
                <span className="tile-s">
                  <Icon name="trophy" /> {seen}/{total}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
