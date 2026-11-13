import { detectFallbackReason, FALLBACK_MESSAGES } from './capabilities'

describe('detectFallbackReason', () => {
  it('returns null when motion is allowed', () => {
    expect(detectFallbackReason({ prefersReducedMotion: () => false })).toBeNull()
  })

  it('starts the quick version when the system asks for reduced motion', () => {
    expect(detectFallbackReason({ prefersReducedMotion: () => true })).toBe('reduced-motion')
    expect(FALLBACK_MESSAGES['reduced-motion']).toMatch(/versão rápida/)
  })
})
