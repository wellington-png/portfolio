import { Html, Image, MeshPortalMaterial, useCursor } from '@react-three/drei'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { easing } from 'maath'
import { useCallback, useRef } from 'react'
import { DoubleSide, type Group } from 'three'
import { coverOf, type Project } from '../content'
import { useGameStore } from '../store/gameStore'
import { PORTAL_HEIGHT as H, PORTAL_WIDTH as W, type PortalPlacement } from './hallLayout'
import { SMOOTH } from './motion'
import { NeonMaterial } from './NeonMaterial'
import { registerPortal } from './portalRegistry'
import { ProjectRoom } from './ProjectRoom'
import { QUALITY_SETTINGS } from './quality'
import { TextureBoundary } from './TextureBoundary'

const BAR = 0.12

interface Props {
  project: Project
  placement: PortalPlacement
}

export function PortalFrame({ project, placement }: Props) {
  const hovered = useGameStore((s) => s.hoveredProject === project.id)
  const active = useGameStore((s) => s.activeProject === project.id)
  const visited = useGameStore((s) => s.visited.includes(project.id))
  const phase = useGameStore((s) => s.phase)
  const hoverPreview = useGameStore((s) => QUALITY_SETTINGS[s.quality].hoverPreview)
  const hoverProject = useGameStore((s) => s.hoverProject)
  const enterProject = useGameStore((s) => s.enterProject)
  const inner = useRef<Group>(null)
  const portal = useRef<ThreeElements['portalMaterialImpl']>(null)
  const anchor = useCallback((o: Group | null) => registerPortal(project.id, o), [project.id])

  // sala viva só no portal em hover ou em uso (limite de GPU)
  const live = active || (hovered && hoverPreview)

  useCursor(hovered && phase === 'hub')

  useFrame((_, dt) => {
    if (inner.current) {
      const k = hovered ? 1.06 : 1
      easing.damp3(inner.current.scale, [k, k, k], 0.15, dt)
    }
    if (portal.current) {
      const s = useGameStore.getState()
      const target = s.activeProject === project.id && (s.phase === 'entering' || s.phase === 'room') ? 1 : 0
      easing.damp(portal.current, 'blend', target, SMOOTH, dt)
    }
  })

  const canInteract = () => {
    const s = useGameStore.getState()
    return s.phase === 'hub' && s.panel === null
  }

  return (
    <group ref={anchor} position={placement.position} rotation-y={placement.rotationY}>
      <group ref={inner}>
        {/* moldura neon */}
        <mesh position={[0, H / 2 + BAR / 2, 0]}>
          <boxGeometry args={[W + BAR * 2, BAR, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[0, -H / 2 - BAR / 2, 0]}>
          <boxGeometry args={[W + BAR * 2, BAR, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[-W / 2 - BAR / 2, 0, 0]}>
          <boxGeometry args={[BAR, H, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[W / 2 + BAR / 2, 0, 0]}>
          <boxGeometry args={[BAR, H, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>

        {/* superfície: sala viva (hover/uso) ou capa */}
        {live ? (
          <mesh>
            <planeGeometry args={[W, H]} />
            <MeshPortalMaterial ref={portal} events={active && phase !== 'leaving'} side={DoubleSide} blur={0} resolution={512}>
              <ProjectRoom project={project} />
            </MeshPortalMaterial>
          </mesh>
        ) : (
          <TextureBoundary
            fallback={
              <mesh>
                <planeGeometry args={[W, H]} />
                <meshBasicMaterial color="#10102a" />
              </mesh>
            }
          >
            <Image url={coverOf(project).src} scale={[W, H]} toneMapped={false} color="#9096b8" />
          </TextureBoundary>
        )}

        {/* área de clique estável (não troca com o hover) */}
        <mesh
          position={[0, 0, 0.05]}
          onPointerOver={(e) => {
            if (!canInteract()) return
            e.stopPropagation()
            hoverProject(project.id)
          }}
          onPointerOut={() => {
            if (useGameStore.getState().hoveredProject === project.id) hoverProject(null)
          }}
          onClick={(e) => {
            if (!canInteract()) return
            e.stopPropagation()
            enterProject(project.id)
          }}
        >
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <Html position={[0, H / 2 + 0.6, 0.1]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`portal-label${hovered ? ' hovered' : ''}`} style={{ color: project.color, borderColor: project.color }}>
            <strong>
              {visited ? '✓ ' : ''}
              {project.title}
            </strong>
            {hovered && <span>{project.tagline}</span>}
          </div>
        </Html>
      </group>
    </group>
  )
}
