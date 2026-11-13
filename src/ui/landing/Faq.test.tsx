import { fireEvent, render, screen } from '@testing-library/react'
import { faqs } from '../../content'
import { Faq } from './Faq'

describe('Faq', () => {
  it('opens one answer at a time and can close it again', () => {
    render(<Faq />)
    const q = faqs.map((f) => screen.getByRole('button', { name: new RegExp(f.q.slice(0, 12)) }))
    expect(q[0]).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(q[2])
    expect(q[2]).toHaveAttribute('aria-expanded', 'true')
    expect(q[0]).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(q[2])
    expect(q[2]).toHaveAttribute('aria-expanded', 'false')
  })
})
