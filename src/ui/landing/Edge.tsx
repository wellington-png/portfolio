import { useInView } from './useReveal'

export type Tone = 'bg' | 'bg2' | 'light' | 'accent'

const TONES: Record<Tone, string> = { bg: 'var(--bg)', bg2: 'var(--bg-2)', light: 'var(--light-solid)', accent: 'var(--accent-solid)' }

const NOTCHES = [
  { x: 90, w: 110 },
  { x: 380, w: 60 },
  { x: 690, w: 150 },
  { x: 1010, w: 70 },
  { x: 1230, w: 100 },
]

function path() {
  let d = 'M0 28 V16'
  for (const n of NOTCHES) {
    d += ` H${n.x} L${n.x + 12} 4 H${n.x + n.w - 12} L${n.x + n.w} 16`
  }
  return `${d} H1440 V28 Z`
}
const D = path()

/** Divisor de seção recortado, com um rótulo técnico que "carrega" quando entra na tela. */
export function Edge({ tone, label }: { tone: Tone; label: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.5)
  return (
    <div ref={ref} className="edge" data-in={seen || undefined} aria-hidden="true">
      <span className="edge-label">{label}</span>
      <svg viewBox="0 0 1440 28" preserveAspectRatio="none">
        <path d={D} style={{ fill: TONES[tone] }} />
        <g className="edge-ticks" fill="currentColor">
          {[150, 520, 760, 1050, 1290].map((x) => (
            <rect key={x} x={x} y="0" width="2" height="6" />
          ))}
        </g>
      </svg>
    </div>
  )
}
