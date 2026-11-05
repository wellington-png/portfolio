export type FallbackReason = 'no-webgl' | 'reduced-motion'

export interface Env {
  hasWebGL: () => boolean
  prefersReducedMotion: () => boolean
}

export const browserEnv: Env = {
  hasWebGL: () => {
    try {
      const c = document.createElement('canvas')
      return !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
      return false
    }
  },
  prefersReducedMotion: () =>
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
}

export function detectFallbackReason(env: Env = browserEnv): FallbackReason | null {
  if (!env.hasWebGL()) return 'no-webgl'
  if (env.prefersReducedMotion()) return 'reduced-motion'
  return null
}

export const FALLBACK_MESSAGES: Record<FallbackReason, string> = {
  'no-webgl': 'Seu dispositivo não suporta WebGL, então você está vendo a versão rápida.',
  'reduced-motion': 'Movimento reduzido ativo no seu sistema: mostrando a versão rápida.',
}
