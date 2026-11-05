import { Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useGameStore } from '../store/gameStore'
import { InfoPanel } from '../ui/InfoPanel'
import '../ui/overlay.css'
import { ProjectHud } from '../ui/ProjectHud'
import { TopMenu } from '../ui/TopMenu'
import { useGameKeys } from '../ui/useGameKeys'
import { CameraRig } from '../world/CameraRig'
import { Effects } from '../world/Effects'
import { Hall } from '../world/Hall'
import { CAMERA_FOV, HUB_CAMERA } from '../world/hallLayout'
import { QUALITY_SETTINGS } from '../world/quality'
import { Skyline } from '../world/Skyline'

export default function Game() {
  useGameKeys()
  const quality = useGameStore((s) => s.quality)
  const settings = QUALITY_SETTINGS[quality]

  return (
    <>
      <Canvas
        dpr={settings.dpr}
        camera={{ position: [...HUB_CAMERA.position], fov: CAMERA_FOV, near: 0.1, far: 400 }}
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
          <Hall />
          <Skyline />
        </Suspense>
        <CameraRig />
        <Effects />
      </Canvas>
      <TopMenu />
      <InfoPanel />
      <ProjectHud />
      <Loader />
    </>
  )
}
