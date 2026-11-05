import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { NeonMaterial } from '../world/NeonMaterial'
import type { ZoneDef } from './zoneLayout'

const HEIGHT = 8

export function ProjectBuilding({ zone }: { zone: ZoneDef }) {
  const [x, z] = zone.position
  return (
    <group position={[x, 0, z]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[2.5, HEIGHT / 2, 2.5]} position={[0, HEIGHT / 2, 0]} />
      </RigidBody>
      <mesh position={[0, HEIGHT / 2, 0]}>
        <boxGeometry args={[5, HEIGHT, 5]} />
        <meshStandardMaterial color="#0b0b1c" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* arestas neon */}
      {[
        [-2.5, -2.5],
        [2.5, -2.5],
        [-2.5, 2.5],
        [2.5, 2.5],
      ].map(([cx, cz], i) => (
        <mesh key={i} position={[cx, HEIGHT / 2, cz]}>
          <boxGeometry args={[0.15, HEIGHT, 0.15]} />
          <NeonMaterial color={zone.color} />
        </mesh>
      ))}
      <mesh position={[0, HEIGHT + 0.15, 0]}>
        <boxGeometry args={[5.3, 0.3, 5.3]} />
        <NeonMaterial color={zone.color} intensity={3} />
      </mesh>
    </group>
  )
}
