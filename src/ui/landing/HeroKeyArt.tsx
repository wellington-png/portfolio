import { mulberry32 } from '../../lib/random'

const rnd = mulberry32(21)
const EMBERS = Array.from({ length: 28 }, (_, i) => ({
  x: Math.round(rnd() * 100),
  s: 2 + Math.round(rnd() * 3),
  d: 7 + rnd() * 8,
  delay: -rnd() * 14,
  sway: (rnd() - 0.5) * 80,
  k: i,
}))

function pines(seed: number, y: number, minS: number, maxS: number) {
  const r = mulberry32(seed)
  const out: { x: number; s: number }[] = []
  for (let x = -40; x < 1640; x += 22 + r() * 40) out.push({ x, s: minS + r() * (maxS - minS) })
  return out.map((p) => ({ ...p, y }))
}
const FAR = pines(3, 900, 0.9, 1.5)
const NEAR = pines(9, 940, 1.5, 2.6)
const PINE = 'M0 -124 L-12 -84 H-5 L-17 -44 H-7 L-22 0 H22 L7 -44 H17 L5 -84 H12 Z'

/** Arte-chave do modo Red Dead: disco de sol vermelho e laranja, pinheiros e brasas subindo. */
export function HeroKeyArt() {
  return (
    <div className="hs hs-ka" aria-hidden="true">
      <div className="ka-bg" />
      <div className="ka-sun" />
      <div className="ka-embers">
        {EMBERS.map((e) => (
          <i key={e.k} style={{ left: `${e.x}%`, width: e.s, height: e.s, animationDuration: `${e.d}s`, animationDelay: `${e.delay}s`, ['--sway' as string]: `${e.sway}px` }} />
        ))}
      </div>
      <svg className="ka-pines far" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <g fill="#1a0604">
          {FAR.map((p, i) => (
            <path key={i} d={PINE} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} />
          ))}
        </g>
      </svg>
      <svg className="ka-pines near" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <g fill="#000">
          {NEAR.map((p, i) => (
            <path key={i} d={PINE} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} />
          ))}
        </g>
      </svg>
      <div className="hs-vignette" />
    </div>
  )
}
