import { render } from '@testing-library/react'
import { Crack, CRACK_DESKTOP, CRACK_MOBILE } from './Crack'

describe('Crack', () => {
  it('draws a jagged line (never straight) for desktop and for mobile', () => {
    for (const pts of [CRACK_DESKTOP, CRACK_MOBILE]) {
      expect(pts.length).toBeGreaterThan(8)
      const axis = pts === CRACK_DESKTOP ? 0 : 1
      const values = new Set(pts.map((p) => p[axis]))
      expect(values.size).toBeGreaterThan(5)
    }
  })

  it('renders both versions with a glow, the main line and branches', () => {
    const { container } = render(<Crack />)
    expect(container.querySelectorAll('svg.crack')).toHaveLength(2)
    expect(container.querySelectorAll('.crack-line')).toHaveLength(2)
    expect(container.querySelectorAll('.crack-branch').length).toBeGreaterThan(4)
    expect(container.querySelectorAll('svg')[0]).toHaveAttribute('aria-hidden', 'true')
  })
})
