import { useEffect, useRef } from 'react'
import { projects } from '../content'
import { useGameStore } from '../store/gameStore'

export function ProjectHud() {
  const phase = useGameStore((s) => s.phase)
  const activeProject = useGameStore((s) => s.activeProject)
  const focusedImage = useGameStore((s) => s.focusedImage)
  const stepImage = useGameStore((s) => s.stepImage)
  const leaveProject = useGameStore((s) => s.leaveProject)

  const backRef = useRef<HTMLButtonElement>(null)
  const project = projects.find((p) => p.id === activeProject)
  const visible = phase === 'room' && !!project

  useEffect(() => {
    if (visible) backRef.current?.focus()
  }, [visible])

  if (phase !== 'room' || !project) return null

  const count = project.images.length
  const current = focusedImage !== null ? project.images[focusedImage] : null

  return (
    <aside
      className="project-hud"
      aria-label={`Projeto ${project.title}`}
      style={{ ['--accent' as string]: project.color }}
    >
      <div className="project-card">
        <p className="muted small">{project.kind}</p>
        <h2>{project.title}</h2>
        <p className="muted">{project.tagline}</p>
        <p>{project.description}</p>
        <ul className="chips">
          {project.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="links">
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Ver site
          </a>
        </p>
      </div>
      <div className="project-controls">
        <button className="btn" aria-label="Imagem anterior" onClick={() => stepImage(-1, count)}>
          ←
        </button>
        <span aria-live="polite">{focusedImage !== null ? `${focusedImage + 1} / ${count}` : `${count} imagens`}</span>
        <button className="btn" aria-label="Próxima imagem" onClick={() => stepImage(1, count)}>
          →
        </button>
        <button ref={backRef} className="btn btn-primary" onClick={leaveProject}>
          Voltar
        </button>
      </div>
      {current && (
        <p className="project-caption" aria-live="polite">
          {current.alt}
        </p>
      )}
    </aside>
  )
}
