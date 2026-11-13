import { fireEvent, render, screen } from '@testing-library/react'
import { QuickNav } from './QuickNav'

const items = [
  { id: 'a', label: 'Visão geral' },
  { id: 'b', label: 'Projetos' },
  { id: 'c', label: 'Contato' },
]

describe('QuickNav', () => {
  it('shows the current section on the floating button and keeps the list closed', () => {
    render(<QuickNav items={items} active={1} />)
    const fab = screen.getByRole('button', { name: /acesso rápido: projetos, seção 2 de 3/i })
    expect(fab).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Acesso rápido' })).toBeNull()
  })

  it('opens a list with every section, marks the current one and focuses the first link', () => {
    render(<QuickNav items={items} active={1} />)
    fireEvent.click(screen.getByRole('button', { name: /acesso rápido/i }))
    const nav = screen.getByRole('navigation', { name: 'Acesso rápido' })
    const links = nav.querySelectorAll('a')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', '#a')
    expect(links[1]).toHaveAttribute('aria-current', 'true')
    expect(links[0]).toHaveFocus()
  })

  it('closes when a section is chosen, on Esc and on the backdrop, giving the focus back', () => {
    const { container } = render(<QuickNav items={items} active={0} />)
    const fab = screen.getByRole('button', { name: /acesso rápido/i })
    fireEvent.click(fab)
    fireEvent.click(screen.getByRole('link', { name: /projetos/i }))
    expect(fab).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(fab)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(fab).toHaveAttribute('aria-expanded', 'false')
    expect(fab).toHaveFocus()
    fireEvent.click(fab)
    fireEvent.click(container.querySelector('.qnav-backdrop')!)
    expect(fab).toHaveAttribute('aria-expanded', 'false')
  })
})
