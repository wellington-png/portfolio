import { Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import { useGameStore } from '../store/gameStore'
import { Hud } from '../ui/Hud'
import { useInteractKeys } from '../ui/useInteractKeys'
import { ZonePanel } from '../ui/ZonePanel'
import { CameraRig } from '../vehicle/CameraRig'
import { useKeyboardInput } from '../vehicle/useKeyboardInput'
import { Vehicle } from '../vehicle/Vehicle'
import { Arena } from '../world/Arena'
import { Effects } from '../world/Effects'
import { QUALITY_SETTINGS } from '../world/quality'
import { Skyline } from '../world/Skyline'
import { Zones } from '../zones/Zones'

export default function Game() {
  const quality = useGameStore((s) => s.quality)
  const settings = QUALITY_SETTINGS[quality]
  useKeyboardInput()
  useInteractKeys()

  return (
    <>
      <Canvas
        dpr={settings.dpr}
        camera={{ position: [0, 6, 10], fov: 60, near: 0.1, far: 400 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05050d']} />
        <fog attach="fog" args={['#05050d', 40, 160]} />
        <ambientLight intensity={0.35} color="#6a5cff" />
        <directionalLight position={[20, 40, 10]} intensity={0.4} color="#8fb4ff" />
        <PerformanceMonitor
          onDecline={() => useGameStore.getState().lowerQuality()}
          onIncline={() => useGameStore.getState().raiseQuality()}
          onFallback={() => useGameStore.getState().setQuality('low')}
        />
        <Suspense fallback={null}>
          <Physics>
            <Arena />
            <Zones />
            <Vehicle />
          </Physics>
          <Skyline />
        </Suspense>
        <CameraRig />
        <Effects />
      </Canvas>
      <Hud />
      <ZonePanel />
      <Loader />
    </>
  )
}
