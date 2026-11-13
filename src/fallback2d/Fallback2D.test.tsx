import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { profile, projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { Fallback2D } from './Fallback2D'
import { variantOf } from './Story'

describe('Fallback2D', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('renders every section from content', () => {
    render(<Fallback2D />)
    expect(screen.getByRole('heading', { level: 1, name: /trabalhos/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: profile.name })).toBeInTheDocument()
    for (const p of projects) {
      expect(screen.getByRole('heading', { name: p.title })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: new RegExp(`Ver ${p.title} ao vivo`) })).toHaveAttribute('rel', 'noopener noreferrer')
    }
    expect(screen.getByRole('heading', { name: 'Contato' })).toBeInTheDocument()
  })

  it('shows the notice when present', () => {
    useGameStore.setState({ notice: 'sem webgl' })
    render(<Fallback2D />)
    expect(screen.getByRole('status')).toHaveTextContent('sem webgl')
  })

  it('lists a numbered level for each project in the showcase', () => {
    render(<Fallback2D />)
    for (const [i, p] of projects.entries()) {
      expect(screen.getByRole('link', { name: `Ver a fase ${i + 1}: ${p.title}` })).toHaveAttribute('href', `#${p.id}`)
    }
  })

  it('goes back to the start screen', async () => {
    useGameStore.setState({ mode: '2d' })
    render(<Fallback2D />)
    await userEvent.click(screen.getByRole('button', { name: /início/i }))
    expect(useGameStore.getState().mode).toBe('menu')
  })

  it('opens the launcher from the top bar', async () => {
    useGameStore.setState({ mode: '2d' })
    render(<Fallback2D />)
    await userEvent.click(screen.getByRole('button', { name: /launcher/i }))
    expect(useGameStore.getState().mode).toBe('play')
  })

  it('uses a different scroll transition for each chapter', () => {
    const { container } = render(<Fallback2D />)
    const portals = [...container.querySelectorAll<HTMLElement>('[data-portal]')]
    expect(portals).toHaveLength(projects.length)
    const variants = portals.map((p) => p.dataset.variant)
    expect(new Set(variants).size).toBe(projects.length)
    expect(variants).toEqual(projects.map((_, i) => variantOf(i)))
    expect(portals.every((p) => p.getAttribute('aria-hidden') === 'true')).toBe(true)
  })
})
