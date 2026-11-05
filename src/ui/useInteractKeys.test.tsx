import { renderHook } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { initialGameState, useGameStore } from '../store/gameStore'
import { useInteractKeys } from './useInteractKeys'

describe('useInteractKeys', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('E opens the panel only inside a zone', () => {
    renderHook(() => useInteractKeys())
    fireEvent.keyDown(window, { code: 'KeyE' })
    expect(useGameStore.getState().panelOpen).toBe(false)
    useGameStore.getState().enterZone('about')
    fireEvent.keyDown(window, { code: 'KeyE' })
    expect(useGameStore.getState().panelOpen).toBe(true)
  })

  it('Escape closes the panel', () => {
    renderHook(() => useInteractKeys())
    useGameStore.getState().enterZone('about')
    useGameStore.getState().openPanel()
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(useGameStore.getState().panelOpen).toBe(false)
  })
})
