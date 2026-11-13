import { useMemo, useRef } from 'react'
import { imageKind, projects, type Project } from '../content'
import { Icon } from '../ui/Icon'
import { mulberry32 } from '../lib/random'
import { THEMES } from '../theme/themes'
import { useThemeStore } from '../theme/themeStore'
import { paletteOf, stepTitle, type Palette } from './palette'
import { PALETTE_BASE } from './paletteBase'
import { useStoryScroll } from './useStoryScroll'

/** Quatro transições novas, todas dirigidas pela rolagem (--pp, de 0 a 1). */
const VARIANTS = ['carga', 'viagem', 'mosaico', 'corte'] as const
export type Variant = (typeof VARIANTS)[number]
export const variantOf = (index: number): Variant => VARIANTS[index % VARIANTS.length]

const COLS = 12
const ROWS = 7
const tileRnd = mulberry32(17)
const TILES = Array.from({ length: COLS * ROWS }, () => tileRnd())

function Overlay({ variant, project, index, prevName }: { variant: Variant; project: Project; index: number; prevName: string }) {
  const n = String(index + 1).padStart(2, '0')
  if (variant === 'carga') {
    return (
      <div className="ov ov-carga">
        <div className="ld-ui">
          <p className="ld-kicker">Carregando missão {n}</p>
          <p className="ld-name">{project.title}</p>
          <div className="ld-bar">
            <span />
          </div>
          <p className="ld-pct" />
          <p className="ld-tip">Dica: role devagar para ver cada tela.</p>
        </div>
        <i className="ld-door ld-top" />
        <i className="ld-door ld-bot" />
      </div>
    )
  }
  if (variant === 'viagem') {
    return (
      <div className="ov ov-viagem">
        <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" className="ft-map">
          <g className="ft-grid">
            {Array.from({ length: 21 }, (_, i) => (
              <path key={`v${i}`} d={`M${i * 50} 0V560`} />
            ))}
            {Array.from({ length: 12 }, (_, i) => (
              <path key={`h${i}`} d={`M0 ${i * 50}H1000`} />
            ))}
          </g>
          <g className="ft-contours">
            <ellipse cx="250" cy="380" rx="210" ry="110" />
            <ellipse cx="250" cy="380" rx="140" ry="70" />
            <ellipse cx="760" cy="170" rx="230" ry="120" />
            <ellipse cx="760" cy="170" rx="150" ry="76" />
          </g>
          <path className="ft-route-bg" d="M90 440 C 250 520 330 250 520 330 S 760 90 900 150" pathLength="1" />
          <path className="ft-route" d="M90 440 C 250 520 330 250 520 330 S 760 90 900 150" pathLength="1" />
          <circle className="ft-start" cx="90" cy="440" r="9" />
          <g className="ft-pin" transform="translate(900 150)">
            <circle className="ft-pulse" r="22" />
            <circle r="9" />
          </g>
        </svg>
        <div className="ft-hud">
          <p className="ft-kicker">Viagem rápida</p>
          <p className="ft-from">
            {prevName} <Icon name="arrow-right" /> {project.title}
          </p>
          <p className="ft-km" />
        </div>
      </div>
    )
  }
  if (variant === 'mosaico') {
    return (
      <div className="ov ov-mosaico">
        {TILES.map((k, i) => (
          <i key={i} style={{ ['--k' as string]: k.toFixed(3) }} />
        ))}
      </div>
    )
  }
  return (
    <div className="ov ov-corte">
      <div className="cut-half cut-a">
        <span>{prevName}</span>
      </div>
      <div className="cut-half cut-b">
        <span>{prevName}</span>
      </div>
      <i className="cut-line" />
    </div>
  )
}

function Portal({ project, index, prev, pal, level }: { project: Project; index: number; prev: { name: string; fundo: string }; pal: Palette; level: string }) {
  const variant = variantOf(index)
  return (
    <div
      data-portal={index}
      data-variant={variant}
      aria-hidden="true"
      className={`portal portal--${variant}`}
      style={{ ['--de' as string]: prev.fundo, ['--para' as string]: pal.acento, ['--paras' as string]: pal.suave }}
    >
      <div className="pt-stage">
        <div className="pt-para">
          <div className="pt-content">
            <span className="pt-level">
              {level} {index + 1}
            </span>
            <span className="pt-entering">Entrando em</span>
            <span className="pt-name">{project.title}</span>
            <span className="pt-kind">{project.kind}</span>
          </div>
        </div>
        <Overlay variant={variant} project={project} index={index} prevName={prev.name} />
      </div>
    </div>
  )
}

function Chapter({ project, index, pal, level }: { project: Project; index: number; pal: Palette; level: string }) {
  const desktop = project.images.filter((img) => imageKind(img) === 'desktop')
  const phone = project.images.find((img) => imageKind(img) === 'mobile')
  return (
    <article
      id={project.id}
      data-cap={index}
      className="cap"
      style={{ ['--c-acento' as string]: pal.acento, ['--c-suave' as string]: pal.suave }}
    >
      <div className="fb-wrap cap-head">
        <span className="cap-mark" aria-hidden="true">{project.title}</span>
        <p className="cap-meta">
          <span className="cap-seal">{level} {index + 1}</span>
          <span>{project.kind}</span>
        </p>
        <h2 className="cap-name">{project.title}</h2>
        <p className="cap-phrase">{project.tagline}</p>
        <p className="cap-lead">{project.description}</p>
      </div>

      <div className="fb-wrap cap-body">
        <ol className="cap-steps">
          {desktop.map((img, j) => (
            <li key={img.src} data-step={j} className="cap-step" data-ativo={j === 0 || undefined}>
              <span className="cap-n">{String(j + 1).padStart(2, '0')}</span>
              <h3>{stepTitle(img.alt)}</h3>
              <p className="muted small">
                Tela {j + 1} de {desktop.length}
              </p>
              <img className="cap-step-img" src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" />
            </li>
          ))}
        </ol>

        <div className="cap-sticky" aria-hidden="true">
          <div className="cap-stage">
            <div className="cap-block" />
            <div className="cap-screen">
              {desktop.map((img, j) => (
                <img key={img.src} src={img.src} alt="" data-step-img={j} data-ativo={j === 0 || undefined} loading="lazy" />
              ))}
            </div>
            {phone && (
              <div className="cap-phone">
                <img src={phone.src} alt="" loading="lazy" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fb-wrap">
        <div className="cap-sheet">
          <div>
            <ul className="chips">
              {project.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="muted">
              {project.kind} · {desktop.length + (phone ? 1 : 0)} telas
            </p>
          </div>
          <a className="btn btn-primary btn-lg cap-go" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Ver {project.title} ao vivo <Icon name="arrow-right" />
          </a>
        </div>
      </div>
    </article>
  )
}

export function Story() {
  const ref = useRef<HTMLElement>(null)
  const theme = useThemeStore((s) => s.theme)
  const level = THEMES[theme].copy.level
  const palettes = useMemo(() => {
    const { base, fundo, suave } = PALETTE_BASE[theme]
    return projects.map((p) => paletteOf(p.color, base, fundo, suave))
  }, [theme])
  useStoryScroll(ref, palettes)

  return (
    <section ref={ref} className="story" aria-label="Fases">
      <nav className="rail story-rail" aria-label="Projetos">
        {projects.map((p, i) => (
          <a key={p.id} href={`#${p.id}`} data-dot={i} className="rail-item" aria-label={p.title}>
            <span className="rail-label">{p.title}</span>
            <span className="rail-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="rail-tick" />
          </a>
        ))}
      </nav>
      {projects.map((p, i) => (
        <div key={p.id}>
          <Portal project={p} index={i} pal={palettes[i]} level={level} prev={i === 0 ? { name: 'Início', fundo: theme === 'gta' ? '#7a1f66' : '#bfe6ef' } : { name: projects[i - 1].title, fundo: palettes[i - 1].fundo }} />
          <Chapter project={p} index={i} pal={palettes[i]} level={level} />
        </div>
      ))}
    </section>
  )
}
