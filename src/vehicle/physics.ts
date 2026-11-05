export interface DriveParams {
  engine: number
  reverse: number
  maxSpeed: number
  maxReverse: number
  steer: number
  grip: number
  brakeGrip: number
}

/** Valores de "feeling" do carrinho — ajuste aqui. Massa efetiva = 1, então força == aceleração (m/s²). */
export const DRIVE: DriveParams = {
  engine: 30,
  reverse: 18,
  maxSpeed: 24,
  maxReverse: 8,
  steer: 2.4,
  grip: 5,
  brakeGrip: 1,
}

/** Aceleração ao longo do eixo frontal. `speed` é a velocidade frontal atual. */
export function driveForce(throttle: number, speed: number, p: DriveParams = DRIVE): number {
  if (throttle > 0) return speed >= p.maxSpeed ? 0 : throttle * p.engine
  if (throttle < 0) return speed <= -p.maxReverse ? 0 : throttle * p.reverse
  return 0
}

/** Velocidade angular em Y. Só gira quando está em movimento; inverte em ré. */
export function yawRate(steer: number, speed: number, p: DriveParams = DRIVE): number {
  const factor = Math.min(Math.abs(speed) / 6, 1)
  const dir = speed >= 0 ? 1 : -1
  return steer * p.steer * factor * dir
}

/** Variação de velocidade lateral por frame que mata a derrapagem (menos grip = derrapa mais). */
export function lateralImpulse(lateralSpeed: number, brake: boolean, dt: number, p: DriveParams = DRIVE): number {
  const grip = brake ? p.brakeGrip : p.grip
  return -lateralSpeed * Math.min(grip * dt, 1)
}

/** Freio de mão: reduz a velocidade frontal. */
export function brakeImpulse(speed: number, dt: number): number {
  return -speed * Math.min(3 * dt, 1)
}

/** Posição da câmera atrás e acima do carrinho. heading: rotação em Y (0 = olhando para -z). */
export function followPosition(
  pos: { x: number; y: number; z: number },
  heading: number,
  distance: number,
  height: number,
) {
  return {
    x: pos.x + Math.sin(heading) * distance,
    y: pos.y + height,
    z: pos.z + Math.cos(heading) * distance,
  }
}
