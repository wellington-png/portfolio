import { useState, type KeyboardEvent } from 'react'
import { projects, skillGroups } from '../../content'
import { polar, wedgeAngles, wedgePath } from '../../lib/wheel'
import { THEMES } from '../../theme/themes'
import { useThemeStore } from '../../theme/themeStore'
import { Icon } from '../Icon'

const GROUP_ICON: Record<string, string> = { frontend: 'layout', backend: 'server', tools: 'wrench' }
const usedIn = (name: string) => projects.filter((p) => p.stack.some((t) => t.toLowerCase() === name.toLowerCase()))
const SIZE = 380
const C = SIZE / 2

/** Roda de itens no estilo dos jogos de faroeste: escolha uma gaveta e veja o que há no alforje. */
export function Alforje() {
  const [active, setActive] = useState(0)
  const copy = THEMES[useThemeStore((s) => s.theme)].copy
  const n = skillGroups.length
  const group = skillGroups[active]

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setActive((a) => (a + 1) % n)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setActive((a) => (a - 1 + n) % n)
    else return
    e.preventDefault()
  }

  return (
    <div className="alforje">
      <div className="wheel" role="tablist" aria-label={copy.wheelAria} onKeyDown={onKey}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" focusable="false">
          <circle cx={C} cy={C} r={C - 4} className="wheel-rim" />
          <circle cx={C} cy={C} r={C - 9} className="wheel-orbit" />
          <circle cx={C} cy={C} r={C - 14} className="wheel-rim thin" />
          {skillGroups.map((g, i) => {
            const a = wedgeAngles(n, i)
            return <path key={g.id} d={wedgePath(C, C, 74, C - 22, a.start, a.end)} className={`wedge${i === active ? ' on' : ''}`} />
          })}
          <circle cx={C} cy={C} r={66} className="wheel-hub" />
        </svg>
        {skillGroups.map((g, i) => {
          const pos = polar(50, 50, 31, wedgeAngles(n, i).mid)
          return (
            <button
              key={g.id}
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={i === active}
              aria-controls="alforje-panel"
              tabIndex={i === active ? 0 : -1}
              className={`wheel-tab${i === active ? ' on' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setActive(i)}
            >
              <Icon name={GROUP_ICON[g.id] ?? 'box'} />
              <span>{g.label}</span>
            </button>
          )
        })}
        <div className="wheel-core" aria-hidden="true">
          <strong>{group.skills.length}</strong>
          <span>{copy.wheelUnit}</span>
        </div>
      </div>

      <div className="slots" role="tabpanel" id="alforje-panel" aria-labelledby={`tab-${group.id}`} key={group.id}>
        <h3 className="slots-title">{group.label}</h3>
        <ul className="slot-grid">
          {group.skills.map((s, j) => (
            <li key={s.name} className="slot" style={{ ['--j' as string]: j }}>
              <Icon name={s.icon} className="slot-icon" />
              <span>{s.name}</span>
              <span className="slot-used" title={usedIn(s.name).map((p) => p.title).join(', ') || 'Estudos e projetos pessoais'}>
                {usedIn(s.name).length > 0 ? (
                  usedIn(s.name).map((p) => <i key={p.id} style={{ background: p.color }} />)
                ) : (
                  <em>pessoal</em>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
