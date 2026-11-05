import { HUB_CAMERA, PORTAL_WIDTH, hubCameraZ, portalPlacements } from './hallLayout'

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

describe('hubCameraZ', () => {
  it('keeps the default pose on desktop', () => {
    expect(hubCameraZ(16 / 9)).toBe(HUB_CAMERA.position[2])
  })

  it('pulls back on portrait phones, capped at 16', () => {
    const z = hubCameraZ(390 / 844)
    expect(z).toBeGreaterThan(10)
    expect(z).toBeLessThanOrEqual(16)
  })

  it('never increases with aspect and stays within [6, 16]', () => {
    const aspects = [0.3, 0.46, 0.6, 0.8, 1, 1.4, 1.78, 2.4, 3]
    let prev = Infinity
    for (const a of aspects) {
      const z = hubCameraZ(a)
      expect(z).toBeLessThanOrEqual(prev)
      expect(z).toBeLessThanOrEqual(16)
      expect(z).toBeGreaterThanOrEqual(6)
      prev = z
    }
  })
})
