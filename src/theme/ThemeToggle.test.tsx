import { act, fireEvent, render, screen } from '@testing-library/react'
import { ThemeWipe } from './ThemeSwitch'
import { ThemeToggle } from './ThemeToggle'
import { resetThemeForTests, useThemeStore } from './themeStore'

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetThemeForTests()
  })
  afterEach(() => vi.useRealTimers())

  it('shows both modes with the current one pressed', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Red Dead' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'GTA 6' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('swaps to the other mode through the wipe', () => {
    render(
      <>
        <ThemeToggle />
        <ThemeWipe />
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'GTA 6' }))
    expect(document.querySelector('.wipe-gta')).not.toBeNull()
    act(() => void vi.advanceTimersByTime(1300))
    expect(useThemeStore.getState().theme).toBe('gta')
    expect(document.documentElement.dataset.theme).toBe('gta')
    expect(document.querySelector('.wipe')).toBeNull()
    expect(screen.getByRole('button', { name: 'GTA 6' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('does nothing when the active mode is clicked again', () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: 'Red Dead' }))
    expect(useThemeStore.getState().switching).toBeNull()
  })
})
