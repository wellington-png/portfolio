import { act, fireEvent, render, screen } from '@testing-library/react'
import { projects, stepsOf } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { resetThemeForTests } from '../theme/themeStore'
import { Launcher } from './Launcher'
import { DWELL } from './Tour'

const s = () => useGameStore.getState()

describe('Launcher', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetThemeForTests()
    useGameStore.setState({ ...initialGameState, mode: 'play' })
  })
  afterEach(() => vi.useRealTimers())

  it('shows the shelf with the selected project and a tile per project', () => {
    render(<Launcher />)
    expect(screen.getByRole('heading', { level: 1, name: projects[0].title })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(projects.length)
    expect(screen.getByRole('option', { name: new RegExp(projects[0].title) })).toHaveAttribute('aria-selected', 'true')
  })

  it('choosing a tile changes the featured project; choosing it again opens the tour', () => {
    render(<Launcher />)
    fireEvent.click(screen.getByRole('option', { name: new RegExp(projects[2].title) }))
    expect(screen.getByRole('heading', { level: 1, name: projects[2].title })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: new RegExp(projects[2].title) }))
    expect(s().view).toBe('tour')
    expect(screen.getByRole('region', { name: `Tour de ${projects[2].title}` })).toBeInTheDocument()
  })

  it('"Ver o tour" opens the guided tour at the first region and Esc goes back', () => {
    render(<Launcher />)
    fireEvent.click(screen.getByRole('button', { name: /ver o tour/i }))
    const first = stepsOf(projects[0])[0].focuses[0]
    expect(screen.getByRole('heading', { level: 2, name: first.title })).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(s().view).toBe('shelf')
  })

  it('the tour advances by itself, can be paused and jumps between screens', () => {
    render(<Launcher />)
    fireEvent.click(screen.getByRole('button', { name: /ver o tour/i }))
    const steps = stepsOf(projects[0])
    act(() => void vi.advanceTimersByTime(DWELL + 50))
    expect(s().region).toBe(1)
    expect(screen.getByRole('heading', { level: 2, name: steps[0].focuses[1].title })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /pausar o tour/i }))
    act(() => void vi.advanceTimersByTime(DWELL * 3))
    expect(s().region).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: /próxima tela/i }))
    expect(s().step).toBe(1)
    expect(s().region).toBe(0)
    fireEvent.click(screen.getByRole('button', { name: new RegExp(steps[2].image.alt.split(': ')[1].slice(0, 12), 'i') }))
    expect(s().step).toBe(2)
  })

  it('finishing a screen unlocks an achievement and shows the toast; the full tour ends with the summary', () => {
    render(<Launcher />)
    fireEvent.click(screen.getByRole('button', { name: /ver o tour/i }))
    const total = stepsOf(projects[0]).reduce((n, st) => n + st.focuses.length, 0)
    for (let i = 0; i < total + 2; i++) act(() => void vi.advanceTimersByTime(DWELL + 1700))
    expect(s().unlocked[projects[0].id]?.length).toBe(stepsOf(projects[0]).length)
    expect(s().playing).toBe(false)
    expect(screen.getByRole('dialog', { name: 'Tour concluído' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /próximo:/i }))
    expect(s().selected).toBe(1)
    expect(s().view).toBe('tour')
  })

  it('opens the info panels with A, S and C', () => {
    render(<Launcher />)
    fireEvent.keyDown(window, { code: 'KeyS' })
    expect(screen.getByRole('dialog', { name: 'Skills' })).toBeInTheDocument()
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
