import { useState } from 'react'
import { coverOf, imageKind, projects } from '../content'
import { Icon } from '../ui/Icon'
import { THEMES } from '../theme/themes'
import { useThemeStore } from '../theme/themeStore'
import { paletteOf } from './palette'
import { PALETTE_BASE } from './paletteBase'

/** Lista de fases à esquerda; o palco à direita troca de imagem e de cor junto. */
export function Vitrine() {
  const [active, setActive] = useState(0)
  const current = projects[active]
  const theme = useThemeStore((s) => s.theme)
  const { base, fundo, suave } = PALETTE_BASE[theme]
  const pal = paletteOf(current.color, base, fundo, suave)

  return (
    <section
      className="vitrine"
      aria-labelledby="vit-title"
      style={{ ['--v-acento' as string]: pal.acento, ['--v-fundo' as string]: pal.fundo, ['--v-suave' as string]: pal.suave }}
    >
      <div className="fb-wrap vit-grid">
        <div>
          <h2 id="vit-title" className="vit-heading">{THEMES[theme].copy.selectTitle}</h2>
          <ol className="vit-list">
            {projects.map((p, i) => (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  className="vit-item"
                  data-ativo={i === active || undefined}
                  style={{ ['--c' as string]: p.color }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-label={`Ver a fase ${i + 1}: ${p.title}`}
                >
                  <span className="vit-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="vit-name">{p.title}</span>
                  <span className="vit-kind">{p.kind}</span>
                  <Icon name="arrow-right" className="vit-arrow" />
                  <span className="vit-inline">
                    <img src={coverOf(p).src} alt="" loading="lazy" />
                    <span>{p.tagline}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="vit-stage" aria-hidden="true">
          <div className="vit-block" />
          <div className="vit-screen">
            {projects.map((p, i) => {
              const cover = p.images.find((img) => imageKind(img) === 'desktop') ?? coverOf(p)
              return <img key={p.id} src={cover.src} alt="" data-ativo={i === active || undefined} />
            })}
          </div>
          <div className="vit-card">
            <p>{current.description}</p>
            <ul className="chips">
              {current.stack.slice(0, 5).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
