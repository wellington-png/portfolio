import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { projects, type Project, type ProjectImage } from '../../content'
import { stepTitle } from '../../fallback2d/palette'
import { Icon } from '../Icon'

interface Shot extends ProjectImage {
  project: Project
}

/** Galeria: filtro por projeto, faixa que rola e visualizador em tela cheia (setas e Esc funcionam). */
export function Gallery() {
  const all = useMemo<Shot[]>(() => projects.flatMap((p) => p.images.map((img) => ({ ...img, project: p }))), [])
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState<number | null>(null)
  const track = useRef<HTMLUListElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const list = useMemo(() => (filter === 'all' ? all : all.filter((s) => s.project.id === filter)), [all, filter])

  useEffect(() => {
    track.current?.scrollTo?.({ left: 0 })
  }, [filter])

  const close = useCallback(() => {
    setOpen(null)
    opener.current?.focus()
  }, [])
  const step = useCallback((d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length])

  useEffect(() => {
    if (open === null) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, step])

  const scroll = (dir: 1 | -1) => track.current?.scrollBy?.({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  const current = open !== null ? list[open] : null

  return (
    <div className="gallery-ui">
      <div className="g-bar">
        <div className="g-filters" role="group" aria-label="Filtrar por projeto">
          <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            Todos <b>{all.length}</b>
          </button>
          {projects.map((p) => (
            <button key={p.id} type="button" aria-pressed={filter === p.id} onClick={() => setFilter(p.id)} style={{ ['--c' as string]: p.color }}>
              <i aria-hidden="true" />
              {p.title}
            </button>
          ))}
        </div>
        <div className="g-arrows">
          <button type="button" className="btn" aria-label="Anterior" onClick={() => scroll(-1)}>
            <Icon name="arrow-left" />
          </button>
          <button type="button" className="btn" aria-label="Próxima" onClick={() => scroll(1)}>
            <Icon name="arrow-right" />
          </button>
        </div>
      </div>

      <ul className="g-track" ref={track} key={filter}>
        {list.map((s, i) => (
          <li key={s.src} style={{ ['--i' as string]: i, ['--c' as string]: s.project.color }}>
            <button
              type="button"
              className="g-card"
              aria-label={`Ampliar: ${s.alt}`}
              onClick={(e) => {
                opener.current = e.currentTarget
                setOpen(i)
              }}
            >
              <span className="g-img" style={{ aspectRatio: `${s.width} / ${s.height}` }}>
                <img src={s.src} alt="" loading="lazy" draggable={false} />
                <span className="g-zoom">
                  <Icon name="plus" />
                </span>
              </span>
              <span className="g-tag">{s.project.title}</span>
              <span className="g-cap">{stepTitle(s.alt)}</span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Visualizador de imagens" onClick={(e) => e.target === e.currentTarget && close()}>
          <button ref={closeBtn} type="button" className="lb-close" aria-label="Fechar" onClick={close}>
            <Icon name="close" />
          </button>
          <button type="button" className="lb-nav lb-prev" aria-label="Imagem anterior" onClick={() => step(-1)}>
            <Icon name="arrow-left" />
          </button>
          <figure className="lb-fig" key={current.src}>
            <img src={current.src} alt={current.alt} />
            <figcaption>
              <b style={{ ['--c' as string]: current.project.color }}>{current.project.title}</b>
              <span>{stepTitle(current.alt)}</span>
              <em>
                {String((open ?? 0) + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
              </em>
            </figcaption>
          </figure>
          <button type="button" className="lb-nav lb-next" aria-label="Próxima imagem" onClick={() => step(1)}>
            <Icon name="arrow-right" />
          </button>
        </div>
      )}
    </div>
  )
}
