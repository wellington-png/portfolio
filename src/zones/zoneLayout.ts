import { projects as sampleProjects } from '../content'
import type { Project } from '../content'

export type ZoneKind = 'about' | 'project' | 'skills' | 'contact'

export interface ZoneDef {
  id: string
  kind: ZoneKind
  label: string
  /** [x, z] no plano do chão */
  position: [number, number]
  color: string
  projectId?: string
}

/** Meia-largura da arena quadrada (paredes em ±ARENA_HALF). */
export const ARENA_HALF = 50

/** [x, y, z] onde o carrinho nasce, virado para -z. */
export const spawnPoint: [number, number, number] = [0, 1, 0]

export function buildZones(projectList: Project[] = sampleProjects): ZoneDef[] {
  const n = projectList.length
  const projectZones: ZoneDef[] = projectList.map((p, i) => ({
    id: `project:${p.id}`,
    kind: 'project',
    label: p.title,
    position: [n === 1 ? 0 : -24 + (48 / (n - 1)) * i, 28],
    color: p.color,
    projectId: p.id,
  }))

  return [
    { id: 'about', kind: 'about', label: 'Sobre mim', position: [0, -22], color: '#00f0ff' },
    ...projectZones,
    { id: 'skills', kind: 'skills', label: 'Skills', position: [-30, 5], color: '#39ff88' },
    { id: 'contact', kind: 'contact', label: 'Contato', position: [30, 5], color: '#ff2bd6' },
  ]
}

export const zones: ZoneDef[] = buildZones()

export function getZone(id: string): ZoneDef | undefined {
  return zones.find((z) => z.id === id)
}
