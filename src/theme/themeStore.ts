import { create } from 'zustand'
import { otherTheme, type ThemeId } from './themes'

const KEY = 'portfolio-theme'
const DEFAULT: ThemeId = 'rdr'

function readSaved(): ThemeId {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'gta' || v === 'rdr' || v === 'clean' ? v : DEFAULT
  } catch {
    return DEFAULT
  }
}

function persist(theme: ThemeId) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* modo privado: segue sem salvar */
  }
}

function apply(theme: ThemeId) {
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme
}

interface ThemeState {
  theme: ThemeId
  /** tema de destino enquanto a transição está na tela */
  switching: ThemeId | null
  setTheme: (t: ThemeId) => void
  /** Troca de tema com a cortina de transição (ou na hora, se o movimento estiver reduzido). */
  switchTheme: (target?: ThemeId) => void
}

const WIPE_MS = { swap: 520, end: 1150 }

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: readSaved(),
  switching: null,
  setTheme: (theme) => {
    persist(theme)
    apply(theme)
    set({ theme })
  },
  switchTheme: (to) => {
    const { theme, switching, setTheme } = get()
    if (switching) return
    const target = to ?? otherTheme(theme)
    if (target === theme) return
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTheme(target)
      return
    }
    set({ switching: target })
    setTimeout(() => setTheme(target), WIPE_MS.swap)
    setTimeout(() => set({ switching: null }), WIPE_MS.end)
  },
}))

apply(useThemeStore.getState().theme)

/** Só para testes: volta ao tema padrão sem tocar no armazenamento. */
export function resetThemeForTests() {
  useThemeStore.setState({ theme: DEFAULT, switching: null })
  apply(DEFAULT)
}
