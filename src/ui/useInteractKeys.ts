import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useInteractKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { activeZone, panelOpen, openPanel, closePanel } = useGameStore.getState()
      if (e.code === 'KeyE' && activeZone && !panelOpen) openPanel()
      else if (e.code === 'Escape' && panelOpen) closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
