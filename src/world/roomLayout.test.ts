import { fitDistance, screenPlacements } from './roomLayout'

const desktop = { width: 1600, height: 1000 }
const phone = { width: 400, height: 800 }

describe('screenPlacements', () => {
  const s = screenPlacements([desktop, phone, desktop])

  it('classifies and sizes screens by aspect', () => {
    expect(s[0].kind).toBe('desktop')
    expect(s[0].width).toBeCloseTo(2.6)
    expect(s[0].height).toBeCloseTo(2.6 / 1.6)
    expect(s[1].kind).toBe('mobile')
    expect(s[1].height).toBeCloseTo(2.2)
    expect(s[1].width).toBeCloseTo(1.1)
  })

  it('lays screens left to right without overlap', () => {
    for (let i = 0; i < s.length - 1; i++) {
      const rightEdge = s[i].position[0] + s[i].width / 2
      const nextLeftEdge = s[i + 1].position[0] - s[i + 1].width / 2
      expect(nextLeftEdge - rightEdge).toBeGreaterThanOrEqual(0.59)
    }
  })

  it('is centered on x = 0', () => {
    const left = s[0].position[0] - s[0].width / 2
    const last = s[s.length - 1]
    const right = last.position[0] + last.width / 2
    expect(left).toBeCloseTo(-right)
  })

  it('keeps the original index', () => {
    expect(s.map((x) => x.index)).toEqual([0, 1, 2])
  })

  it('handles an empty list', () => {
    expect(screenPlacements([])).toEqual([])
  })
})

describe('fitDistance', () => {
  it('fits the taller dimension with 25% margin', () => {
    // fov 90 => tan(45deg) = 1; height 2 => 1 * 1.25
    expect(fitDistance(1, 2, 90, 1)).toBeCloseTo(1.25)
  })
  it('fits the wider dimension on narrow viewports', () => {
    // width 4 on aspect 1 => 2 * 1.25
    expect(fitDistance(4, 1, 90, 1)).toBeCloseTo(2.5)
  })
})
