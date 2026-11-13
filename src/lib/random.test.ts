import { mulberry32 } from './random'

describe('mulberry32', () => {
  it('is deterministic and stays in [0, 1)', () => {
    const a = mulberry32(1)
    const b = mulberry32(1)
    for (let i = 0; i < 20; i++) {
      const v = a()
      expect(v).toBe(b())
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('changes with the seed', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)())
  })
})
