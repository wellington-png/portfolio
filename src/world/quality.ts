export type Quality = 'high' | 'medium' | 'low'

const ORDER: Quality[] = ['high', 'medium', 'low']

export function lowerQuality(q: Quality): Quality {
  return ORDER[Math.min(ORDER.indexOf(q) + 1, ORDER.length - 1)]
}

export function raiseQuality(q: Quality): Quality {
  return ORDER[Math.max(ORDER.indexOf(q) - 1, 0)]
}

export interface QualitySettings {
  dpr: number | [number, number]
  bloom: boolean
  buildings: number
  sparks: boolean
  hoverPreview: boolean
}

export const QUALITY_SETTINGS: Record<Quality, QualitySettings> = {
  high: { dpr: [1, 2], bloom: true, buildings: 80, sparks: true, hoverPreview: true },
  medium: { dpr: [1, 1.5], bloom: true, buildings: 40, sparks: true, hoverPreview: true },
  low: { dpr: 1, bloom: false, buildings: 20, sparks: false, hoverPreview: false },
}
