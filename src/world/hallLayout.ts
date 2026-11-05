export const CAMERA_FOV = 55
export const PORTAL_WIDTH = 2.2
export const PORTAL_HEIGHT = 3.4
export const PORTAL_CENTER_Y = 1.9

const ARC_RADIUS = 6
const ARC_STEP = 0.45 // rad entre portais vizinhos
const ARC_CENTER_Z = -4

export interface PortalPlacement {
  position: [number, number, number]
  rotationY: number
}

/** Portais num arco côncavo voltado para a câmera; os das pontas ficam mais perto e viram para o centro. */
export function portalPlacements(count: number): PortalPlacement[] {
  return Array.from({ length: count }, (_, i) => {
    const theta = (i - (count - 1) / 2) * ARC_STEP
    return {
      position: [
        ARC_RADIUS * Math.sin(theta),
        PORTAL_CENTER_Y,
        ARC_CENTER_Z + ARC_RADIUS * (1 - Math.cos(theta)),
      ],
      rotationY: -theta,
    }
  })
}

/** Pose da câmera no salão (coordenadas do mundo). */
export const HUB_CAMERA = {
  position: [0, 1.7, 6],
  lookAt: [0, 1.9, -3],
} as const

/** Poses da câmera dentro da sala, em coordenadas locais do portal. */
export const ROOM_ENTRY = {
  position: [0, 0, 0.35],
  lookAt: [0, 0, -3],
} as const

export const ROOM_OVERVIEW = {
  position: [0, 0.2, 3.5],
  lookAt: [0, -0.1, -5],
} as const
