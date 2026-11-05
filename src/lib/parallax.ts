export interface Vec2 {
  x: number
  y: number
}

const clamp = (v: number) => Math.max(-1, Math.min(1, v))

/** pointer em [-1, 1] (coordenadas normalizadas do R3F) -> deslocamento em unidades do mundo. */
export function parallaxOffset(pointer: Vec2, strength: Vec2): Vec2 {
  return { x: clamp(pointer.x) * strength.x, y: clamp(pointer.y) * strength.y }
}
