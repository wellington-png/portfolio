import { THEMES, otherTheme } from './themes'
import { resetThemeForTests, useThemeStore } from './themeStore'

describe('theme store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    resetThemeForTests()
  })
  afterEach(() => vi.useRealTimers())

  it('starts on Red Dead and flips between the two modes', () => {
    expect(useThemeStore.getState().theme).toBe('rdr')
    expect(otherTheme('rdr')).toBe('gta')
    expect(otherTheme('gta')).toBe('rdr')
  })

  it('setTheme updates the document attribute and remembers the choice', () => {
    useThemeStore.getState().setTheme('gta')
    expect(document.documentElement.dataset.theme).toBe('gta')
    expect(localStorage.getItem('portfolio-theme')).toBe('gta')
  })

  it('switchTheme shows the wipe, swaps mid-way and ends clean', () => {
    useThemeStore.getState().switchTheme()
    expect(useThemeStore.getState().switching).toBe('gta')
    expect(useThemeStore.getState().theme).toBe('rdr')
    vi.advanceTimersByTime(600)
    expect(useThemeStore.getState().theme).toBe('gta')
    vi.advanceTimersByTime(700)
    expect(useThemeStore.getState().switching).toBeNull()
  })

  it('ignores a second switch while one is running', () => {
    useThemeStore.getState().switchTheme()
    useThemeStore.getState().switchTheme()
    vi.advanceTimersByTime(1300)
    expect(useThemeStore.getState().theme).toBe('gta')
  })

  it('gives every theme the same set of copy keys', () => {
    expect(Object.keys(THEMES.gta.copy).sort()).toEqual(Object.keys(THEMES.rdr.copy).sort())
  })
})
