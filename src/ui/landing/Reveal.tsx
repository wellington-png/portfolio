import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from './useReveal'

interface Props {
  children: ReactNode
  as?: ElementType
  /** atraso em ms, para entrada em sequência */
  delay?: number
  from?: 'up' | 'left' | 'right' | 'zoom'
  className?: string
}

export function Reveal({ children, as: Tag = 'div', delay = 0, from = 'up', className = '' }: Props) {
  const [ref, seen] = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      data-reveal={from}
      data-in={seen || undefined}
      className={className}
      style={{ ['--d' as string]: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
