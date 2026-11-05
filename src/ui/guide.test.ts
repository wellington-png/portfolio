import { bearingTo, nearestUnvisited } from './guide'
import type { ZoneDef } from '../zones/zoneLayout'

const z = (id: string, x: number, zz: number): ZoneDef => ({
  id, kind: 'about', label: id, position: [x, zz], color: '#fff',
})

describe('bearingTo', () => {
  const from = { x: 0, z: 0 }
  it('is 0 when the target is straight ahead', () => {
    expect(bearingTo(from, 0, [0, -10])).toBeCloseTo(0)
  })
  it('is +PI/2 when the target is on the right', () => {
    expect(bearingTo(from, 0, [10, 0])).toBeCloseTo(Math.PI / 2)
  })
  it('is -PI/2 on the left', () => {
    expect(bearingTo(from, 0, [-10, 0])).toBeCloseTo(-Math.PI / 2)
  })
  it('is PI behind', () => {
    expect(Math.abs(bearingTo(from, 0, [0, 10]))).toBeCloseTo(Math.PI)
  })
  it('accounts for heading', () => {
    // virado para -x (heading PI/2), alvo em -x => à frente
    expect(bearingTo(from, Math.PI / 2, [-10, 0])).toBeCloseTo(0)
  })
})

describe('nearestUnvisited', () => {
  const zones = [z('a', 0, -10), z('b', 30, 0), z('c', 5, 5)]
  it('returns the closest zone not yet visited', () => {
    expect(nearestUnvisited({ x: 0, z: 0 }, zones, ['a'])?.id).toBe('c')
  })
  it('returns undefined when everything was visited', () => {
    expect(nearestUnvisited({ x: 0, z: 0 }, zones, ['a', 'b', 'c'])).toBeUndefined()
  })
})
