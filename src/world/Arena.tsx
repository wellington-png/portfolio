import { Grid } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { ARENA_HALF } from '../zones/zoneLayout'
import { NeonMaterial } from './NeonMaterial'

const WALL_H = 4
const WALL_T = 1

const walls: { pos: [number, number, number]; size: [number, number, number] }[] = [
  { pos: [0, WALL_H / 2, -ARENA_HALF], size: [ARENA_HALF + WALL_T, WALL_H / 2, WALL_T / 2] },
  { pos: [0, WALL_H / 2, ARENA_HALF], size: [ARENA_HALF + WALL_T, WALL_H / 2, WALL_T / 2] },
  { pos: [-ARENA_HALF, WALL_H / 2, 0], size: [WALL_T / 2, WALL_H / 2, ARENA_HALF + WALL_T] },
  { pos: [ARENA_HALF, WALL_H / 2, 0], size: [WALL_T / 2, WALL_H / 2, ARENA_HALF + WALL_T] },
]

export function Arena() {
  return (
    <>
      {/* chão */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[200, 0.5, 200]} position={[0, -0.5, 0]} friction={0} />
      </RigidBody>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#07070f" roughness={0.9} />
      </mesh>
      <Grid
        position={[0, 0.02, 0]}
        args={[200, 200]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#1b2b6b"
        sectionSize={10}
        sectionThickness={1.2}
        sectionColor="#00f0ff"
        fadeDistance={110}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* paredes invisíveis + faixa neon baixa */}
      <RigidBody type="fixed" colliders={false}>
        {walls.map((w, i) => (
          <CuboidCollider key={i} args={w.size} position={w.pos} friction={0} />
        ))}
      </RigidBody>
      {walls.map((w, i) => (
        <mesh key={i} position={[w.pos[0], 0.3, w.pos[2]]}>
          <boxGeometry args={[w.size[0] * 2, 0.6, w.size[2] * 2]} />
          <NeonMaterial color="#ff2bd6" intensity={2} />
        </mesh>
      ))}
    </>
  )
}
