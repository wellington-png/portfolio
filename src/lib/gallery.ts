/** Próximo índice de imagem (circular). `current` null = nenhuma em foco ainda. */
export function stepIndex(current: number | null, delta: 1 | -1, count: number): number | null {
  if (count <= 0) return null
  if (current === null) return delta > 0 ? 0 : count - 1
  return (current + delta + count) % count
}
