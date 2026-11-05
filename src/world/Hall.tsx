import { Grid, Sparkles, useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import { projects } from '../content'
import { useGameStore } from '../store/gameStore'
import { portalPlacements } from './hallLayout'
import { PortalFrame } from './PortalFrame'
import { QUALITY_SETTINGS } from './quality'
import { TextureBoundary } from './TextureBoundary'

const ALL_SRCS = projects.flatMap((p) => p.images.map((i) => i.src))

/** Mantém a textura em cache; assim a sala não "suspende" a cena quando abre. */
function TextureWarm({ src }: { src: string }) {
  useTexture(src)
  return null
}

export function Hall() {
  const quality = useGameStore((s) => s.quality)
  const placements = useMemo(() => portalPlacements(projects.length), [])

  return (
    <>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#07070f" roughness={0.85} metalness={0.2} />
      </mesh>
      <Grid
        position={[0, 0.01, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1b2b6b"
        sectionSize={5}
        sectionThickness={1.1}
        sectionColor="#00f0ff"
        fadeDistance={40}
        fadeStrength={1.5}
        infiniteGrid
      />

      {projects.map((p, i) => (
        <group key={p.id}>
          <PortalFrame project={p} placement={placements[i]} />
          <pointLight
            position={[placements[i].position[0], 2.4, placements[i].position[2] + 2.2]}
            intensity={6}
            distance={9}
            color={p.color}
          />
        </group>
      ))}

      {QUALITY_SETTINGS[quality].sparks && (
        <Sparkles count={80} scale={[16, 6, 10]} position={[0, 3, -3]} size={3} speed={0.3} color="#7fdcff" />
      )}

      {ALL_SRCS.map((src) => (
        <TextureBoundary key={src} fallback={null}>
          <TextureWarm src={src} />
        </TextureBoundary>
      ))}
    </>
  )
}
