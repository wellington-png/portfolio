import type { ReactNode } from 'react'
import { useInView } from './useReveal'

interface Props {
  index: number
  total: number
  /** rótulo técnico, ex.: VISÃO_GERAL */
  tag: string
  title: string
  id?: string
  level?: 2 | 3
  children?: ReactNode
}

/** Cabeçalho de seção estilo HUD: contador, rótulo digitado, linha que se desenha e título. */
export function SectionHead({ index, total, tag, title, id, level = 2, children }: Props) {
  const [ref, seen] = useInView<HTMLElement>(0.3)
  const Heading = level === 2 ? 'h2' : 'h3'
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <header ref={ref} id={id} className={`sec-head sec-head-${level}`} data-in={seen || undefined}>
      <div className="sec-meta" aria-hidden="true">
        <span className="sec-index">
          {pad(index)}
          <i> / {pad(total)}</i>
        </span>
        <span className="sec-tag">{tag}</span>
        <span className="sec-line" />
      </div>
      <Heading className="sec-title">{title}</Heading>
      {children}
    </header>
  )
}
