import { Vector3 } from 'three'
import { spawnPoint } from '../zones/zoneLayout'

/** Estado mutável do carrinho, escrito pelo Vehicle a cada frame e lido por câmera, minimapa e partículas. */
export const vehicleState = {
  position: new Vector3(...spawnPoint),
  /** rotação em Y; 0 = virado para -z */
  heading: 0,
  /** velocidade ao longo do eixo frontal */
  speed: 0,
  /** velocidade lateral (derrapagem) */
  lateral: 0,
}
