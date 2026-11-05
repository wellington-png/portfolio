import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'
import { getZone } from '../zones/zoneLayout'
import { followPosition } from './physics'
import { vehicleState } from './vehicleState'

const BASE_FOV = 60
const MAX_FOV_BOOST = 18
const MAX_SPEED = 24

export function CameraRig() {
  const { camera } = useThree()
  const desired = useRef(new Vector3())
  const look = useRef(new Vector3(0, 1, -5))
  const lookTarget = useRef(new Vector3())
  const zoneCenter = useRef(new Vector3())
  const dir = useRef(new Vector3())

  useFrame((_, delta) => {
    const { position, heading, speed } = vehicleState
    const zone = useGameStore.getState().activeZone
    const def = zone ? getZone(zone) : undefined

    if (def) {
      // Enquadra o prédio/terminal mantendo o carrinho visível
      zoneCenter.current.set(def.position[0], 0, def.position[1])
      dir.current.set(position.x - zoneCenter.current.x, 0, position.z - zoneCenter.current.z)
      if (dir.current.lengthSq() < 0.001) dir.current.set(0, 0, 1)
      dir.current.normalize()
      desired.current.copy(zoneCenter.current).addScaledVector(dir.current, 16).setY(8)
      lookTarget.current.set(zoneCenter.current.x, 3, zoneCenter.current.z)
    } else {
      const p = followPosition(position, heading, 9, 5)
      desired.current.set(p.x, p.y, p.z)
      lookTarget.current.set(
        position.x - Math.sin(heading) * 3,
        position.y + 1,
        position.z - Math.cos(heading) * 3,
      )
    }

    const k = 1 - Math.exp(-4 * delta)
    camera.position.lerp(desired.current, k)
    look.current.lerp(lookTarget.current, k)
    camera.lookAt(look.current)

    const cam = camera as PerspectiveCamera
    const targetFov = BASE_FOV + (Math.min(Math.abs(speed), MAX_SPEED) / MAX_SPEED) * MAX_FOV_BOOST
    cam.fov += (targetFov - cam.fov) * k
    cam.updateProjectionMatrix()
  })

  return null
}
