import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { contact, profile } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { InfoPanel } from './InfoPanel'

describe('InfoPanel', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('renders nothing while closed', () => {
    render(<InfoPanel />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the about content', () => {
    useGameStore.setState({ panel: 'about' })
    render(<InfoPanel />)
    expect(screen.getByRole('dialog', { name: 'Sobre mim' })).toBeInTheDocument()
    expect(screen.getByText(profile.bio)).toBeInTheDocument()
  })

  it('shows the contact links', () => {
    useGameStore.setState({ panel: 'contact' })
    render(<InfoPanel />)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', contact.github)
  })

  it('moves focus to the close button and closes with it', async () => {
    useGameStore.setState({ panel: 'skills' })
    render(<InfoPanel />)
    const close = screen.getByRole('button', { name: /fechar/i })
    expect(close).toHaveFocus()
    await userEvent.click(close)
    expect(useGameStore.getState().panel).toBeNull()
  })

  it('restores focus to the opener after closing', async () => {
    render(
      <>
        <button>opener</button>
        <InfoPanel />
      </>,
    )
    const opener = screen.getByRole('button', { name: 'opener' })
    opener.focus()
    act(() => useGameStore.setState({ panel: 'about' }))
    expect(screen.getByRole('button', { name: /fechar/i })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(opener).toHaveFocus()
  })

  it('wraps Tab from the last focusable back to the close button', async () => {
    useGameStore.setState({ panel: 'contact' })
    render(<InfoPanel />)
    const dialog = screen.getByRole('dialog')
    const focusables = dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const last = focusables[focusables.length - 1]
    last.focus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: /fechar/i })).toHaveFocus()
    await userEvent.tab({ shift: true })
    expect(last).toHaveFocus()
  })
})
