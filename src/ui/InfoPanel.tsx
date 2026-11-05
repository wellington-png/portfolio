import { useEffect, useRef } from 'react'
import { useGameStore, type PanelId } from '../store/gameStore'
import { ContactSection, ProfileSection, SkillsSection } from './sections'

const TITLES: Record<PanelId, string> = { about: 'Sobre mim', skills: 'Skills', contact: 'Contato' }

export function InfoPanel() {
  const panel = useGameStore((s) => s.panel)
  const closePanel = useGameStore((s) => s.closePanel)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (panel) closeRef.current?.focus()
  }, [panel])

  if (!panel) return null

  return (
    <div
      className="panel-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePanel()
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={TITLES[panel]} className="panel">
        <button ref={closeRef} className="panel-close" aria-label="Fechar" onClick={closePanel}>
          ✕
        </button>
        {panel === 'about' && <ProfileSection />}
        {panel === 'skills' && <SkillsSection />}
        {panel === 'contact' && <ContactSection />}
      </div>
    </div>
  )
}
