import { initialGameState, useGameStore } from './gameStore'

const s = () => useGameStore.getState()

describe('gameStore', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('starts in menu with nothing active', () => {
    expect(s().mode).toBe('menu')
    expect(s().activeZone).toBeNull()
    expect(s().panelOpen).toBe(false)
    expect(s().visited).toEqual([])
  })

  it('enterZone sets activeZone; leaveZone clears it and closes panel', () => {
    s().enterZone('about')
    expect(s().activeZone).toBe('about')
    s().openPanel()
    expect(s().panelOpen).toBe(true)
    s().leaveZone('about')
    expect(s().activeZone).toBeNull()
    expect(s().panelOpen).toBe(false)
  })

  it('leaveZone of a different zone is a no-op', () => {
    s().enterZone('about')
    s().leaveZone('skills')
    expect(s().activeZone).toBe('about')
  })

  it('openPanel needs an active zone and records visited once', () => {
    s().openPanel()
    expect(s().panelOpen).toBe(false)
    s().enterZone('about')
    s().openPanel()
    s().closePanel()
    s().openPanel()
    expect(s().visited).toEqual(['about'])
  })

  it('setMode stores notice and resets zone state', () => {
    s().enterZone('about')
    s().setMode('2d', 'aviso')
    expect(s().mode).toBe('2d')
    expect(s().notice).toBe('aviso')
    expect(s().activeZone).toBeNull()
    s().setMode('menu')
    expect(s().notice).toBeNull()
  })

  it('lowers and raises quality', () => {
    s().lowerQuality()
    expect(s().quality).toBe('medium')
    s().lowerQuality()
    s().lowerQuality()
    expect(s().quality).toBe('low')
    s().raiseQuality()
    expect(s().quality).toBe('medium')
  })
})
