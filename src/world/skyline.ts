export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Building {
  x: number
  z: number
  w: number
  h: number
  d: number
  neon: string
}

const NEON = ['#00f0ff', '#ff2bd6', '#9d4dff', '#39ff88']

/** Prédios de fundo, sempre fora da arena (Chebyshev >= 58). */
export function generateSkyline(count: number, seed = 7): Building[] {
  const rnd = mulberry32(seed)
  const out: Building[] = []
  while (out.length < count) {
    const x = (rnd() * 2 - 1) * 130
    const z = (rnd() * 2 - 1) * 130
    if (Math.max(Math.abs(x), Math.abs(z)) < 58) continue
    out.push({
      x,
      z,
      w: 6 + rnd() * 6,
      h: 15 + rnd() * 45,
      d: 6 + rnd() * 6,
      neon: NEON[Math.floor(rnd() * NEON.length)],
    })
  }
  return out
}
