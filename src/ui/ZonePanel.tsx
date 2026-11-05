import { useEffect, useRef } from 'react'
import { projects } from '../content'
import { useGameStore } from '../store/gameStore'
import { getZone } from '../zones/zoneLayout'
import { ContactSection, ProfileSection, ProjectDetail, SkillsSection } from './sections'

export function ZonePanel() {
  const activeZone = useGameStore((s) => s.activeZone)
  const panelOpen = useGameStore((s) => s.panelOpen)
  const closePanel = useGameStore((s) => s.closePanel)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (panelOpen) closeRef.current?.focus()
  }, [panelOpen])

  if (!panelOpen || !activeZone) return null
  const zone = getZone(activeZone)
  if (!zone) return null

  let body = null
  if (zone.kind === 'about') body = <ProfileSection />
  else if (zone.kind === 'skills') body = <SkillsSection />
  else if (zone.kind === 'contact') body = <ContactSection />
  else if (zone.kind === 'project') {
    const project = projects.find((p) => p.id === zone.projectId)
    body = project ? <ProjectDetail project={project} /> : null
  }

  return (
    <div className="panel-backdrop">
      <div role="dialog" aria-modal="true" aria-label={zone.label} className="panel">
        <button ref={closeRef} className="panel-close" aria-label="Fechar" onClick={closePanel}>
          ✕
        </button>
        {body}
      </div>
    </div>
  )
}
