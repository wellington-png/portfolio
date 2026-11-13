import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialGameState, useGameStore } from '../store/gameStore'
import { TopMenu } from './TopMenu'
import { resetThemeForTests } from '../theme/themeStore'

describe('TopMenu', () => {
  beforeEach(() => {
    resetThemeForTests()
    useGameStore.setState(initialGameState)
  })

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

  it('shows the shortcut keys and the mode toggle', () => {
    render(<TopMenu />)
    expect(screen.getByRole('button', { name: 'Sobre mim' })).toHaveAttribute('aria-keyshortcuts', 'A')
    expect(screen.getByRole('group', { name: 'Modo visual' })).toBeInTheDocument()
  })

  it('goes back to the start screen from the brand button', async () => {
    useGameStore.setState({ mode: 'play' })
    render(<TopMenu />)
    await userEvent.click(screen.getByRole('button', { name: /voltar ao início/i }))
    expect(useGameStore.getState().mode).toBe('menu')
  })
})
