import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useGameStore } from '../store/gameStore'
import { QUALITY_SETTINGS } from './quality'

export function Effects() {
  const quality = useGameStore((s) => s.quality)
  const hub = useGameStore((s) => s.phase === 'hub')
  if (!QUALITY_SETTINGS[quality].bloom) return null
  // enabled=false solta o render priority do composer; dentro da sala o portal desenha sozinho
  return (
    <EffectComposer multisampling={0} enabled={hub}>
      <Bloom intensity={1.1} luminanceThreshold={1} luminanceSmoothing={0.2} mipmapBlur />
    </EffectComposer>
  )
}
