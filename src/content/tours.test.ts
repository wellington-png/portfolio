import { imageKind } from './images'
import { projects } from './projects'
import { focuses, focusesOf, focusTransform, phoneOf, stepsOf } from './tours'

describe('tours', () => {
  it('has a guided step for every desktop screenshot, with regions inside the image', () => {
    for (const p of projects) {
      const desktop = p.images.filter((i) => imageKind(i) === 'desktop')
      const steps = stepsOf(p)
      expect(steps).toHaveLength(desktop.length)
      for (const s of steps) {
        expect(s.focuses.length).toBeGreaterThan(0)
        expect(focusesOf(s.image)).toBe(s.focuses)
        for (const r of s.focuses) {
          expect(r.title).toBeTruthy()
          expect(r.text).toBeTruthy()
          expect(r.w).toBeGreaterThan(0)
          expect(r.h).toBeGreaterThan(0)
          expect(r.x).toBeGreaterThanOrEqual(0)
          expect(r.y).toBeGreaterThanOrEqual(0)
          expect(r.x + r.w).toBeLessThanOrEqual(100.01)
          expect(r.y + r.h).toBeLessThanOrEqual(100.01)
        }
      }
    }
  })

  it('has no unused region sets', () => {
    const used = new Set(projects.flatMap((p) => p.images.map((i) => i.src.split('/').pop()!.replace(/\.\w+$/, ''))))
    for (const key of Object.keys(focuses)) expect(used.has(key), key).toBe(true)
  })

  it('finds a phone screenshot for every project', () => {
    for (const p of projects) expect(phoneOf(p)).toBeDefined()
  })

  it('zooms to a region and keeps the image covering the stage', () => {
    const t = focusTransform({ x: 20, y: 20, w: 20, h: 10, title: 't', text: 't' })
    expect(t.scale).toBeGreaterThan(1)
    for (const v of [t.tx, t.ty]) {
      expect(v).toBeLessThanOrEqual(0)
      expect(v).toBeGreaterThanOrEqual(100 - 100 * t.scale)
    }
    const whole = focusTransform({ x: 0, y: 0, w: 100, h: 100, title: 't', text: 't' })
    expect(whole).toEqual({ scale: 1, tx: 0, ty: 0 })
  })
})
