import { useRef, useState } from 'react'
import { inputState, joystickVector } from '../vehicle/input'

const RADIUS = 50

export function JoystickPad() {
  const [isTouch] = useState(
    () => typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches,
  )
  const base = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)
  const active = useRef(false)

  if (!isTouch) return null

  const move = (clientX: number, clientY: number) => {
    const rect = base.current!.getBoundingClientRect()
    const dx = clientX - (rect.left + rect.width / 2)
    const dy = clientY - (rect.top + rect.height / 2)
    const v = joystickVector(dx, dy, RADIUS)
    inputState.joystick = v
    if (knob.current) knob.current.style.transform = `translate(${v.x * RADIUS}px, ${v.y * RADIUS}px)`
  }
  const release = () => {
    active.current = false
    inputState.joystick = { x: 0, y: 0 }
    if (knob.current) knob.current.style.transform = 'translate(0,0)'
  }

  return (
    <div
      ref={base}
      className="joystick"
      onPointerDown={(e) => {
        active.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => active.current && move(e.clientX, e.clientY)}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div ref={knob} className="joystick-knob" />
    </div>
  )
}
