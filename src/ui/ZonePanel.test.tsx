import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { profile, projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { ZonePanel } from './ZonePanel'

describe('ZonePanel', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('renders nothing while closed', () => {
    render(<ZonePanel />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the about content when the about zone panel is open', () => {
    useGameStore.setState({ activeZone: 'about', panelOpen: true })
    render(<ZonePanel />)
    expect(screen.getByRole('dialog', { name: 'Sobre mim' })).toBeInTheDocument()
    expect(screen.getByText(profile.bio)).toBeInTheDocument()
  })

  it('shows a project when a project zone is open', () => {
    useGameStore.setState({ activeZone: `project:${projects[1].id}`, panelOpen: true })
    render(<ZonePanel />)
    expect(screen.getByRole('heading', { name: projects[1].title })).toBeInTheDocument()
  })

  it('closes with the close button', async () => {
    useGameStore.setState({ activeZone: 'about', panelOpen: true })
    render(<ZonePanel />)
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(useGameStore.getState().panelOpen).toBe(false)
  })
})
