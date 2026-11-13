import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { coverOf, imageKind, projects } from '../../content'
import { Icon } from '../Icon'

/** Cada troca de projeto usa uma transição diferente. */
const KINDS = ['slice', 'zoom', 'bars', 'glitch'] as const
const STRIPS = 6
const DELAY = 5600

const prefersReduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Vitrine interativa do hero: janela de navegador com a tela do projeto, celular, cartão de informação
 * e chips de tecnologia. Troca sozinha de projeto, inclina com o mouse e responde ao clique.
 */
export function Showcase() {
  const items = useMemo(
    () =>
      projects.map((p) => ({
        p,
        host: new URL(p.liveUrl).host,
        desktop: p.images.find((i) => imageKind(i) === 'desktop') ?? coverOf(p),
        mobile: p.images.find((i) => imageKind(i) === 'mobile'),
      })),
    [],
  )
  const [state, setState] = useState({ cur: 0, prev: -1, n: 0 })
  const [hold, setHold] = useState(false)
  const [visible, setVisible] = useState(true)
  const root = useRef<HTMLDivElement>(null)
  const paused = hold || !visible

  const go = useCallback((i: number) => setState((s) => (i === s.cur ? s : { cur: i, prev: s.cur, n: s.n + 1 })), [])
  const next = useCallback(() => setState((s) => ({ cur: (s.cur + 1) % items.length, prev: s.cur, n: s.n + 1 })), [items.length])

  useEffect(() => {
    if (paused || prefersReduced()) return
    const t = setTimeout(next, DELAY)
    return () => clearTimeout(t)
  }, [state.n, paused, next])

  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = root.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${((x - 0.5) * 16).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${((0.5 - y) * 12).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  }
  const leave = () => {
    const el = root.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
    setHold(false)
  }

  const cur = items[state.cur]
  const prev = state.prev >= 0 ? items[state.prev] : null
  const kind = KINDS[state.n % KINDS.length]

  return (
    <div
      className="showcase"
      ref={root}
      role="region"
      aria-label="Prévia dos projetos"
      data-kind={kind}
      onPointerMove={move}
      onPointerEnter={() => setHold(true)}
      onPointerLeave={leave}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      style={{ ['--accent' as string]: cur.p.color }}
    >
      <div className="sc-tilt">
        <button type="button" className="sc-frame" onClick={next} aria-label="Próximo projeto">
          <span className="sc-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span className="sc-url">{cur.host}</span>
            <b>
              {String(state.cur + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
            </b>
          </span>
          <span className="sc-screen">
            {prev && <img key={`o${state.n}`} className="sc-img out" src={prev.desktop.src} alt="" draggable={false} />}
            {kind === 'bars' ? (
              Array.from({ length: STRIPS }, (_, s) => (
                <img key={`i${state.n}-${s}`} className="sc-img in t-bars" style={{ ['--s' as string]: s }} src={cur.desktop.src} alt={s === 0 ? cur.desktop.alt : ''} aria-hidden={s === 0 ? undefined : true} draggable={false} />
              ))
            ) : (
              <img key={`i${state.n}`} className={`sc-img in t-${kind}`} src={cur.desktop.src} alt={cur.desktop.alt} draggable={false} />
            )}
            <span className="sc-glare" aria-hidden="true" />
          </span>
        </button>

        {cur.mobile && (
          <div className="sc-phone" aria-hidden="true">
            <img key={`p${state.n}`} src={cur.mobile.src} alt="" draggable={false} />
          </div>
        )}

        <div className="sc-card" key={`c${state.n}`}>
          <p className="sc-kicker">
            {cur.p.kind} · {String(state.cur + 1).padStart(2, '0')}
          </p>
          <p className="sc-title">{cur.p.title}</p>
          <p>{cur.p.tagline}</p>
          <a href={cur.p.liveUrl} target="_blank" rel="noopener noreferrer">
            Ver site <Icon name="arrow-up-right" />
          </a>
        </div>

        <ul className="sc-chips" key={`s${state.n}`} aria-hidden="true">
          {cur.p.stack.slice(0, 5).map((t, i) => (
            <li key={t} style={{ ['--i' as string]: i }}>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="sc-tabs" role="group" aria-label="Escolher projeto">
        {items.map((it, i) => (
          <button key={it.p.id} type="button" className="sc-tab" aria-pressed={i === state.cur} onClick={() => go(i)} style={{ ['--c' as string]: it.p.color }}>
            <span className="sc-tab-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="sc-tab-t">{it.p.title}</span>
            <span className="sc-tab-bar">{i === state.cur && <i key={state.n} style={{ animationPlayState: paused ? 'paused' : 'running' }} />}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
