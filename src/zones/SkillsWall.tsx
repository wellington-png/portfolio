import { Html } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { skillGroups } from '../content'
import { NeonMaterial } from '../world/NeonMaterial'
import type { ZoneDef } from './zoneLayout'

const COLORS = ['#39ff88', '#00f0ff', '#ff2bd6', '#9d4dff']
const COLS = 3
const GAP = 1.8

export function SkillsWall({ zone }: { zone: ZoneDef }) {
  const [x, z] = zone.position
  const skills = skillGroups.flatMap((g, gi) => g.skills.map((s) => ({ ...s, color: COLORS[gi % COLORS.length] })))

  return (
    <group>
      {skills.map((s, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const px = x + (col - (COLS - 1) / 2) * GAP
        const pz = z - 3 + row * GAP
        return (
          <RigidBody key={s.name} name="skill" position={[px, 0.7, pz]} colliders="cuboid" linearDamping={0.8} angularDamping={0.8}>
            <mesh>
              <boxGeometry args={[1.3, 1.3, 1.3]} />
              <NeonMaterial color={s.color} intensity={1.6} />
            </mesh>
            <Html center distanceFactor={9} position={[0, 0, 0.7]} zIndexRange={[4, 0]}>
              <span className="skill-icon" title={s.name}>
                {s.icon}
              </span>
            </Html>
          </RigidBody>
        )
      })}
    </group>
  )
}
