import type { ZoneDef } from '../zones/zoneLayout'

/** Ângulo (rad) do alvo relativo à frente do carrinho; positivo = à direita. */
export function bearingTo(from: { x: number; z: number }, heading: number, target: [number, number]): number {
  const dx = target[0] - from.x
  const dz = target[1] - from.z
  const fx = -Math.sin(heading)
  const fz = -Math.cos(heading)
  const rx = Math.cos(heading)
  const rz = -Math.sin(heading)
  return Math.atan2(dx * rx + dz * rz, dx * fx + dz * fz)
}

export function nearestUnvisited(
  from: { x: number; z: number },
  zoneList: ZoneDef[],
  visited: string[],
): ZoneDef | undefined {
  let best: ZoneDef | undefined
  let bestDist = Infinity
  for (const z of zoneList) {
    if (visited.includes(z.id)) continue
    const d = Math.hypot(z.position[0] - from.x, z.position[1] - from.z)
    if (d < bestDist) {
      best = z
      bestDist = d
    }
  }
  return best
}
