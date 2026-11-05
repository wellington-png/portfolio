import { Grid } from '@react-three/drei'
import { useMemo } from 'react'
import { Color } from 'three'
import type { Project } from '../content'
import { ROOM_FLOOR_Y } from './roomLayout'

/** Sala temática do projeto, em coordenadas locais do portal. */
export function ProjectRoom({ project }: { project: Project }) {
  const bg = useMemo(() => `#${new Color(project.color).multiplyScalar(0.07).getHexString()}`, [project.color])

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
    </>
  )
}
