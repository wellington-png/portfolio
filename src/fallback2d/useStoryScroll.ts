import { useEffect, type RefObject } from 'react'
import type { Palette } from './palette'

/**
 * Liga a rolagem do "livro de fases":
 * - cada portal recebe --pp (0 a 1), que abre a passagem para o próximo projeto;
 * - a paleta da seção troca quando o portal passa de 55%;
 * - o passo visível de cada capítulo fica marcado com data-ativo (e a imagem correspondente).
 */
export function useStoryScroll(ref: RefObject<HTMLElement | null>, palettes: Palette[]) {
  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const portals = [...sec.querySelectorAll<HTMLElement>('[data-portal]')]
    const caps = [...sec.querySelectorAll<HTMLElement>('[data-cap]')]
    const dots = [...sec.querySelectorAll<HTMLElement>('[data-dot]')]

    const setPalette = (i: number) => {
      const p = palettes[i]
      if (!p) return
      sec.style.setProperty('--h-acento', p.acento)
      sec.style.setProperty('--h-fundo', p.fundo)
      sec.style.setProperty('--h-suave', p.suave)
      dots.forEach((d, k) => d.toggleAttribute('data-active', k === i))
    }
    setPalette(0)

    const cleanups: Array<() => void> = []
    const hasPortals = portals.length > 0 && portals[0].offsetHeight > 0

    if (typeof IntersectionObserver === 'undefined') {
      caps.forEach((c) => c.setAttribute('data-visto', ''))
      return
    }

    const middle = '-45% 0px -45% 0px'
    const ioCap = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = caps.indexOf(e.target as HTMLElement)
          if (!hasPortals) setPalette(i)
          else dots.forEach((d, k) => d.toggleAttribute('data-active', k === i))
        }),
      { rootMargin: middle },
    )
    const ioSeen = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).setAttribute('data-visto', '')
            ioSeen.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    cleanups.push(() => ioCap.disconnect(), () => ioSeen.disconnect())

    caps.forEach((cap) => {
      ioCap.observe(cap)
      ioSeen.observe(cap)
      const steps = [...cap.querySelectorAll<HTMLElement>('[data-step]')]
      const imgs = [...cap.querySelectorAll<HTMLElement>('[data-step-img]')]
      const ioStep = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            const j = steps.indexOf(e.target as HTMLElement)
            steps.forEach((s, k) => s.toggleAttribute('data-ativo', k === j))
            imgs.forEach((im, k) => im.toggleAttribute('data-ativo', k === j))
          }),
        { rootMargin: middle },
      )
      steps.forEach((s) => ioStep.observe(s))
      cleanups.push(() => ioStep.disconnect())
    })

    if (hasPortals) {
      let scheduled = false
      let current = 0
      const update = () => {
        scheduled = false
        let inside = 0
        portals.forEach((pt, j) => {
          const r = pt.getBoundingClientRect()
          const total = r.height - window.innerHeight
          const pp = Math.min(Math.max(-r.top / total, 0), 1)
          if (r.bottom > -window.innerHeight && r.top < window.innerHeight * 2) pt.style.setProperty('--pp', pp.toFixed(4))
          if (pp >= 0.55) inside = j
        })
        if (inside !== current) {
          current = inside
          setPalette(inside)
        }
      }
      const onScroll = () => {
        if (!scheduled) {
          scheduled = true
          requestAnimationFrame(update)
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      update()
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [ref, palettes])
}
