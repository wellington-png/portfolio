import { render, screen } from '@testing-library/react'
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
})
