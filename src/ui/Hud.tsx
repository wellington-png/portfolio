import { useGameStore } from '../store/gameStore'
import { getZone } from '../zones/zoneLayout'
import { GuideArrow } from './GuideArrow'
import './hud.css'
import { JoystickPad } from './JoystickPad'
import { Minimap } from './Minimap'

export function Hud() {
  const activeZone = useGameStore((s) => s.activeZone)
  const panelOpen = useGameStore((s) => s.panelOpen)
  const openPanel = useGameStore((s) => s.openPanel)
  const setMode = useGameStore((s) => s.setMode)
  const zone = activeZone ? getZone(activeZone) : undefined

  return (
    <div className="hud">
      <div className="hud-top">
        <Minimap />
        <GuideArrow />
        <button className="btn hud-quick" onClick={() => setMode('2d')}>
          Versão rápida
        </button>
      </div>

      {zone && !panelOpen && (
        <button className="btn btn-primary hud-prompt" onClick={openPanel}>
          {zone.label} — pressione E ou toque para abrir
        </button>
      )}

      <p className="hud-hint">WASD / setas · Espaço freia · R reinicia</p>
      <JoystickPad />
    </div>
  )
}
