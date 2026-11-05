import { create } from 'zustand'
import { lowerQuality, raiseQuality, type Quality } from '../world/quality'

export type Mode = 'menu' | '3d' | '2d'

interface GameState {
  mode: Mode
  notice: string | null
  quality: Quality
  activeZone: string | null
  panelOpen: boolean
  visited: string[]
  setMode: (mode: Mode, notice?: string | null) => void
  setQuality: (q: Quality) => void
  lowerQuality: () => void
  raiseQuality: () => void
  enterZone: (id: string) => void
  leaveZone: (id: string) => void
  openPanel: () => void
  closePanel: () => void
}

export const initialGameState = {
  mode: 'menu' as Mode,
  notice: null as string | null,
  quality: 'high' as Quality,
  activeZone: null as string | null,
  panelOpen: false,
  visited: [] as string[],
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialGameState,
  setMode: (mode, notice = null) => set({ mode, notice, activeZone: null, panelOpen: false }),
  setQuality: (quality) => set({ quality }),
  lowerQuality: () => set({ quality: lowerQuality(get().quality) }),
  raiseQuality: () => set({ quality: raiseQuality(get().quality) }),
  enterZone: (id) => set({ activeZone: id }),
  leaveZone: (id) => {
    if (get().activeZone === id) set({ activeZone: null, panelOpen: false })
  },
  openPanel: () => {
    const { activeZone, visited } = get()
    if (!activeZone) return
    set({
      panelOpen: true,
      visited: visited.includes(activeZone) ? visited : [...visited, activeZone],
    })
  },
  closePanel: () => set({ panelOpen: false }),
}))
