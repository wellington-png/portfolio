import { AboutKiosk } from './AboutKiosk'
import { ContactPortal } from './ContactPortal'
import { ProjectBuilding } from './ProjectBuilding'
import { SkillsWall } from './SkillsWall'
import { ZoneBase } from './ZoneBase'
import { zones, type ZoneDef } from './zoneLayout'

function ZoneVisual({ zone }: { zone: ZoneDef }) {
  switch (zone.kind) {
    case 'about':
      return <AboutKiosk zone={zone} />
    case 'project':
      return <ProjectBuilding zone={zone} />
    case 'skills':
      return <SkillsWall zone={zone} />
    case 'contact':
      return <ContactPortal zone={zone} />
  }
}

export function Zones() {
  return (
    <>
      {zones.map((zone) => (
        <group key={zone.id}>
          <ZoneBase zone={zone} labelHeight={zone.kind === 'project' ? 11 : 7} />
          <ZoneVisual zone={zone} />
        </group>
      ))}
    </>
  )
}
