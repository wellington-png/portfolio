import { Instance, Instances } from '@react-three/drei'
import { useMemo } from 'react'
import { Color } from 'three'
import { useGameStore } from '../store/gameStore'
import { QUALITY_SETTINGS } from './quality'
import { generateSkyline } from './skyline'

export function Skyline() {
  const quality = useGameStore((s) => s.quality)
  const count = QUALITY_SETTINGS[quality].buildings
  const buildings = useMemo(() => generateSkyline(count), [count])
  const glow = useMemo(() => buildings.map((b) => new Color(b.neon).multiplyScalar(3)), [buildings])

  return (
    <>
      <Instances limit={200} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color="#0b0b1c" roughness={0.8} />
        {buildings.map((b, i) => (
          <Instance key={i} position={[b.x, b.h / 2, b.z]} scale={[b.w, b.h, b.d]} />
        ))}
      </Instances>
      {/* faixa neon no topo de cada prédio */}
      <Instances limit={200} frustumCulled={false}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
        {buildings.map((b, i) => (
          <Instance key={i} position={[b.x, b.h, b.z]} scale={[b.w + 0.2, 0.5, b.d + 0.2]} color={glow[i]} />
        ))}
      </Instances>
    </>
  )
}
