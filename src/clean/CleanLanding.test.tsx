import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { contact, pitch, projects } from '../content'
import { CleanLanding } from './CleanLanding'

describe('CleanLanding', () => {
  it('mostra a promessa principal e um CTA de WhatsApp preenchido', () => {
    render(<CleanLanding />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    const links = screen.getAllByRole('link').map((a) => a.getAttribute('href') ?? '')
    expect(links.some((h) => h.startsWith(contact.whatsapp) && h.includes('text='))).toBe(true)
  })

  it('tem uma entrada de caso para cada projeto', () => {
    for (const p of projects) expect(pitch.cases.byProject[p.id]).toBeDefined()
  })

  it('não usa copy vazia nem placeholders', () => {
    const all = JSON.stringify(pitch) + JSON.stringify(contact)
    expect(all).not.toMatch(/example\.com|seu-usuario|0000000|Texto de exemplo/)
  })
})
