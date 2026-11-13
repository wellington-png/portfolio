import { useEffect, useState } from 'react'
import { useInView } from './useReveal'

export function Counter({ to }: { to: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.5)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!seen) return
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setN(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const k = Math.min((t - start) / 1200, 1)
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])

  return <span ref={ref}>{n}</span>
}
