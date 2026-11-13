import { polar, wedgeAngles, wedgePath } from './wheel'

describe('wheel geometry', () => {
  it('puts angle 0 at the top and 90 at the right', () => {
    const top = polar(100, 100, 50, 0)
    expect(top.x).toBeCloseTo(100)
    expect(top.y).toBeCloseTo(50)
    const right = polar(100, 100, 50, 90)
    expect(right.x).toBeCloseTo(150)
    expect(right.y).toBeCloseTo(100)
  })

  it('splits the circle evenly, centred on each slice', () => {
    const a = wedgeAngles(3, 1, 0)
    expect(a.mid).toBe(120)
    expect(a.start).toBe(60)
    expect(a.end).toBe(180)
    const gapped = wedgeAngles(4, 0, 4)
    expect(gapped.end - gapped.start).toBe(86)
  })

  it('builds a closed ring-sector path', () => {
    const d = wedgePath(100, 100, 40, 90, -60, 60)
    expect(d.startsWith('M')).toBe(true)
    expect(d.endsWith('Z')).toBe(true)
    expect(d.match(/A/g)).toHaveLength(2)
  })
})
