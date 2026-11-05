import { brakeImpulse, DRIVE, driveForce, followPosition, lateralImpulse, yawRate } from './physics'

describe('driveForce', () => {
  it('accelerates forward and backward', () => {
    expect(driveForce(1, 0)).toBe(DRIVE.engine)
    expect(driveForce(-1, 0)).toBe(-DRIVE.reverse)
    expect(driveForce(0, 5)).toBe(0)
  })
  it('stops pushing at max speed', () => {
    expect(driveForce(1, DRIVE.maxSpeed)).toBe(0)
    expect(driveForce(-1, -DRIVE.maxReverse)).toBe(0)
  })
})

describe('yawRate', () => {
  it('does not rotate when stopped', () => {
    expect(yawRate(1, 0)).toBe(0)
  })
  it('turns left (positive) when steering left while moving forward', () => {
    expect(yawRate(1, 12)).toBeGreaterThan(0)
  })
  it('inverts when reversing', () => {
    expect(yawRate(1, -12)).toBeLessThan(0)
  })
})

describe('lateralImpulse', () => {
  it('opposes sideways velocity', () => {
    expect(lateralImpulse(4, false, 1 / 60)).toBeLessThan(0)
    expect(lateralImpulse(-4, false, 1 / 60)).toBeGreaterThan(0)
  })
  it('slides more with handbrake', () => {
    expect(Math.abs(lateralImpulse(4, true, 1 / 60))).toBeLessThan(Math.abs(lateralImpulse(4, false, 1 / 60)))
  })
})

describe('brakeImpulse', () => {
  it('opposes forward velocity', () => {
    expect(brakeImpulse(10, 1 / 60)).toBeLessThan(0)
    expect(brakeImpulse(-10, 1 / 60)).toBeGreaterThan(0)
  })
})

describe('followPosition', () => {
  it('sits behind and above the car', () => {
    const p = followPosition({ x: 0, y: 0, z: 0 }, 0, 10, 5)
    expect(p.x).toBeCloseTo(0)
    expect(p.y).toBeCloseTo(5)
    expect(p.z).toBeCloseTo(10)
  })
  it('rotates with heading', () => {
    const p = followPosition({ x: 0, y: 0, z: 0 }, Math.PI / 2, 10, 5)
    expect(p.x).toBeCloseTo(10)
    expect(p.z).toBeCloseTo(0)
  })
})
