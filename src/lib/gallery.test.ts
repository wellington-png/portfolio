import { stepIndex } from './gallery'

describe('stepIndex', () => {
  it('starts at the first image going forward and at the last going back', () => {
    expect(stepIndex(null, 1, 5)).toBe(0)
    expect(stepIndex(null, -1, 5)).toBe(4)
  })
  it('moves by one', () => {
    expect(stepIndex(1, 1, 5)).toBe(2)
    expect(stepIndex(3, -1, 5)).toBe(2)
  })
  it('wraps around', () => {
    expect(stepIndex(4, 1, 5)).toBe(0)
    expect(stepIndex(0, -1, 5)).toBe(4)
  })
  it('returns null when there are no images', () => {
    expect(stepIndex(null, 1, 0)).toBeNull()
  })
})
