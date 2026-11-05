import type { Object3D } from 'three'

const registry = new Map<string, Object3D>()

/** Registra (ou remove, com null) o objeto de cada portal, para a câmera converter poses locais em mundo. */
export function registerPortal(id: string, obj: Object3D | null) {
  if (obj) registry.set(id, obj)
  else registry.delete(id)
}

export function getPortalObject(id: string): Object3D | undefined {
  return registry.get(id)
}
