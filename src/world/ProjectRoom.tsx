import { Grid, Sparkles } from '@react-three/drei'
import { useMemo } from 'react'
import { Color } from 'three'
import type { Project } from '../content'
import { useGameStore } from '../store/gameStore'
import { QUALITY_SETTINGS } from './quality'
import { ROOM_FLOOR_Y } from './roomLayout'
import { RoomScreens } from './RoomScreens'

/** Sala temática do projeto, em coordenadas locais do portal. */
export function ProjectRoom({ project }: { project: Project }) {
  const bg = useMemo(() => `#${new Color(project.color).multiplyScalar(0.07).getHexString()}`, [project.color])
  const sparks = useGameStore((s) => QUALITY_SETTINGS[s.quality].sparks)

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 10, 34]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 3, -2]} intensity={25} distance={24} color={project.color} />
      <Grid
        position={[0, ROOM_FLOOR_Y, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1b2b6b"
        sectionSize={4}
        sectionThickness={1.2}
        sectionColor={project.color}
        fadeDistance={30}
        fadeStrength={1.2}
        infiniteGrid
      />
      <RoomScreens project={project} />
      {sparks && <Sparkles count={60} scale={[14, 5, 10]} position={[0, 0.5, -4]} size={3} speed={0.25} color={project.color} />}
    </>
  )
}
