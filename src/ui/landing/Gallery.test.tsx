import { fireEvent, render, screen, within } from '@testing-library/react'
import { projects } from '../../content'
import { Gallery } from './Gallery'

describe('Gallery', () => {
  it('lists every screenshot and filters by project', () => {
    const { container } = render(<Gallery />)
    const total = projects.reduce((n, p) => n + p.images.length, 0)
    expect(container.querySelectorAll('.g-card')).toHaveLength(total)
    const filters = within(screen.getByRole('group', { name: 'Filtrar por projeto' }))
    fireEvent.click(filters.getByRole('button', { name: new RegExp(projects[1].title) }))
    expect(container.querySelectorAll('.g-card')).toHaveLength(projects[1].images.length)
    expect(filters.getByRole('button', { name: new RegExp(projects[1].title) })).toHaveAttribute('aria-pressed', 'true')
  })

  it('opens the viewer, steps with arrows, and Esc closes returning focus', () => {
    const { container } = render(<Gallery />)
    const first = container.querySelectorAll<HTMLElement>('.g-card')[0]
    first.focus()
    fireEvent.click(first)
    const dialog = screen.getByRole('dialog', { name: 'Visualizador de imagens' })
    expect(within(dialog).getByRole('button', { name: 'Fechar' })).toHaveFocus()
    expect(dialog).toHaveTextContent('01 / ')
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(dialog).toHaveTextContent('02 / ')
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(dialog.textContent).toContain(`/ ${String(projects.reduce((n, p) => n + p.images.length, 0)).padStart(2, '0')}`)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(first).toHaveFocus()
  })
})
