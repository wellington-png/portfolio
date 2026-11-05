import { useEffect } from 'react'
import { projects } from '../content'
import { useGameStore } from '../store/gameStore'

export function useGameKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useGameStore.getState()

      if (e.code === 'Escape') {
        if (s.panel) s.closePanel()
        else if (s.focusedImage !== null) s.focusImage(null)
        else if (s.phase === 'room') s.leaveProject()
        return
      }

      if (s.phase !== 'room') return
      const project = projects.find((p) => p.id === s.activeProject)
      if (!project) return
      if (e.code === 'ArrowRight') {
        e.preventDefault()
        s.stepImage(1, project.images.length)
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        s.stepImage(-1, project.images.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
