import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../Icon'

interface Item {
  id: string
  label: string
}

/**
 * Acesso rápido para toque: um botão flutuante que mostra onde você está (número e anel de progresso)
 * e abre uma lista grande de seções. Aparece só em telas estreitas; em telas largas o trilho lateral cuida disso.
 */
export function QuickNav({ items, active, title = 'Ir para' }: { items: Item[]; active: number; title?: string }) {
  const [open, setOpen] = useState(false)
  const fab = useRef<HTMLButtonElement>(null)
  const first = useRef<HTMLAnchorElement>(null)
  const sheetId = useId()

  const close = () => {
    setOpen(false)
    fab.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    first.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        fab.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const current = Math.max(active, 0)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="qnav" data-open={open || undefined}>
      <button ref={fab} type="button" className="qnav-fab" aria-expanded={open} aria-controls={sheetId} aria-label={`Acesso rápido: ${items[current]?.label ?? ''}, seção ${current + 1} de ${items.length}`} onClick={() => setOpen((o) => !o)}>
        <span className="qnav-ring" aria-hidden="true" />
        <span className="qnav-num" aria-hidden="true">
          {open ? <Icon name="close" /> : pad(current + 1)}
        </span>
      </button>

      {open && <div className="qnav-backdrop" onClick={close} aria-hidden="true" />}

      <nav id={sheetId} className="qnav-sheet" aria-label="Acesso rápido" hidden={!open}>
        <p className="qnav-title">
          {title} <b>{pad(current + 1)}/{pad(items.length)}</b>
        </p>
        <ol>
          {items.map((it, i) => (
            <li key={it.id} style={{ ['--k' as string]: i }}>
              <a ref={i === 0 ? first : undefined} href={`#${it.id}`} aria-current={i === active ? 'true' : undefined} onClick={() => setOpen(false)}>
                <span className="qnav-i">{pad(i + 1)}</span>
                <span className="qnav-l">{it.label}</span>
                <Icon name="arrow-right" />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
