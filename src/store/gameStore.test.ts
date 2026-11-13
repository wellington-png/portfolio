import { projects, stepsOf } from '../content'
import { initialGameState, useGameStore } from './gameStore'

const s = () => useGameStore.getState()

describe('gameStore (launcher)', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('starts on the menu, on the shelf, with the first project selected', () => {
    expect(s().mode).toBe('menu')
    expect(s().view).toBe('shelf')
    expect(s().selected).toBe(0)
  })

  it('setMode resets the tour and closes panels but keeps the choice and achievements', () => {
    s().select(2)
    s().unlock(projects[2].id, 0)
    s().openTour()
    s().openPanel('about')
    s().setMode('play', 'oi')
    expect(s()).toMatchObject({ mode: 'play', notice: 'oi', panel: null, view: 'shelf', step: 0, region: 0 })
    expect(s().selected).toBe(2)
    expect(s().unlocked[projects[2].id]).toEqual([0])
  })

  it('selection wraps around the shelf', () => {
    s().moveSelection(-1)
    expect(s().selected).toBe(projects.length - 1)
    s().moveSelection(1)
    expect(s().selected).toBe(0)
    s().select(projects.length + 1)
    expect(s().selected).toBe(1)
  })

  it('opens and closes the tour', () => {
    s().openTour()
    expect(s()).toMatchObject({ view: 'tour', step: 0, region: 0, playing: true })
    s().closeTour()
    expect(s().view).toBe('shelf')
  })

  it('steps and regions stay inside their bounds', () => {
    s().openTour()
    const steps = stepsOf(projects[0])
    s().moveStep(-1)
    expect(s().step).toBe(0)
    s().goStep(99)
    expect(s().step).toBe(steps.length - 1)
    s().moveRegion(1)
    s().moveRegion(1)
    s().moveRegion(1)
    s().moveRegion(1)
    s().moveRegion(1)
    expect(s().region).toBe(steps[s().step].focuses.length - 1)
    s().moveRegion(-1)
    s().moveRegion(-1)
    s().moveRegion(-1)
    s().moveRegion(-1)
    s().moveRegion(-1)
    expect(s().region).toBe(0)
  })

  it('advance walks every region of every step and then stops playing', () => {
    s().openTour()
    const steps = stepsOf(projects[0])
    const total = steps.reduce((n, st) => n + st.focuses.length, 0)
    for (let i = 0; i < total - 1; i++) s().advance()
    expect(s().step).toBe(steps.length - 1)
    expect(s().region).toBe(steps[steps.length - 1].focuses.length - 1)
    expect(s().playing).toBe(true)
    s().advance()
    expect(s().playing).toBe(false)
  })

  it('unlock records each screen once', () => {
    s().unlock('barbuz', 1)
    s().unlock('barbuz', 1)
    s().unlock('barbuz', 0)
    expect(s().unlocked.barbuz).toEqual([1, 0])
  })

  it('toggles playing and panels', () => {
    s().togglePlaying()
    expect(s().playing).toBe(false)
    s().openPanel('skills')
    expect(s().panel).toBe('skills')
    s().closePanel()
    expect(s().panel).toBeNull()
  })
})
