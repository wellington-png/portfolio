export const ROOM_FLOOR_Y = -1.9

const DESKTOP_WIDTH = 2.6
const MOBILE_HEIGHT = 2.2
const GAP = 0.6
const ROOM_Z = -5
const SCREEN_Y = 0.1

export interface ScreenPlacement {
  index: number
  kind: 'desktop' | 'mobile'
  width: number
  height: number
  position: [number, number, number]
  rotationY: number
}

/** Telas lado a lado, centralizadas em x = 0, com uma leve curvatura voltada para o centro. */
export function screenPlacements(images: { width: number; height: number }[]): ScreenPlacement[] {
  const sizes = images.map((img) => {
    const aspect = img.width / img.height
    return img.height > img.width
      ? { kind: 'mobile' as const, width: MOBILE_HEIGHT * aspect, height: MOBILE_HEIGHT }
      : { kind: 'desktop' as const, width: DESKTOP_WIDTH, height: DESKTOP_WIDTH / aspect }
  })
  const total = sizes.reduce((sum, s) => sum + s.width, 0) + GAP * Math.max(sizes.length - 1, 0)
  let cursor = -total / 2
  return sizes.map((s, index) => {
    const x = cursor + s.width / 2
    cursor += s.width + GAP
    return {
      index,
      ...s,
      position: [x, SCREEN_Y, ROOM_Z + Math.abs(x) * 0.12],
      rotationY: -x * 0.06,
    }
  })
}

/** Distância da câmera para a tela caber inteira (com 25% de folga). */
export function fitDistance(width: number, height: number, fovDeg: number, viewAspect: number): number {
  const t = Math.tan((fovDeg * Math.PI) / 360)
  const byHeight = height / 2 / t
  const byWidth = width / 2 / (t * viewAspect)
  return Math.max(byHeight, byWidth) * 1.25
}
