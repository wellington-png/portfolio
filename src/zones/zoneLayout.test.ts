import { projects } from '../content'
import { buildZones, getZone, spawnPoint, ARENA_HALF } from './zoneLayout'

describe('zoneLayout', () => {
  const zones = buildZones(projects)

  it('creates about, skills, contact and one zone per project', () => {
    expect(zones).toHaveLength(projects.length + 3)
    expect(zones.map((z) => z.kind).sort()).toEqual(
      ['about', 'contact', 'skills', ...projects.map(() => 'project')].sort(),
    )
  })

  it('has unique ids', () => {
    const ids = zones.map((z) => z.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps every zone inside the arena with margin', () => {
    for (const z of zones) {
      expect(Math.abs(z.position[0])).toBeLessThanOrEqual(ARENA_HALF - 8)
      expect(Math.abs(z.position[1])).toBeLessThanOrEqual(ARENA_HALF - 8)
    }
  })

  it('keeps zones at least 12 units apart', () => {
    for (let i = 0; i < zones.length; i++) {
      for (let j = i + 1; j < zones.length; j++) {
        const [ax, az] = zones[i].position
        const [bx, bz] = zones[j].position
        expect(Math.hypot(ax - bx, az - bz)).toBeGreaterThanOrEqual(12)
      }
    }
  })

  it('links project zones to their project', () => {
    const z = zones.find((x) => x.kind === 'project')!
    expect(z.projectId).toBe(projects[0].id)
    expect(z.id).toBe(`project:${projects[0].id}`)
  })

  it('getZone finds by id and spawn is away from every zone', () => {
    expect(getZone('about')?.kind).toBe('about')
    expect(getZone('nope')).toBeUndefined()
    for (const z of buildZones()) {
      expect(Math.hypot(z.position[0] - spawnPoint[0], z.position[1] - spawnPoint[2])).toBeGreaterThan(10)
    }
  })
})
