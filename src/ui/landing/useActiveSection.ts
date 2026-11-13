import { useEffect, useState } from 'react'

/** Índice da última seção cujo topo já passou da linha de leitura (45% da altura da tela); -1 antes da primeira. */
export function activeIndex(tops: number[], viewport: number): number {
  let idx = -1
  tops.forEach((t, i) => {
    if (t <= viewport * 0.45) idx = i
  })
  return idx
}

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(-1)
  const key = ids.join('|')

  useEffect(() => {
    const list = key.split('|')
    let raf = 0
    const update = () => {
      raf = 0
      const tops = list.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY)
      setActive(activeIndex(tops, window.innerHeight))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [key])

  return active
}
