import { Html } from '@react-three/drei'
import { CuboidCollider, type IntersectionEnterPayload, type IntersectionExitPayload } from '@react-three/rapier'
import { useGameStore } from '../store/gameStore'
import type { ZoneDef } from './zoneLayout'

export const ZONE_RADIUS = 7

const isVehicle = (e: IntersectionEnterPayload | IntersectionExitPayload) =>
  e.other.rigidBodyObject?.name === 'vehicle'

export function ZoneBase({ zone, labelHeight = 6 }: { zone: ZoneDef; labelHeight?: number }) {
  const enterZone = useGameStore((s) => s.enterZone)
  const leaveZone = useGameStore((s) => s.leaveZone)
  const visited = useGameStore((s) => s.visited.includes(zone.id))
  const [x, z] = zone.position

  return (
    <>
      <CuboidCollider
        sensor
        args={[ZONE_RADIUS, 4, ZONE_RADIUS]}
        position={[x, 4, z]}
        onIntersectionEnter={(e) => isVehicle(e) && enterZone(zone.id)}
        onIntersectionExit={(e) => isVehicle(e) && leaveZone(zone.id)}
      />
      <mesh rotation-x={-Math.PI / 2} position={[x, 0.05, z]}>
        <ringGeometry args={[ZONE_RADIUS - 0.6, ZONE_RADIUS, 48]} />
        <meshBasicMaterial color={zone.color} transparent opacity={visited ? 0.3 : 1} toneMapped={false} />
      </mesh>
      <Html position={[x, labelHeight, z]} center distanceFactor={18} zIndexRange={[5, 0]}>
        <div className={`zone-label${visited ? ' visited' : ''}`} style={{ color: zone.color, borderColor: zone.color }}>
          {zone.label}
        </div>
      </Html>
    </>
  )
}
