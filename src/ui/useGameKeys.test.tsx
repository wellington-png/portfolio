import { fireEvent, renderHook } from '@testing-library/react'
import { projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { useGameKeys } from './useGameKeys'

const s = () => useGameStore.getState()
const inRoom = () => useGameStore.setState({ ...initialGameState, phase: 'room', activeProject: projects[0].id })

describe('useGameKeys', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('Escape closes a panel first', () => {
    renderHook(() => useGameKeys())
    useGameStore.setState({ panel: 'about' })
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(s().panel).toBeNull()
  })

  it('Escape then unfocuses the image, then leaves the project', () => {
    renderHook(() => useGameKeys())
    inRoom()
    s().focusImage(1)
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(s().focusedImage).toBeNull()
    expect(s().phase).toBe('room')
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(s().phase).toBe('leaving')
  })

  it('arrows step through the project images only in the room', () => {
    renderHook(() => useGameKeys())
    fireEvent.keyDown(window, { code: 'ArrowRight' })
    expect(s().focusedImage).toBeNull()
    inRoom()
    fireEvent.keyDown(window, { code: 'ArrowRight' })
    expect(s().focusedImage).toBe(0)
    fireEvent.keyDown(window, { code: 'ArrowLeft' })
    expect(s().focusedImage).toBe(projects[0].images.length - 1)
  })
})
