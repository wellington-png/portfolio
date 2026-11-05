import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { NeonMaterial } from '../world/NeonMaterial'
import type { ZoneDef } from './zoneLayout'

export function ContactPortal({ zone }: { zone: ZoneDef }) {
  const [x, z] = zone.position
  const inner = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (inner.current) inner.current.rotation.z += dt
  })

  return (
    <group position={[x, 0, z]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.4, 2.5, 0.4]} position={[-3, 2.5, 0]} />
        <CuboidCollider args={[0.4, 2.5, 0.4]} position={[3, 2.5, 0]} />
      </RigidBody>
      {[-3, 3].map((px) => (
        <mesh key={px} position={[px, 2.5, 0]}>
          <boxGeometry args={[0.8, 5, 0.8]} />
          <meshStandardMaterial color="#0b0b1c" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[6.8, 0.4, 0.8]} />
        <NeonMaterial color={zone.color} />
      </mesh>
      <mesh ref={inner} position={[0, 2.6, 0]}>
        <torusGeometry args={[1.8, 0.12, 12, 48]} />
        <NeonMaterial color={zone.color} intensity={3} />
      </mesh>
    </group>
  )
}
