import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useGameStore } from '../store/gameStore'
import { QUALITY_SETTINGS } from './quality'

export function Effects() {
  const quality = useGameStore((s) => s.quality)
  if (!QUALITY_SETTINGS[quality].bloom) return null
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={1.1} luminanceThreshold={1} luminanceSmoothing={0.2} mipmapBlur />
    </EffectComposer>
  )
}
