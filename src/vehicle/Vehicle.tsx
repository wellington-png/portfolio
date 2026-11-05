import { Trail } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { Quaternion, Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'
import { NeonMaterial } from '../world/NeonMaterial'
import { QUALITY_SETTINGS } from '../world/quality'
import { spawnPoint } from '../zones/zoneLayout'
import { getControls, inputState } from './input'
import { brakeImpulse, driveForce, lateralImpulse, yawRate } from './physics'
import { vehicleState } from './vehicleState'

const q = new Quaternion()
const fwd = new Vector3()
const right = new Vector3()

export function Vehicle() {
  const body = useRef<RapierRigidBody>(null)
  const lastSafe = useRef(new Vector3(...spawnPoint))
  const lastSafeAt = useRef(0)
  const quality = useGameStore((s) => s.quality)
  const trails = QUALITY_SETTINGS[quality].trails

  useFrame((state, delta) => {
    const b = body.current
    if (!b) return
    const dt = Math.min(delta, 1 / 30)
    const t = b.translation()
    const r = b.rotation()
    const v = b.linvel()

    q.set(r.x, r.y, r.z, r.w)
    fwd.set(0, 0, -1).applyQuaternion(q)
    right.set(1, 0, 0).applyQuaternion(q)
    const speed = v.x * fwd.x + v.z * fwd.z
    const lateral = v.x * right.x + v.z * right.z

    // Reset manual (R) ou queda do mapa
    if (inputState.resetRequested || t.y < -5) {
      inputState.resetRequested = false
      b.setTranslation(lastSafe.current, true)
      b.setLinvel({ x: 0, y: 0, z: 0 }, true)
      b.setAngvel({ x: 0, y: 0, z: 0 }, true)
      b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
      return
    }

    // Ignora o input enquanto um painel está aberto
    const c = useGameStore.getState().panelOpen ? { throttle: 0, steer: 0, brake: true } : getControls()

    let along = driveForce(c.throttle, speed) * dt
    if (c.brake) along += brakeImpulse(speed, dt)
    const side = lateralImpulse(lateral, c.brake, dt)
    b.applyImpulse(
      { x: fwd.x * along + right.x * side, y: 0, z: fwd.z * along + right.z * side },
      true,
    )
    b.setAngvel({ x: 0, y: yawRate(c.steer, speed), z: 0 }, true)

    // Memoriza o último ponto seguro (no chão, a cada 1s)
    if (t.y < 1.2 && state.clock.elapsedTime - lastSafeAt.current > 1) {
      lastSafe.current.set(t.x, 1, t.z)
      lastSafeAt.current = state.clock.elapsedTime
    }

    vehicleState.position.set(t.x, t.y, t.z)
    vehicleState.heading = Math.atan2(-fwd.x, -fwd.z)
    vehicleState.speed = speed
    vehicleState.lateral = lateral
  })

  const rear = (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  )

  return (
    <RigidBody
      ref={body}
      name="vehicle"
      position={spawnPoint}
      colliders={false}
      enabledRotations={[false, true, false]}
      linearDamping={0.3}
      canSleep={false}
    >
      <CuboidCollider args={[0.9, 0.35, 1.5]} position={[0, 0.35, 0]} mass={1} friction={0} />
      {/* carroceria */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.5, 3]} />
        <meshStandardMaterial color="#12122a" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.8, 0.2]}>
        <boxGeometry args={[1.4, 0.4, 1.4]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* faixa neon lateral */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.9, 0.08, 2.6]} />
        <NeonMaterial color="#00f0ff" />
      </mesh>
      {/* faróis */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.5, -1.5]}>
          <boxGeometry args={[0.35, 0.15, 0.1]} />
          <NeonMaterial color="#ffffff" intensity={3} />
        </mesh>
      ))}
      <pointLight position={[0, 0.6, -2.2]} intensity={6} distance={14} color="#9fe8ff" />
      {/* rodas visuais */}
      {[
        [-0.95, 0.3, -1],
        [0.95, 0.3, -1],
        [-0.95, 0.3, 1],
        [0.95, 0.3, 1],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 0.3, 16]} />
          <meshStandardMaterial color="#05050a" />
        </mesh>
      ))}
      {/* rastro de luz atrás do carrinho */}
      {trails && (
        <Trail width={1.4} length={6} color="#00f0ff" attenuation={(w) => w * w}>
          <group position={[0, 0.25, 1.6]}>{rear}</group>
        </Trail>
      )}
    </RigidBody>
  )
}
