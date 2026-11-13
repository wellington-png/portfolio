import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { contact, profile, projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { InfoPanel, usageRanking } from './InfoPanel'

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

  it('about: the missions list jumps straight into that project tour', async () => {
    useGameStore.setState({ panel: 'about', mode: 'play' })
    render(<InfoPanel />)
    await userEvent.click(screen.getByRole('button', { name: new RegExp(`Ver o tour de ${projects[2].title}`) }))
    const st = useGameStore.getState()
    expect(st.selected).toBe(2)
    expect(st.panel).toBeNull()
    expect(st.view).toBe('tour')
  })

  it('about: shows the player sheet with class, stats and specialties', () => {
    useGameStore.setState({ panel: 'about' })
    render(<InfoPanel />)
    expect(screen.getByText(new RegExp(`Classe · ${profile.title}`))).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Especialidades' })).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Missões concluídas' })).toBeInTheDocument()
  })

  it('skills: ranks the tools by how many projects use them', () => {
    const rank = usageRanking()
    expect(rank[0].count).toBe(projects.length)
    expect(rank.every((r) => r.count > 0)).toBe(true)
    for (let i = 1; i < rank.length; i++) expect(rank[i - 1].count).toBeGreaterThanOrEqual(rank[i].count)
    useGameStore.setState({ panel: 'skills' })
    render(<InfoPanel />)
    expect(screen.getByRole('heading', { name: 'Mais usadas nos projetos' })).toBeInTheDocument()
    expect(screen.getAllByText(`${projects.length}/${projects.length}`).length).toBeGreaterThan(0)
  })

  it('contact: copies the email and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    useGameStore.setState({ panel: 'contact' })
    render(<InfoPanel />)
    await userEvent.click(screen.getByRole('button', { name: /copiar email/i }))
    expect(writeText).toHaveBeenCalledWith(contact.email)
    expect(await screen.findByRole('button', { name: /email copiado/i })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(contact.email)
  })

  it('switches between the three panels with the tabs', async () => {
    useGameStore.setState({ panel: 'about' })
    render(<InfoPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'Skills' }))
    expect(useGameStore.getState().panel).toBe('skills')
    await userEvent.click(screen.getByRole('button', { name: 'Contato' }))
    expect(useGameStore.getState().panel).toBe('contact')
  })
})
