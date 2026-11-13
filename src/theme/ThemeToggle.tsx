import { useThemeStore } from './themeStore'
import { GAME_THEMES, THEMES, type ThemeId } from './themes'

/** Seletor de modo sempre visível: a peça desliza para o escolhido. */
export function ThemeToggle({ ids = GAME_THEMES, className = '' }: { ids?: ThemeId[]; className?: string }) {
  const theme = useThemeStore((s) => s.theme)
  const switching = useThemeStore((s) => s.switching)
  const switchTheme = useThemeStore((s) => s.switchTheme)
  const index = Math.max(ids.indexOf(theme), 0)
  return (
    <div className={`theme-toggle ${className}`.trim()} role="group" aria-label="Modo visual" data-active={theme} style={{ ['--n' as string]: ids.length, ['--i' as string]: index }}>
      <span className="tt-thumb" aria-hidden="true" />
      {ids.map((id) => (
        <button key={id} type="button" className={`tt-opt tt-${id}`} aria-pressed={theme === id} disabled={switching !== null} onClick={() => switchTheme(id)}>
          <i aria-hidden="true" />
          {THEMES[id].copy.mode}
        </button>
      ))}
    </div>
  )
}
