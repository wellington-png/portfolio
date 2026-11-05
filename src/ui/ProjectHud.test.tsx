import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { ProjectHud } from './ProjectHud'

const p = projects[0]

describe('ProjectHud', () => {
  beforeEach(() => useGameStore.setState({ ...initialGameState, phase: 'room', activeProject: p.id }))

  it('is hidden outside the room', () => {
    useGameStore.setState({ phase: 'hub', activeProject: null })
    render(<ProjectHud />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('shows the project text, stack and live link', () => {
    render(<ProjectHud />)
    expect(screen.getByRole('heading', { name: p.title })).toBeInTheDocument()
    expect(screen.getByText(p.description)).toBeInTheDocument()
    for (const tech of p.stack) expect(screen.getByText(tech)).toBeInTheDocument()
    const live = screen.getByRole('link', { name: /ver site/i })
    expect(live).toHaveAttribute('href', p.liveUrl)
    expect(live).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('steps through the images and shows the caption', async () => {
    render(<ProjectHud />)
    await userEvent.click(screen.getByRole('button', { name: /próxima imagem/i }))
    expect(useGameStore.getState().focusedImage).toBe(0)
    expect(screen.getByText(`1 / ${p.images.length}`)).toBeInTheDocument()
    expect(screen.getByText(p.images[0].alt)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /imagem anterior/i }))
    expect(useGameStore.getState().focusedImage).toBe(p.images.length - 1)
  })

  it('leaves the project with the back button', async () => {
    render(<ProjectHud />)
    await userEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(useGameStore.getState().phase).toBe('leaving')
  })

  it('focuses the back button when the HUD appears', () => {
    render(<ProjectHud />)
    expect(screen.getByRole('button', { name: /voltar/i })).toHaveFocus()
  })
})
