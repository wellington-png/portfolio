/** Geometria da roda de itens. Ângulos em graus: 0 = topo, crescendo no sentido horário. */

export function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/** Fatia `index` de `count`, centrada em index * 360 / count, com uma folga `gap` entre fatias. */
export function wedgeAngles(count: number, index: number, gap = 3): { start: number; end: number; mid: number } {
  const size = 360 / count
  const mid = index * size
  return { start: mid - size / 2 + gap / 2, end: mid + size / 2 - gap / 2, mid }
}

/** Caminho SVG de um setor de anel entre os raios r0 (interno) e r1 (externo). */
export function wedgePath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const large = a1 - a0 > 180 ? 1 : 0
  const p = (r: number, a: number) => polar(cx, cy, r, a)
  const o0 = p(r1, a0)
  const o1 = p(r1, a1)
  const i1 = p(r0, a1)
  const i0 = p(r0, a0)
  const f = (n: number) => n.toFixed(2)
  return `M${f(o0.x)} ${f(o0.y)} A${r1} ${r1} 0 ${large} 1 ${f(o1.x)} ${f(o1.y)} L${f(i1.x)} ${f(i1.y)} A${r0} ${r0} 0 ${large} 0 ${f(i0.x)} ${f(i0.y)}Z`
}
