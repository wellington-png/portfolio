import { useEffect } from 'react'
import { inputState } from './input'

const GAME_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space',
])

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

export function useKeyboardInput() {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return
      if (e.code === 'KeyR') inputState.resetRequested = true
      if (GAME_KEYS.has(e.code)) {
        inputState.keys.add(e.code)
        e.preventDefault()
      }
    }
    const up = (e: KeyboardEvent) => {
      inputState.keys.delete(e.code)
    }
    const clear = () => inputState.keys.clear()

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
      inputState.keys.clear()
    }
  }, [])
}
