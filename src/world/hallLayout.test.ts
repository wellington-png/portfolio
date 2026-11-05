import { PORTAL_WIDTH, portalPlacements } from './hallLayout'

describe('portalPlacements', () => {
  it('returns one placement per portal', () => {
    expect(portalPlacements(4)).toHaveLength(4)
    expect(portalPlacements(0)).toEqual([])
  })

  it('is symmetric around x = 0', () => {
    const p = portalPlacements(4)
    expect(p[0].position[0]).toBeCloseTo(-p[3].position[0])
    expect(p[1].position[0]).toBeCloseTo(-p[2].position[0])
  })

  it('keeps neighbors farther apart than the portal width', () => {
    const p = portalPlacements(4)
    for (let i = 0; i < p.length - 1; i++) {
      const d = Math.hypot(p[i].position[0] - p[i + 1].position[0], p[i].position[2] - p[i + 1].position[2])
      expect(d).toBeGreaterThan(PORTAL_WIDTH)
    }
  })

  it('turns the outer portals toward the center', () => {
    const p = portalPlacements(4)
    expect(p[0].rotationY).toBeGreaterThan(0)
    expect(p[3].rotationY).toBeLessThan(0)
  })

  it('puts a single portal at the center, facing front', () => {
    const [only] = portalPlacements(1)
    expect(only.position[0]).toBeCloseTo(0)
    expect(only.rotationY).toBeCloseTo(0)
  })
})
