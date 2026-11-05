import { joystickVector, keysToControls, mergeControls } from './input'

describe('keysToControls', () => {
  it('maps WASD and arrows', () => {
    expect(keysToControls(new Set(['KeyW']))).toEqual({ throttle: 1, steer: 0, brake: false })
    expect(keysToControls(new Set(['ArrowDown']))).toEqual({ throttle: -1, steer: 0, brake: false })
    expect(keysToControls(new Set(['KeyA']))).toEqual({ throttle: 0, steer: 1, brake: false })
    expect(keysToControls(new Set(['ArrowRight']))).toEqual({ throttle: 0, steer: -1, brake: false })
    expect(keysToControls(new Set(['Space']))).toEqual({ throttle: 0, steer: 0, brake: true })
  })

  it('cancels opposite keys', () => {
    expect(keysToControls(new Set(['KeyW', 'KeyS'])).throttle).toBe(0)
    expect(keysToControls(new Set(['KeyA', 'KeyD'])).steer).toBe(0)
  })
})

describe('joystickVector', () => {
  it('normalizes by radius', () => {
    expect(joystickVector(25, 0, 50)).toEqual({ x: 0.5, y: 0 })
  })
  it('clamps magnitude to 1', () => {
    const v = joystickVector(100, 100, 50)
    expect(Math.hypot(v.x, v.y)).toBeCloseTo(1)
  })
})

describe('mergeControls', () => {
  it('pushing the stick up accelerates, left steers left', () => {
    const none = { throttle: 0, steer: 0, brake: false }
    expect(mergeControls(none, { x: 0, y: -1 })).toEqual({ throttle: 1, steer: 0, brake: false })
    expect(mergeControls(none, { x: -1, y: 0 })).toEqual({ throttle: 0, steer: 1, brake: false })
  })
  it('clamps combined input to [-1, 1]', () => {
    const k = { throttle: 1, steer: 1, brake: true }
    expect(mergeControls(k, { x: -1, y: -1 })).toEqual({ throttle: 1, steer: 1, brake: true })
  })
})
