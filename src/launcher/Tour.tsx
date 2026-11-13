import { useEffect, useMemo, useRef, useState } from 'react'
import { focusTransform, phoneOf, projects, stepsOf, type Project } from '../content'
import { stepTitle } from '../fallback2d/palette'
import { useGameStore } from '../store/gameStore'
import { Icon } from '../ui/Icon'

/** Tempo em cada região do tour automático. */
export const DWELL = 4200

/** Tour guiado: o palco dá zoom em cada parte importante da tela real, com destaque, cursor e legenda. */
export function Tour({ project }: { project: Project }) {
  const steps = useMemo(() => stepsOf(project), [project])
  const phone = phoneOf(project)
  const step = useGameStore((s) => s.step)
  const region = useGameStore((s) => s.region)
  const playing = useGameStore((s) => s.playing)
  const unlocked = useGameStore((s) => s.unlocked[project.id])
  const won = unlocked ?? []
  const { goStep, moveStep, setPlaying, togglePlaying, closeTour, openTour, moveSelection } = useGameStore.getState()
  const store = useGameStore

  const cur = steps[step]
  const focus = cur.focuses[region] ?? cur.focuses[0]
  const t = focusTransform(focus)
  const { width, height } = cur.image

  // tour automático
  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => store.getState().advance(), DWELL)
    return () => clearTimeout(id)
  }, [playing, step, region, store])

  // a tela vira conquista quando a última região dela já foi mostrada por um instante
  useEffect(() => {
    if (region !== cur.focuses.length - 1) return
    const id = setTimeout(() => store.getState().unlock(project.id, step), 1600)
    return () => clearTimeout(id)
  }, [region, step, cur.focuses.length, project.id, store])

  // aviso de conquista
  const [toast, setToast] = useState<string | null>(null)
  const seen = useRef(won.length)
  useEffect(() => {
    if (won.length > seen.current) {
      const last = won[won.length - 1]
      setToast(stepTitle(steps[last].image.alt))
      const id = setTimeout(() => setToast(null), 3800)
      seen.current = won.length
      return () => clearTimeout(id)
    }
    seen.current = won.length
  }, [won, steps])

  const finished = won.length >= steps.length && !playing
  const next = projects[(projects.indexOf(project) + 1) % projects.length]

  return (
    <section className="tour" aria-label={`Tour de ${project.title}`} style={{ ['--accent' as string]: project.color }}>
      <div className="tour-main">
        <div className="tour-frame" style={{ ['--ar' as string]: width / height }}>
          <div className="sc-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span className="sc-url">{new URL(project.liveUrl).host}</span>
            <b>
              {String(step + 1).padStart(2, '0')}/{String(steps.length).padStart(2, '0')}
            </b>
          </div>
          <div className="tour-stage" style={{ aspectRatio: `${width} / ${height}`, ['--s' as string]: t.scale }}>
            <div className="tour-canvas" style={{ transform: `translate(${t.tx}%, ${t.ty}%) scale(${t.scale})` }}>
              <img key={cur.image.src} className="tour-img" src={cur.image.src} alt={cur.image.alt} draggable={false} />
              <i className="tour-spot" style={{ left: `${focus.x}%`, top: `${focus.y}%`, width: `${focus.w}%`, height: `${focus.h}%` }} aria-hidden="true" />
              <i key={`c${step}-${region}`} className="tour-cursor" style={{ left: `${focus.x + focus.w * 0.62}%`, top: `${focus.y + focus.h * 0.55}%` }} aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="tour-caption" key={`${step}-${region}`} aria-live="polite">
          <p className="tour-kicker">
            {step + 1}.{region + 1} · {stepTitle(cur.image.alt)}
          </p>
          <h2>{focus.title}</h2>
          <p>{focus.text}</p>
        </div>

        <div className="tour-progress" aria-hidden="true">
          {cur.focuses.map((_, i) => (
            <span key={i} data-state={i < region ? 'done' : i === region ? 'now' : undefined}>
              {i === region && <i key={`${step}-${region}`} style={{ animationPlayState: playing ? 'running' : 'paused' }} />}
            </span>
          ))}
        </div>
      </div>

      <aside className="tour-side">
        <button type="button" className="tour-back" onClick={closeTour}>
          <Icon name="arrow-left" /> Biblioteca
        </button>
        <h1>{project.title}</h1>
        <p className="muted">{project.tagline}</p>

        <ol className="tour-steps" aria-label="Telas do tour">
          {steps.map((s, i) => (
            <li key={s.image.src}>
              <button type="button" aria-current={i === step || undefined} data-won={won.includes(i) || undefined} onClick={() => goStep(i)}>
                <span className="ts-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ts-t">{stepTitle(s.image.alt)}</span>
                <Icon name="trophy" />
              </button>
            </li>
          ))}
        </ol>

        <div className="tour-controls">
          <button type="button" className="btn" aria-label="Tela anterior" onClick={() => moveStep(-1)}>
            <Icon name="arrow-left" />
          </button>
          <button type="button" className="btn btn-primary" onClick={togglePlaying} aria-label={playing ? 'Pausar o tour' : 'Continuar o tour'}>
            <Icon name={playing ? 'pause' : 'play'} /> {playing ? 'Pausar' : 'Continuar'}
          </button>
          <button type="button" className="btn" aria-label="Próxima tela" onClick={() => moveStep(1)}>
            <Icon name="arrow-right" />
          </button>
        </div>

        <div className="tour-extra">
          {phone && (
            <div className="tour-phone" aria-hidden="true">
              <img src={phone.src} alt="" loading="lazy" />
            </div>
          )}
          <div>
            <ul className="chips">
              {project.stack.slice(0, 5).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <a className="btn" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Ver site <Icon name="arrow-up-right" />
            </a>
          </div>
        </div>
      </aside>

      {toast && (
        <div className="achv" role="status" key={toast}>
          <Icon name="trophy" />
          <span>
            <em>Conquista desbloqueada</em>
            {toast}
          </span>
        </div>
      )}

      {finished && (
        <div className="tour-done" role="dialog" aria-label="Tour concluído">
          <div>
            <Icon name="trophy" className="done-icon" />
            <p className="tour-kicker">Missão completa</p>
            <h2>{project.title}: {won.length}/{steps.length} conquistas</h2>
            <p>Você viu todas as telas do tour. Quer rever ou ir para o próximo projeto?</p>
            <div className="done-actions">
              <button type="button" className="btn" onClick={() => { setPlaying(true); goStep(0) }}>
                Rever
              </button>
              <button type="button" className="btn" onClick={closeTour}>
                Biblioteca
              </button>
              <button type="button" className="btn btn-primary" onClick={() => { moveSelection(1); openTour() }}>
                Próximo: {next.title} <Icon name="arrow-right" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
