import { activeIndex } from './useActiveSection'

describe('activeIndex', () => {
  it('is -1 before the first section reaches the reading line', () => {
    expect(activeIndex([900, 1500, 2200], 800)).toBe(-1)
  })

  it('picks the last section that already passed the reading line', () => {
    expect(activeIndex([-1200, -300, 250, 900], 800)).toBe(2)
    expect(activeIndex([-4000, -2500, -1000, -10], 800)).toBe(3)
  })

  it('keeps the current section while a long one is still on screen', () => {
    expect(activeIndex([-2400, 1300], 800)).toBe(0)
  })
})
