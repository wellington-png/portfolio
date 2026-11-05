import { create } from 'zustand'
import { stepIndex } from '../lib/gallery'
import { lowerQuality, raiseQuality, type Quality } from '../world/quality'

export type Mode = 'menu' | '3d' | '2d'
export type Phase = 'hub' | 'entering' | 'room' | 'leaving'
export type PanelId = 'about' | 'skills' | 'contact'

interface GameState {
  mode: Mode
  notice: string | null
  quality: Quality
  phase: Phase
  activeProject: string | null
  hoveredProject: string | null
  focusedImage: number | null
  panel: PanelId | null
  visited: string[]
  setMode: (mode: Mode, notice?: string | null) => void
  setQuality: (q: Quality) => void
  lowerQuality: () => void
  raiseQuality: () => void
  hoverProject: (id: string | null) => void
  enterProject: (id: string) => void
  finishEnter: () => void
  leaveProject: () => void
  finishLeave: () => void
  focusImage: (index: number | null) => void
  stepImage: (delta: 1 | -1, count: number) => void
  openPanel: (id: PanelId) => void
  closePanel: () => void
}

export const initialGameState = {
  mode: 'menu' as Mode,
  notice: null as string | null,
  quality: 'high' as Quality,
  phase: 'hub' as Phase,
  activeProject: null as string | null,
  hoveredProject: null as string | null,
  focusedImage: null as number | null,
  panel: null as PanelId | null,
  visited: [] as string[],
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialGameState,
  setMode: (mode, notice = null) =>
    set({
      mode,
      notice,
      phase: 'hub',
      activeProject: null,
      hoveredProject: null,
      focusedImage: null,
      panel: null,
    }),
  setQuality: (quality) => set({ quality }),
  lowerQuality: () => set({ quality: lowerQuality(get().quality) }),
  raiseQuality: () => set({ quality: raiseQuality(get().quality) }),

  hoverProject: (id) => {
    if (get().phase !== 'hub') return
    set({ hoveredProject: id })
  },
  enterProject: (id) => {
    const { phase, panel, visited } = get()
    if (phase !== 'hub' || panel !== null) return
    set({
      phase: 'entering',
      activeProject: id,
      hoveredProject: null,
      focusedImage: null,
      visited: visited.includes(id) ? visited : [...visited, id],
    })
  },
  finishEnter: () => {
    if (get().phase === 'entering') set({ phase: 'room' })
  },
  leaveProject: () => {
    if (get().phase === 'room') set({ phase: 'leaving', focusedImage: null })
  },
  finishLeave: () => {
    if (get().phase === 'leaving') set({ phase: 'hub', activeProject: null })
  },
  focusImage: (index) => {
    if (get().phase === 'room') set({ focusedImage: index })
  },
  stepImage: (delta, count) => {
    const { phase, focusedImage } = get()
    if (phase !== 'room') return
    set({ focusedImage: stepIndex(focusedImage, delta, count) })
  },
  openPanel: (id) => {
    if (get().phase !== 'hub') return
    set({ panel: id, hoveredProject: null })
  },
  closePanel: () => set({ panel: null }),
}))
