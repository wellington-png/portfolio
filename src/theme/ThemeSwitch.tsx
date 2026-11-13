import { THEMES } from './themes'
import { useThemeStore } from './themeStore'

/** Cortina que cobre a tela durante a troca de modo. */
export function ThemeWipe() {
  const switching = useThemeStore((s) => s.switching)
  if (!switching) return null
  return (
    <div className={`wipe wipe-${switching}`} aria-hidden="true">
      <i className="wipe-a" />
      <i className="wipe-b" />
      <span className="wipe-title">{THEMES[switching].copy.wipe}</span>
    </div>
  )
}
