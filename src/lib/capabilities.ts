export type FallbackReason = 'reduced-motion'

export interface Env {
  prefersReducedMotion: () => boolean
}

export const browserEnv: Env = {
  prefersReducedMotion: () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
}

/** Quem pede menos movimento começa na versão rápida; o launcher não exige WebGL. */
export function detectFallbackReason(env: Env = browserEnv): FallbackReason | null {
  return env.prefersReducedMotion() ? 'reduced-motion' : null
}

export const FALLBACK_MESSAGES: Record<FallbackReason, string> = {
  'reduced-motion': 'Movimento reduzido ativo no seu sistema: mostrando a versão rápida.',
}
