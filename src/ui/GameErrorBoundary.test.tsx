import { render, screen } from '@testing-library/react'
import { GameErrorBoundary } from './GameErrorBoundary'

function Boom(): never {
  throw new Error('boom')
}

describe('GameErrorBoundary', () => {
  it('renders children when fine', () => {
    render(
      <GameErrorBoundary onError={() => {}}>
        <p>ok</p>
      </GameErrorBoundary>,
    )
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  it('calls onError and hides children when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = vi.fn()
    render(
      <GameErrorBoundary onError={onError}>
        <Boom />
      </GameErrorBoundary>,
    )
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    spy.mockRestore()
  })
})
