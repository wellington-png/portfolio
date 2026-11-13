import { act, fireEvent, render, screen } from '@testing-library/react'
import { profile, projects } from '../content'
import { useGameStore } from '../store/gameStore'
import { resetThemeForTests, useThemeStore } from '../theme/themeStore'
import { StartScreen } from './StartScreen'

describe('StartScreen (landing)', () => {
  beforeEach(() => {
    resetThemeForTests()
    useGameStore.getState().setMode('menu')
  })

  it('shows the name, every project and the sections', () => {
    render(<StartScreen />)
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeInTheDocument()
    for (const p of projects) expect(screen.getAllByRole('heading', { name: p.title }).length).toBeGreaterThan(0)
    for (const name of ['Últimos projetos', 'O que eu faço', 'Missões', 'Em destaque', 'Capturas de tela', 'Equipamento', 'Perguntas rápidas', 'Continue a aventura']) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
  })

  it('opens the launcher from the play button', () => {
    render(<StartScreen />)
    fireEvent.click(screen.getAllByRole('button', { name: /Jogar/ })[0])
    expect(useGameStore.getState().mode).toBe('play')
  })

  it('opens the quick 2D version', () => {
    render(<StartScreen />)
    fireEvent.click(screen.getByRole('button', { name: 'Versão rápida' }))
    expect(useGameStore.getState().mode).toBe('2d')
  })

  it('breaks the dark flow with light and full-colour sections', () => {
    const { container } = render(<StartScreen />)
    expect(container.querySelectorAll('section.light').length).toBeGreaterThanOrEqual(2)
    expect(container.querySelector('section.featured')).not.toBeNull()
    expect(container.querySelectorAll('.edge').length).toBeGreaterThanOrEqual(5)
  })

  it('has the mode toggle in the navigation', () => {
    render(<StartScreen />)
    expect(screen.getByRole('group', { name: 'Modo visual' })).toBeInTheDocument()
  })

  it('repaginates the copy when the mode changes to GTA 6', () => {
    const { rerender } = render(<StartScreen />)
    expect(screen.getByRole('heading', { name: 'Equipamento' })).toBeInTheDocument()
    act(() => useThemeStore.getState().setTheme('gta'))
    rerender(<StartScreen />)
    expect(screen.getByRole('heading', { name: 'Arsenal' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Plano do golpe' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Especialidades' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Antes de aceitar a missão' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Equipamento' })).toBeNull()
  })

  it('shows the interactive showcase and lets you pick a project', () => {
    const { container } = render(<StartScreen />)
    const showcase = container.querySelector('.showcase') as HTMLElement
    expect(showcase).toHaveAttribute('aria-label', 'Prévia dos projetos')
    expect(container.querySelector('.roulette')).toBeNull()
    const tabs = screen.getAllByRole('button', { pressed: undefined }).filter((b) => b.classList.contains('sc-tab'))
    expect(tabs).toHaveLength(projects.length)
    expect(tabs[0]).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(tabs[2])
    expect(tabs[2]).toHaveAttribute('aria-pressed', 'true')
    expect(tabs[0]).toHaveAttribute('aria-pressed', 'false')
    expect(showcase.querySelector('.sc-card .sc-title')).toHaveTextContent(projects[2].title)
  })

  it('cycles the transition style on every change', () => {
    const { container } = render(<StartScreen />)
    const showcase = container.querySelector('.showcase') as HTMLElement
    const seen = new Set<string | undefined>([showcase.dataset.kind])
    const tabs = [...container.querySelectorAll<HTMLElement>('.sc-tab')]
    for (const i of [1, 2, 3]) {
      fireEvent.click(tabs[i])
      seen.add(showcase.dataset.kind)
    }
    expect(seen.size).toBe(4)
  })

  it('introduces the person with the portrait and a pitch', () => {
    const { container } = render(<StartScreen />)
    expect(container.querySelector('.hello img')).toHaveAttribute('src', '/eu.webp')
    expect(screen.getByText(profile.pitch)).toBeInTheDocument()
  })

  it('splits the hero into a clean area and an art area divided by a crack', () => {
    const { container } = render(<StartScreen />)
    expect(container.querySelector('.hero-clean')).not.toBeNull()
    expect(container.querySelector('.hero-split .hero-art')).not.toBeNull()
    expect(container.querySelector('.hero-split svg.crack')).not.toBeNull()
  })
})
