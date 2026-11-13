import { useEffect, useState } from 'react'

const TIPS = ['Aquecendo os portais…', 'Plantando as colinas…', 'Acordando o sol…', 'Pronto para jogar!']

/** Tela de carregamento em estilo de jogo; aparece só na primeira visita da sessão. */
export function IntroLoader({ onDone }: { onDone: () => void }) {
  const [tip, setTip] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setTip(1), 450),
      setTimeout(() => setTip(2), 900),
      setTimeout(() => setTip(3), 1350),
      setTimeout(() => setLeaving(true), 1750),
      setTimeout(onDone, 2350),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div className={`intro${leaving ? ' leaving' : ''}`} role="status" aria-live="polite">
      <div className="intro-box">
        <div className="intro-coin" aria-hidden="true" />
        <p className="intro-tip">{TIPS[tip]}</p>
        <div className="intro-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}
