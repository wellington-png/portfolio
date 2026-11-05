import { Image, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState } from 'react'
import type { Group } from 'three'
import type { ProjectImage } from '../content'
import { NeonMaterial } from './NeonMaterial'
import type { ScreenPlacement } from './roomLayout'
import { TextureBoundary } from './TextureBoundary'

interface Props {
  image: ProjectImage
  placement: ScreenPlacement
  color: string
  focused: boolean
  onSelect: () => void
}

export function ImageScreen({ image, placement, color, focused, onSelect }: Props) {
  const { width, height, kind, position, rotationY, index } = placement
  const [hovered, setHovered] = useState(false)
  const bob = useRef<Group>(null)
  const zoom = useRef<Group>(null)
  useCursor(hovered)

  useFrame(({ clock }, dt) => {
    if (bob.current) bob.current.position.y = Math.sin(clock.elapsedTime * 0.8 + index) * 0.05
    if (zoom.current) {
      const k = hovered && !focused ? 1.04 : 1
      easing.damp3(zoom.current.scale, [k, k, k], 0.15, dt)
    }
  })

  const pad = kind === 'mobile' ? 0.14 : 0.1

  return (
    <group position={position} rotation-y={rotationY}>
      <group ref={bob}>
        <group ref={zoom}>
          {/* borda neon + corpo escuro (monitor ou telefone) */}
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[width + pad * 2 + 0.08, height + pad * 2 + 0.08, 0.04]} />
            <NeonMaterial color={color} intensity={focused ? 3.5 : 2} />
          </mesh>
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[width + pad * 2, height + pad * 2, 0.08]} />
            <meshStandardMaterial color="#0a0a16" metalness={0.6} roughness={0.35} />
          </mesh>

          <TextureBoundary
            fallback={
              <mesh>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color="#10102a" />
              </mesh>
            }
          >
            <Image
              url={image.src}
              scale={[width, height]}
              radius={kind === 'mobile' ? 0.08 : 0.02}
              toneMapped={false}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
              }}
              onPointerOut={() => setHovered(false)}
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            />
          </TextureBoundary>
        </group>
      </group>
    </group>
  )
}
