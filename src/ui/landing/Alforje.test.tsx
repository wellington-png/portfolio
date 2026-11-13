import { fireEvent, render, screen } from '@testing-library/react'
import { skillGroups } from '../../content'
import { Alforje } from './Alforje'

describe('Alforje', () => {
  it('opens the first drawer and lists its items', () => {
    render(<Alforje />)
    expect(screen.getByRole('tab', { name: skillGroups[0].label })).toHaveAttribute('aria-selected', 'true')
    for (const s of skillGroups[0].skills) expect(screen.getByText(s.name)).toBeInTheDocument()
  })

  it('switches drawers by click and with the arrow keys', () => {
    render(<Alforje />)
    fireEvent.click(screen.getByRole('tab', { name: skillGroups[1].label }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent(skillGroups[1].skills[0].name)
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: skillGroups[2].label })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: skillGroups[0].label })).toHaveAttribute('aria-selected', 'true')
  })
})
