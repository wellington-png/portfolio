import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { NeonMaterial } from '../world/NeonMaterial'
import type { ZoneDef } from './zoneLayout'

export function AboutKiosk({ zone }: { zone: ZoneDef }) {
  const [x, z] = zone.position
  const ring = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 1.2
  })

  return (
    <group position={[x, 0, z]}>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[1, 1.2]} position={[0, 1, 0]} />
      </RigidBody>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 2, 24]} />
        <meshStandardMaterial color="#0b0b1c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.05, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.6, 1.2, 32]} />
        <NeonMaterial color={zone.color} />
      </mesh>
      {/* holograma giratório */}
      <mesh ref={ring} position={[0, 3.6, 0]}>
        <torusKnotGeometry args={[0.8, 0.22, 96, 12]} />
        <NeonMaterial color={zone.color} intensity={3} />
      </mesh>
    </group>
  )
}
