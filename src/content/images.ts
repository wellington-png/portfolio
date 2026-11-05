import type { Project, ProjectImage } from './types'

export type ImageKind = 'desktop' | 'mobile'

export function imageKind(img: ProjectImage): ImageKind {
  return img.height > img.width ? 'mobile' : 'desktop'
}

export function coverOf(project: Project): ProjectImage {
  return project.images[0]
}
