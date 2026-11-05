import { useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { vehicleState } from '../vehicle/vehicleState'
import { ARENA_HALF, zones } from '../zones/zoneLayout'
import { useRaf } from './useRaf'

export function Minimap() {
  const car = useRef<SVGPolygonElement>(null)
  const visited = useGameStore((s) => s.visited)

  useRaf(() => {
    const { position, heading } = vehicleState
    car.current?.setAttribute(
      'transform',
      `translate(${position.x} ${position.z}) rotate(${(-heading * 180) / Math.PI})`,
    )
  })

  const half = ARENA_HALF + 2
  return (
    <svg className="minimap" viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`} role="img" aria-label="Minimapa">
      <rect x={-ARENA_HALF} y={-ARENA_HALF} width={ARENA_HALF * 2} height={ARENA_HALF * 2} className="minimap-arena" />
      {zones.map((z) => (
        <circle
          key={z.id}
          cx={z.position[0]}
          cy={z.position[1]}
          r={3.5}
          fill={z.color}
          opacity={visited.includes(z.id) ? 0.35 : 1}
        />
      ))}
      <polygon ref={car} points="0,-4 3,3 -3,3" className="minimap-car" />
    </svg>
  )
}
