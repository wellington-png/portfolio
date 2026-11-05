export interface Controls {
  /** -1 (ré) .. 1 (frente) */
  throttle: number
  /** -1 (direita) .. 1 (esquerda) */
  steer: number
  brake: boolean
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function keysToControls(pressed: ReadonlySet<string>): Controls {
  const up = pressed.has('KeyW') || pressed.has('ArrowUp')
  const down = pressed.has('KeyS') || pressed.has('ArrowDown')
  const left = pressed.has('KeyA') || pressed.has('ArrowLeft')
  const right = pressed.has('KeyD') || pressed.has('ArrowRight')
  return {
    throttle: (up ? 1 : 0) - (down ? 1 : 0),
    steer: (left ? 1 : 0) - (right ? 1 : 0),
    brake: pressed.has('Space'),
  }
}

/** dx/dy em pixels a partir do centro do joystick; saída com magnitude <= 1. */
export function joystickVector(dx: number, dy: number, radius: number): { x: number; y: number } {
  const mag = Math.hypot(dx, dy)
  const scale = mag > radius ? radius / mag : 1
  return { x: (dx * scale) / radius, y: (dy * scale) / radius }
}

export function mergeControls(k: Controls, joystick: { x: number; y: number }): Controls {
  return {
    throttle: clamp(k.throttle - joystick.y, -1, 1),
    steer: clamp(k.steer - joystick.x, -1, 1),
    brake: k.brake,
  }
}

/** Estado mutável lido pelo loop de física (evita re-render do React). */
export const inputState = {
  keys: new Set<string>(),
  joystick: { x: 0, y: 0 },
  resetRequested: false,
}

export function getControls(): Controls {
  return mergeControls(keysToControls(inputState.keys), inputState.joystick)
}
