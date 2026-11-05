import { initialGameState, useGameStore } from './gameStore'

const s = () => useGameStore.getState()

describe('gameStore', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('starts in the menu, in the hub, with nothing active', () => {
    expect(s().mode).toBe('menu')
    expect(s().phase).toBe('hub')
    expect(s().activeProject).toBeNull()
    expect(s().hoveredProject).toBeNull()
    expect(s().focusedImage).toBeNull()
    expect(s().panel).toBeNull()
    expect(s().visited).toEqual([])
  })

  it('hoverProject only works in the hub', () => {
    s().hoverProject('barbuz')
    expect(s().hoveredProject).toBe('barbuz')
    s().hoverProject(null)
    useGameStore.setState({ phase: 'room' })
    s().hoverProject('occlo')
    expect(s().hoveredProject).toBeNull()
  })

  it('enterProject starts the dive and records the project as visited once', () => {
    s().hoverProject('barbuz')
    s().enterProject('barbuz')
    expect(s().phase).toBe('entering')
    expect(s().activeProject).toBe('barbuz')
    expect(s().hoveredProject).toBeNull()
    expect(s().focusedImage).toBeNull()
    expect(s().visited).toEqual(['barbuz'])
    useGameStore.setState({ phase: 'hub', activeProject: null })
    s().enterProject('barbuz')
    expect(s().visited).toEqual(['barbuz'])
  })

  it('enterProject is ignored outside the hub or with a panel open', () => {
    useGameStore.setState({ phase: 'room' })
    s().enterProject('occlo')
    expect(s().activeProject).toBeNull()
    useGameStore.setState({ phase: 'hub', panel: 'about' })
    s().enterProject('occlo')
    expect(s().activeProject).toBeNull()
  })

  it('finishEnter goes entering -> room only', () => {
    s().finishEnter()
    expect(s().phase).toBe('hub')
    s().enterProject('barbuz')
    s().finishEnter()
    expect(s().phase).toBe('room')
  })

  it('leaveProject only works from the room and clears the image focus', () => {
    s().enterProject('barbuz')
    s().leaveProject()
    expect(s().phase).toBe('entering')
    s().finishEnter()
    s().focusImage(2)
    s().leaveProject()
    expect(s().phase).toBe('leaving')
    expect(s().focusedImage).toBeNull()
  })

  it('finishLeave returns to the hub and clears the active project', () => {
    s().enterProject('barbuz')
    s().finishEnter()
    s().leaveProject()
    s().finishLeave()
    expect(s().phase).toBe('hub')
    expect(s().activeProject).toBeNull()
  })

  it('focusImage and stepImage only work in the room', () => {
    s().focusImage(1)
    s().stepImage(1, 4)
    expect(s().focusedImage).toBeNull()
    s().enterProject('barbuz')
    s().finishEnter()
    s().stepImage(1, 4)
    expect(s().focusedImage).toBe(0)
    s().stepImage(-1, 4)
    expect(s().focusedImage).toBe(3)
    s().focusImage(null)
    expect(s().focusedImage).toBeNull()
  })

  it('openPanel only works in the hub; closePanel clears it', () => {
    s().hoverProject('barbuz')
    s().openPanel('skills')
    expect(s().panel).toBe('skills')
    expect(s().hoveredProject).toBeNull()
    s().closePanel()
    expect(s().panel).toBeNull()
    useGameStore.setState({ phase: 'room' })
    s().openPanel('about')
    expect(s().panel).toBeNull()
  })

  it('setMode resets navigation and stores the notice', () => {
    s().enterProject('barbuz')
    s().setMode('2d', 'aviso')
    expect(s().mode).toBe('2d')
    expect(s().notice).toBe('aviso')
    expect(s().phase).toBe('hub')
    expect(s().activeProject).toBeNull()
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
    s().setQuality('high')
    expect(s().quality).toBe('high')
  })
})
