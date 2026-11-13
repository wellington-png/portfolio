import { mulberry32 } from '../../lib/random'

const STARS = Array.from({ length: 30 }, (_, i) => ({ x: (i * 83 + (i % 5) * 37) % 100, y: (i * 47 + (i % 7) * 19) % 40, s: 1 + (i % 3), d: (i % 6) * 0.5 }))

function towers(seed: number, from: number, to: number, base: number, minH: number, maxH: number) {
  const rnd = mulberry32(seed)
  const out: { x: number; w: number; h: number }[] = []
  let x = from
  while (x < to) {
    const w = 38 + rnd() * 62
    out.push({ x, w, h: minH + rnd() * (maxH - minH) })
    x += w + rnd() * 10
  }
  return out.map((t) => ({ ...t, y: base - t.h }))
}

const FAR = towers(11, -20, 1620, 700, 90, 300)
const MID = towers(5, -20, 1620, 740, 70, 220)
const FRONDS = [-165, -130, -95, -60, -25, 15, 50, 85, 120]

function Palm({ x, y, h, flip = false }: { x: number; y: number; h: number; flip?: boolean }) {
  const top = { x: h * 0.22, y: -h }
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} fill="#0c0522" stroke="#0c0522">
      <path d={`M0 0 C ${h * 0.05} ${-h * 0.4}, ${h * 0.2} ${-h * 0.7}, ${top.x} ${top.y}`} fill="none" strokeWidth={h * 0.045} strokeLinecap="round" />
      <g transform={`translate(${top.x} ${top.y})`}>
        {FRONDS.map((a) => (
          <path key={a} transform={`rotate(${a})`} d={`M0 0 Q ${h * 0.2} ${-h * 0.16} ${h * 0.42} ${h * 0.05} Q ${h * 0.2} ${-h * 0.05} 0 0Z`} strokeWidth="1" />
        ))}
      </g>
    </g>
  )
}

/** Pôr do sol de Vice City: céu rosa e laranja, skyline com janelas acesas, mar e palmeiras. */
export function HeroGta() {
  return (
    <div className="hs hs-gta" aria-hidden="true">
      <div className="hs-sky" />
      <div className="hs-stars">
        {STARS.map((s, i) => (
          <i key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
        ))}
      </div>
      <div className="hs-sun" />
      <div className="hs-clouds">
        <i className="hs-cloud a" />
        <i className="hs-cloud b" />
        <i className="hs-cloud c" />
      </div>

      <svg className="hs-layer far" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <pattern id="win" width="12" height="16" patternUnits="userSpaceOnUse">
            <rect x="3" y="4" width="5" height="7" fill="#ffd9a0" />
          </pattern>
        </defs>
        <g fill="#4a1d6e" opacity="0.9">
          {FAR.map((t, i) => (
            <rect key={i} x={t.x} y={t.y} width={t.w} height={t.h + 200} />
          ))}
        </g>
        <g className="windows" fill="url(#win)" opacity="0.5">
          {FAR.map((t, i) => (
            <rect key={i} x={t.x} y={t.y} width={t.w} height={t.h} />
          ))}
        </g>
      </svg>

      <svg className="hs-layer mid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <g fill="#2a0f4d">
          {MID.map((t, i) => (
            <rect key={i} x={t.x} y={t.y} width={t.w} height={t.h + 200} />
          ))}
        </g>
        <g className="windows" fill="url(#win)">
          {MID.map((t, i) => (
            <rect key={i} x={t.x} y={t.y} width={t.w} height={t.h} />
          ))}
        </g>
        <rect x="0" y="738" width="1600" height="200" fill="#1b0a3a" />
      </svg>

      <div className="hs-sea">
        <i className="glint g1" />
        <i className="glint g2" />
        <i className="glint g3" />
        <i className="glint g4" />
      </div>

      <svg className="hs-layer near" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <path fill="#10062a" d="M0 800 C 300 770 700 800 1000 790 S 1450 770 1600 790 V900 H0Z" />
        <Palm x={1370} y={820} h={380} flip />
        <Palm x={250} y={826} h={330} />
      </svg>

      <svg className="hs-layer front" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <path fill="#07031a" d="M0 860 C 400 840 900 868 1600 846 V900 H0Z" />
        <Palm x={70} y={880} h={560} />
        <Palm x={1560} y={884} h={470} flip />
      </svg>

      <div className="hs-dust" />
      <div className="hs-vignette" />
    </div>
  )
}
