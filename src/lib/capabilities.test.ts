import { detectFallbackReason, FALLBACK_MESSAGES, type Env } from './capabilities'

const env = (hasWebGL: boolean, reduced: boolean): Env => ({
  hasWebGL: () => hasWebGL,
  prefersReducedMotion: () => reduced,
})

describe('detectFallbackReason', () => {
  it('returns null when 3D can run', () => {
    expect(detectFallbackReason(env(true, false))).toBeNull()
  })
  it('returns no-webgl first', () => {
    expect(detectFallbackReason(env(false, true))).toBe('no-webgl')
  })
  it('returns reduced-motion when webgl exists', () => {
    expect(detectFallbackReason(env(true, true))).toBe('reduced-motion')
  })
  it('has a message for each reason', () => {
    expect(FALLBACK_MESSAGES['no-webgl']).toBeTruthy()
    expect(FALLBACK_MESSAGES['reduced-motion']).toBeTruthy()
  })
})
