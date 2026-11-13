export interface Palette {
  acento: string
  fundo: string
  suave: string
}

export const PARCHMENT = '#f1e3c2'

function channels(hex: string): number[] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Mistura a cor com a base do tema: amount 1 = base pura. */
function mix(hex: string, amount: number, baseHex: string): string {
  const base = channels(baseHex)
  const ch = channels(hex).map((c, i) => Math.round(c + (base[i] - c) * amount))
  return `#${ch.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

/** Paleta de um capítulo a partir da cor do projeto, em tons de papel envelhecido. */
export function paletteOf(color: string, base: string = PARCHMENT, fundo = 0.82, suave = 0.6): Palette {
  return { acento: color, fundo: mix(color, fundo, base), suave: mix(color, suave, base) }
}

/** Título curto de uma tela: tira o prefixo "Projeto: " do texto alternativo. */
export function stepTitle(alt: string): string {
  const text = alt.includes(': ') ? alt.slice(alt.indexOf(': ') + 2) : alt
  return text.charAt(0).toUpperCase() + text.slice(1)
}
