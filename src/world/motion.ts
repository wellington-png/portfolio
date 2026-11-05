import { browserEnv } from '../lib/capabilities'

/** Tempo de suavização (s) das animações; ~instantâneo com movimento reduzido. */
export const SMOOTH = browserEnv.prefersReducedMotion() ? 0.001 : 0.25
