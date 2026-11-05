import { render, screen } from '@testing-library/react'
import { TextureBoundary } from './TextureBoundary'

function Boom(): never {
  throw new Error('textura quebrada')
}

describe('TextureBoundary', () => {
  it('renders children when fine', () => {
    render(
      <TextureBoundary fallback={<p>fallback</p>}>
        <p>ok</p>
      </TextureBoundary>,
    )
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  it('renders the fallback when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <TextureBoundary fallback={<p>fallback</p>}>
        <Boom />
      </TextureBoundary>,
    )
    expect(screen.getByText('fallback')).toBeInTheDocument()
    spy.mockRestore()
  })
})
