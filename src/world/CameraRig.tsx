import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import { useMemo, useRef } from 'react'
import { Vector3 } from 'three'
import { projects } from '../content'
import { parallaxOffset } from '../lib/parallax'
import { useGameStore } from '../store/gameStore'
import { CAMERA_FOV, HUB_CAMERA, hubCameraZ, ROOM_ENTRY, ROOM_OVERVIEW } from './hallLayout'
import { SMOOTH } from './motion'
import { getPortalObject } from './portalRegistry'
import { fitDistance, screenPlacements, type ScreenPlacement } from './roomLayout'

const ARRIVE = 0.08

type Triple = readonly [number, number, number]

export function CameraRig() {
  const { camera, pointer, size } = useThree()
  const look = useRef(new Vector3(...HUB_CAMERA.lookAt))
  const pos = useMemo(() => new Vector3(), [])
  const target = useMemo(() => new Vector3(), [])
  const screens = useRef(new Map<string, ScreenPlacement[]>())

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const s = useGameStore.getState()
    const p = parallaxOffset(pointer, { x: 1, y: 1 })
    const portal = s.activeProject ? getPortalObject(s.activeProject) : undefined
    const inRoom = (s.phase === 'entering' || s.phase === 'room') && portal

    if (!inRoom) {
      // salão (e volta da sala): parallax suave pelo mouse
      // na volta ('leaving') sem parallax, para a câmera conseguir chegar na pose
      const k = s.phase === 'leaving' ? 0 : 1
      pos.set(
        HUB_CAMERA.position[0] + p.x * 0.9 * k,
        HUB_CAMERA.position[1] + p.y * 0.35 * k,
        hubCameraZ(size.width / size.height, projects.length),
      )
      target.set(HUB_CAMERA.lookAt[0] + p.x * 0.6 * k, HUB_CAMERA.lookAt[1] + p.y * 0.2 * k, HUB_CAMERA.lookAt[2])
    } else {
      let localPos: Triple = ROOM_ENTRY.position
      let localLook: Triple = ROOM_ENTRY.lookAt

      if (s.phase === 'room') {
        localPos = [ROOM_OVERVIEW.position[0] + p.x * 0.8, ROOM_OVERVIEW.position[1] + p.y * 0.3, ROOM_OVERVIEW.position[2]]
        localLook = [ROOM_OVERVIEW.lookAt[0] + p.x * 0.5, ROOM_OVERVIEW.lookAt[1] + p.y * 0.2, ROOM_OVERVIEW.lookAt[2]]

        if (s.focusedImage !== null && s.activeProject) {
          let list = screens.current.get(s.activeProject)
          if (!list) {
            const project = projects.find((x) => x.id === s.activeProject)
            list = screenPlacements(project?.images ?? [])
            screens.current.set(s.activeProject, list)
          }
          const sc = list[s.focusedImage]
          if (sc) {
            const d = fitDistance(sc.width, sc.height, CAMERA_FOV, size.width / size.height)
            localPos = [sc.position[0] + p.x * 0.15, sc.position[1] + p.y * 0.1, sc.position[2] + d]
            localLook = sc.position
          }
        }
      }

      portal.updateWorldMatrix(true, false)
      pos.set(...localPos)
      portal.localToWorld(pos)
      target.set(...localLook)
      portal.localToWorld(target)
    }

    easing.damp3(camera.position, pos, SMOOTH, dt)
    easing.damp3(look.current, target, SMOOTH, dt)
    camera.lookAt(look.current)

    // conclui as transições quando a câmera chega na pose
    if (s.phase === 'entering' && camera.position.distanceTo(pos) < ARRIVE) s.finishEnter()
    else if (s.phase === 'leaving' && camera.position.distanceTo(pos) < ARRIVE) s.finishLeave()
  })

  return null
}
