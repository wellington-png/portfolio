import { create } from 'zustand'
import { projects, stepsOf } from '../content'

export type Mode = 'menu' | 'play' | '2d'
export type PanelId = 'about' | 'skills' | 'contact'
export type View = 'shelf' | 'tour'

interface GameState {
  mode: Mode
  notice: string | null
  panel: PanelId | null
  /** projeto escolhido na estante */
  selected: number
  view: View
  /** tela e região em exibição no tour */
  step: number
  region: number
  playing: boolean
  /** telas já vistas por inteiro, por projeto (conquistas) */
  unlocked: Record<string, number[]>
  setMode: (mode: Mode, notice?: string | null) => void
  select: (index: number) => void
  moveSelection: (delta: 1 | -1) => void
  openTour: () => void
  closeTour: () => void
  goStep: (index: number) => void
  moveStep: (delta: 1 | -1) => void
  moveRegion: (delta: 1 | -1) => void
  /** Passa para a próxima região (ou tela); no fim, para o tour automático. */
  advance: () => void
  setPlaying: (playing: boolean) => void
  togglePlaying: () => void
  unlock: (projectId: string, step: number) => void
  openPanel: (id: PanelId) => void
  closePanel: () => void
}

export const initialGameState = {
  mode: 'menu' as Mode,
  notice: null as string | null,
  panel: null as PanelId | null,
  selected: 0,
  view: 'shelf' as View,
  step: 0,
  region: 0,
  playing: true,
  unlocked: {} as Record<string, number[]>,
}

const wrap = (i: number, n: number) => ((i % n) + n) % n

export const useGameStore = create<GameState>((set, get) => ({
  ...initialGameState,
  setMode: (mode, notice = null) => set({ mode, notice, panel: null, view: 'shelf', step: 0, region: 0, playing: true }),

  select: (index) => set({ selected: wrap(index, projects.length) }),
  moveSelection: (delta) => set({ selected: wrap(get().selected + delta, projects.length) }),

  openTour: () => set({ view: 'tour', step: 0, region: 0, playing: true }),
  closeTour: () => set({ view: 'shelf', step: 0, region: 0, playing: true }),

  goStep: (index) => {
    const steps = stepsOf(projects[get().selected])
    set({ step: Math.min(Math.max(index, 0), steps.length - 1), region: 0 })
  },
  moveStep: (delta) => get().goStep(get().step + delta),
  moveRegion: (delta) => {
    const { selected, step, region } = get()
    const count = stepsOf(projects[selected])[step]?.focuses.length ?? 1
    set({ region: Math.min(Math.max(region + delta, 0), count - 1) })
  },
  advance: () => {
    const { selected, step, region } = get()
    const steps = stepsOf(projects[selected])
    const count = steps[step]?.focuses.length ?? 1
    if (region < count - 1) set({ region: region + 1 })
    else if (step < steps.length - 1) set({ step: step + 1, region: 0 })
    else set({ playing: false })
  },
  setPlaying: (playing) => set({ playing }),
  togglePlaying: () => set({ playing: !get().playing }),

  unlock: (projectId, step) => {
    const seen = get().unlocked[projectId] ?? []
    if (seen.includes(step)) return
    set({ unlocked: { ...get().unlocked, [projectId]: [...seen, step] } })
  },

  openPanel: (id) => set({ panel: id }),
  closePanel: () => set({ panel: null }),
}))
