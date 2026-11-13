import { render } from '@testing-library/react'
import { quests, skillGroups } from '../content'
import { hasIcon, Icon } from './Icon'

describe('Icon', () => {
  it('has a drawn icon for every skill and quest (no emoji)', () => {
    for (const s of skillGroups.flatMap((g) => g.skills)) expect(hasIcon(s.icon), s.name).toBe(true)
    for (const q of quests) expect(hasIcon(q.icon), q.title).toBe(true)
  })

  it('renders a decorative svg and falls back for unknown names', () => {
    const { container } = render(<Icon name="nao-existe" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg?.querySelector('path')).not.toBeNull()
  })
})
