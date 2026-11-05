import { useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { vehicleState } from '../vehicle/vehicleState'
import { zones } from '../zones/zoneLayout'
import { bearingTo, nearestUnvisited } from './guide'
import { useRaf } from './useRaf'

export function GuideArrow() {
  const arrow = useRef<HTMLSpanElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useRaf(() => {
    const { position, heading } = vehicleState
    const from = { x: position.x, z: position.z }
    const target = nearestUnvisited(from, zones, useGameStore.getState().visited)
    if (!target || !arrow.current || !label.current) {
      if (label.current) label.current.textContent = 'Tudo explorado!'
      if (arrow.current) arrow.current.style.visibility = 'hidden'
      return
    }
    const angle = bearingTo(from, heading, target.position)
    const dist = Math.round(Math.hypot(target.position[0] - from.x, target.position[1] - from.z))
    arrow.current.style.visibility = 'visible'
    arrow.current.style.transform = `rotate(${angle}rad)`
    label.current.textContent = `${target.label} · ${dist}m`
  })

  return (
    <div className="guide" aria-hidden="true">
      <span ref={arrow} className="guide-arrow">
        ▲
      </span>
      <span ref={label} />
    </div>
  )
}
