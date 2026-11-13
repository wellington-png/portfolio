import { useEffect } from 'react'
import { CleanLanding } from './clean/CleanLanding'
import { Fallback2D } from './fallback2d/Fallback2D'
import { Launcher } from './launcher/Launcher'
import { useGameStore } from './store/gameStore'
import { ThemeWipe } from './theme/ThemeSwitch'
import { useThemeStore } from './theme/themeStore'
import { StartScreen } from './ui/StartScreen'

export default function App() {
  const mode = useGameStore((s) => s.mode)
  const theme = useThemeStore((s) => s.theme)
  const clean = theme === 'clean'

  // Launcher e versão 2D só existem nos temas escuros; o Clean vale só na landing.
  useEffect(() => {
    if (clean && mode !== 'menu') useThemeStore.getState().switchTheme('rdr')
  }, [clean, mode])

  return (
    <>
      {mode === '2d' && <Fallback2D />}
      {mode === 'menu' && (clean ? <CleanLanding /> : <StartScreen />)}
      {mode === 'play' && <Launcher />}
      <ThemeWipe />
    </>
  )
}
