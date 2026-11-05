import { generateSkyline, mulberry32 } from './skyline'

describe('skyline', () => {
  it('mulberry32 is deterministic and in [0,1)', () => {
    const a = mulberry32(1)
    const b = mulberry32(1)
    for (let i = 0; i < 10; i++) {
      const v = a()
      expect(v).toBe(b())
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('generates the requested count deterministically', () => {
    expect(generateSkyline(30, 7)).toHaveLength(30)
    expect(generateSkyline(30, 7)).toEqual(generateSkyline(30, 7))
    expect(generateSkyline(30, 7)).not.toEqual(generateSkyline(30, 8))
  })

  it('keeps every building outside the arena', () => {
    for (const b of generateSkyline(200, 3)) {
      expect(Math.max(Math.abs(b.x), Math.abs(b.z))).toBeGreaterThanOrEqual(58)
    }
  })
})
