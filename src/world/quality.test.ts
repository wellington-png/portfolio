import { lowerQuality, QUALITY_SETTINGS, raiseQuality } from './quality'

describe('quality', () => {
  it('lowers high -> medium -> low and stops at low', () => {
    expect(lowerQuality('high')).toBe('medium')
    expect(lowerQuality('medium')).toBe('low')
    expect(lowerQuality('low')).toBe('low')
  })

  it('raises low -> medium -> high and stops at high', () => {
    expect(raiseQuality('low')).toBe('medium')
    expect(raiseQuality('medium')).toBe('high')
    expect(raiseQuality('high')).toBe('high')
  })

  it('has progressively cheaper settings', () => {
    expect(QUALITY_SETTINGS.high.buildings).toBeGreaterThan(QUALITY_SETTINGS.medium.buildings)
    expect(QUALITY_SETTINGS.medium.buildings).toBeGreaterThan(QUALITY_SETTINGS.low.buildings)
    expect(QUALITY_SETTINGS.low.bloom).toBe(false)
    expect(QUALITY_SETTINGS.low.sparks).toBe(false)
    expect(QUALITY_SETTINGS.high.hoverPreview).toBe(true)
    expect(QUALITY_SETTINGS.medium.hoverPreview).toBe(true)
    expect(QUALITY_SETTINGS.low.hoverPreview).toBe(false)
  })
})
