import { Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useGameStore } from '../store/gameStore'
import { Effects } from '../world/Effects'
import { QUALITY_SETTINGS } from '../world/quality'
import { Skyline } from '../world/Skyline'

export default function Game() {
  const quality = useGameStore((s) => s.quality)
  const settings = QUALITY_SETTINGS[quality]

  return (
    <>
      <Canvas
        dpr={settings.dpr}
        camera={{ position: [0, 1.7, 6], fov: 55, near: 0.1, far: 400 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05050d']} />
        <fog attach="fog" args={['#05050d', 18, 120]} />
        <ambientLight intensity={0.5} color="#6a5cff" />
        <PerformanceMonitor
          onDecline={() => useGameStore.getState().lowerQuality()}
          onIncline={() => useGameStore.getState().raiseQuality()}
          onFallback={() => useGameStore.getState().setQuality('low')}
        />
        <Suspense fallback={null}>
          <Skyline />
        </Suspense>
        <Effects />
      </Canvas>
      <Loader />
    </>
  )
}
