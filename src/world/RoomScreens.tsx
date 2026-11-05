import { useMemo } from 'react'
import type { Project } from '../content'
import { useGameStore } from '../store/gameStore'
import { ImageScreen } from './ImageScreen'
import { screenPlacements } from './roomLayout'

export function RoomScreens({ project }: { project: Project }) {
  const focused = useGameStore((s) => s.focusedImage)
  const focusImage = useGameStore((s) => s.focusImage)
  const screens = useMemo(() => screenPlacements(project.images), [project])

  return (
    <>
      {/* fundo clicável: clicar fora de uma tela desfaz o foco */}
      <mesh position={[0, 0, -9]} onClick={() => focusImage(null)}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {screens.map((sp) => (
        <ImageScreen
          key={project.images[sp.index].src}
          image={project.images[sp.index]}
          placement={sp}
          color={project.color}
          focused={focused === sp.index}
          onSelect={() => focusImage(focused === sp.index ? null : sp.index)}
        />
      ))}
    </>
  )
}
