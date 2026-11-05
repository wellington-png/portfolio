import { useEffect, useRef } from 'react'

/** Executa `cb` a cada frame do navegador sem causar re-render do React. */
export function useRaf(cb: () => void) {
  const saved = useRef(cb)
  saved.current = cb
  useEffect(() => {
    let id = requestAnimationFrame(function tick() {
      saved.current()
      id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [])
}
