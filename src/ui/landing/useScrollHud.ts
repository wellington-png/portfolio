import { useEffect, useRef } from 'react'

/** Atualiza --xp (0-1), --hp (progresso do herói, 0-1) e data-stuck no elemento, sem re-renderizar o React. */
export function useScrollHud<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const heroRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const y = window.scrollY
      el.style.setProperty('--xp', String(max > 0 ? Math.min(y / max, 1) : 0))
      el.style.setProperty('--sy', String(y))
      el.toggleAttribute('data-stuck', y > window.innerHeight * 0.55)
      const hero = heroRef.current ?? (heroRef.current = el.querySelector<HTMLElement>('[data-hero]'))
      if (hero) {
        const r = hero.getBoundingClientRect()
        const total = r.height - window.innerHeight
        el.style.setProperty('--hp', String(total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 0))
      }
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
  }, [])
  return ref
}
