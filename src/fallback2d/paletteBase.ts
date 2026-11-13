import type { ThemeId } from '../theme/themes'

/** Cor-base com que a paleta de cada capítulo é misturada, por tema. */
export const PALETTE_BASE: Record<ThemeId, { base: string; fundo: number; suave: number }> = {
  rdr: { base: '#070707', fundo: 0.88, suave: 0.72 },
  gta: { base: '#14102b', fundo: 0.84, suave: 0.68 },
  clean: { base: '#070707', fundo: 0.88, suave: 0.72 },
}
