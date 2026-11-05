import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialGameState, useGameStore } from '../store/gameStore'
import { TopMenu } from './TopMenu'

describe('TopMenu', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('opens the info panels', async () => {
    render(<TopMenu />)
    await userEvent.click(screen.getByRole('button', { name: 'Skills' }))
    expect(useGameStore.getState().panel).toBe('skills')
    await userEvent.click(screen.getByRole('button', { name: 'Sobre mim' }))
    expect(useGameStore.getState().panel).toBe('about')
  })

  it('switches to the quick 2D version', async () => {
    render(<TopMenu />)
    await userEvent.click(screen.getByRole('button', { name: /versão rápida/i }))
    expect(useGameStore.getState().mode).toBe('2d')
  })

  it('is hidden inside a project', () => {
    useGameStore.setState({ phase: 'room', activeProject: 'barbuz' })
    render(<TopMenu />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
