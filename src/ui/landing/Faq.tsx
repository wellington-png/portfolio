import { useState } from 'react'
import { faqs, type Faq as FaqItem } from '../../content'
import { Icon } from '../Icon'

/** Perguntas e respostas: abre uma de cada vez, com a resposta deslizando. */
export function Faq({ items = faqs }: { items?: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <ul className="faq-list">
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <li key={f.q} className="faq-item" data-open={isOpen || undefined}>
            <button type="button" id={`faq-q-${i}`} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
              <span className="faq-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="faq-q">{f.q}</span>
              <Icon name="plus" className="faq-icon" />
            </button>
            <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
              <div>
                <p>{f.a}</p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
