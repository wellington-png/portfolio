import { useEffect, useRef, type KeyboardEvent } from 'react'
import { useGameStore, type PanelId } from '../store/gameStore'
import { ContactSection, ProfileSection, SkillsSection } from './sections'

const TITLES: Record<PanelId, string> = { about: 'Sobre mim', skills: 'Skills', contact: 'Contato' }

export function InfoPanel() {
  const panel = useGameStore((s) => s.panel)
  const closePanel = useGameStore((s) => s.closePanel)
  const closeRef = useRef<HTMLButtonElement>(null)

  const opener = useRef<HTMLElement | null>(null)
  const open = panel !== null

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()
    return () => {
      opener.current?.focus()
      opener.current = null
    }
  }, [open])

  const trapTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const items = e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!panel) return null

  return (
    <div
      className="panel-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePanel()
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={TITLES[panel]} className="panel" onKeyDown={trapTab}>
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
