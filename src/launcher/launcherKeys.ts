import { useEffect } from 'react'
import { projects } from '../content'
import { useGameStore, type PanelId } from '../store/gameStore'

const PANEL_ORDER: PanelId[] = ['about', 'skills', 'contact']

/**
 * Comando do launcher, vindo do teclado ou do controle. Devolve true se tratou a tecla.
 * Estante: ← → escolhem, Enter abre o tour, 1-9 vão direto. Tour: ← → trocam de tela, ↑ ↓ de região, Espaço pausa.
 * Em qualquer lugar: A, S e C abrem os painéis; Esc volta um nível.
 */
export function handleKey(code: string): boolean {
  const s = useGameStore.getState()

  if (code === 'Escape') {
    if (s.panel) s.closePanel()
    else if (s.view === 'tour') s.closeTour()
    else s.setMode('menu')
    return true
  }
  if (s.panel) {
    if (code === 'ArrowRight' || code === 'ArrowLeft') {
      const i = PANEL_ORDER.indexOf(s.panel)
      s.openPanel(PANEL_ORDER[(i + (code === 'ArrowRight' ? 1 : -1) + PANEL_ORDER.length) % PANEL_ORDER.length])
      return true
    }
    return false
  }

  if (code === 'KeyA') return s.openPanel('about'), true
  if (code === 'KeyS') return s.openPanel('skills'), true
  if (code === 'KeyC') return s.openPanel('contact'), true

  if (s.view === 'shelf') {
    if (code === 'ArrowRight') return s.moveSelection(1), true
    if (code === 'ArrowLeft') return s.moveSelection(-1), true
    if (code === 'Enter' || code === 'Space') return s.openTour(), true
    const digit = /^Digit([1-9])$/.exec(code)
    if (digit && projects[Number(digit[1]) - 1]) return s.select(Number(digit[1]) - 1), true
    return false
  }

  if (code === 'ArrowRight') return s.moveStep(1), true
  if (code === 'ArrowLeft') return s.moveStep(-1), true
  if (code === 'ArrowDown') return s.moveRegion(1), true
  if (code === 'ArrowUp') return s.moveRegion(-1), true
  if (code === 'Space' || code === 'Enter') return s.togglePlaying(), true
  return false
}

const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
const isButton = (t: EventTarget | null) => t instanceof HTMLElement && /^(BUTTON|A)$/.test(t.tagName)

export function useLauncherKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return
      // Enter e Espaço em um botão focado ativam o botão, não o comando
      if ((e.code === 'Enter' || e.code === 'Space') && isButton(e.target)) return
      if (handleKey(e.code)) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

/** Controle (Gamepad API): direcional ou analógico esquerdo, A confirma, B volta, Start pausa. */
export function useGamepad() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') return
    let raf = 0
    const held = new Set<string>()
    const tick = () => {
      const pad = [...(navigator.getGamepads() ?? [])].find(Boolean)
      if (pad) {
        const axis = (i: number) => pad.axes[i] ?? 0
        const now: Record<string, boolean> = {
          ArrowLeft: !!pad.buttons[14]?.pressed || axis(0) < -0.6,
          ArrowRight: !!pad.buttons[15]?.pressed || axis(0) > 0.6,
          ArrowUp: !!pad.buttons[12]?.pressed || axis(1) < -0.6,
          ArrowDown: !!pad.buttons[13]?.pressed || axis(1) > 0.6,
          Enter: !!pad.buttons[0]?.pressed,
          Escape: !!pad.buttons[1]?.pressed,
          Space: !!pad.buttons[9]?.pressed,
        }
        for (const [code, on] of Object.entries(now)) {
          if (on && !held.has(code)) {
            held.add(code)
            handleKey(code)
          } else if (!on) held.delete(code)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
}
