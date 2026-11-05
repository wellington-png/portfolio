import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { profile, projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { Fallback2D } from './Fallback2D'

describe('Fallback2D', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('renders every section from content', () => {
    render(<Fallback2D />)
    expect(screen.getByRole('heading', { name: profile.name })).toBeInTheDocument()
    for (const p of projects) expect(screen.getByRole('heading', { name: p.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contato' })).toBeInTheDocument()
  })

  it('shows the notice when present', () => {
    useGameStore.setState({ notice: 'sem webgl' })
    render(<Fallback2D />)
    expect(screen.getByRole('status')).toHaveTextContent('sem webgl')
  })

  it('goes back to the menu with the 3D button', async () => {
    useGameStore.setState({ mode: '2d' })
    render(<Fallback2D />)
    await userEvent.click(screen.getByRole('button', { name: /mundo 3d/i }))
    expect(useGameStore.getState().mode).toBe('menu')
  })
})
