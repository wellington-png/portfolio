import { fireEvent, renderHook } from '@testing-library/react'
import { projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { handleKey, useLauncherKeys } from './launcherKeys'

const s = () => useGameStore.getState()

describe('launcher keys', () => {
  beforeEach(() => useGameStore.setState({ ...initialGameState, mode: 'play' }))

  it('shelf: arrows choose, digits jump and Enter opens the tour', () => {
    handleKey('ArrowRight')
    expect(s().selected).toBe(1)
    handleKey('ArrowLeft')
    handleKey('ArrowLeft')
    expect(s().selected).toBe(projects.length - 1)
    handleKey('Digit2')
    expect(s().selected).toBe(1)
    handleKey('Enter')
    expect(s().view).toBe('tour')
  })

  it('tour: arrows move screens and regions, Space pauses, Esc goes back one level', () => {
    s().openTour()
    handleKey('ArrowRight')
    expect(s().step).toBe(1)
    handleKey('ArrowLeft')
    expect(s().step).toBe(0)
    handleKey('ArrowDown')
    expect(s().region).toBe(1)
    handleKey('ArrowUp')
    expect(s().region).toBe(0)
    handleKey('Space')
    expect(s().playing).toBe(false)
    handleKey('Escape')
    expect(s().view).toBe('shelf')
    handleKey('Escape')
    expect(s().mode).toBe('menu')
  })

  it('A, S and C open the panels and Esc closes a panel first', () => {
    handleKey('KeyA')
    expect(s().panel).toBe('about')
    expect(handleKey('ArrowRight')).toBe(true)
    expect(s().panel).toBe('skills')
    expect(handleKey('ArrowLeft')).toBe(true)
    expect(handleKey('ArrowLeft')).toBe(true)
    expect(s().panel).toBe('contact')
    expect(s().selected).toBe(0)
    expect(handleKey('ArrowDown')).toBe(false)
    s().openPanel('about')
    handleKey('Escape')
    expect(s().panel).toBeNull()
    expect(s().mode).toBe('play')
    handleKey('KeyS')
    expect(s().panel).toBe('skills')
    handleKey('Escape')
    handleKey('KeyC')
    expect(s().panel).toBe('contact')
  })

  it('the window listener ignores typing fields, modifiers and focused buttons', () => {
    renderHook(() => useLauncherKeys())
    const input = document.createElement('input')
    document.body.appendChild(input)
    fireEvent.keyDown(input, { code: 'ArrowRight' })
    expect(s().selected).toBe(0)
    input.remove()
    fireEvent.keyDown(window, { code: 'ArrowRight', ctrlKey: true })
    expect(s().selected).toBe(0)
    const btn = document.createElement('button')
    document.body.appendChild(btn)
    fireEvent.keyDown(btn, { code: 'Enter' })
    expect(s().view).toBe('shelf')
    btn.remove()
    fireEvent.keyDown(window, { code: 'ArrowRight' })
    expect(s().selected).toBe(1)
  })
})
