import { parallaxOffset } from './parallax'

describe('parallaxOffset', () => {
  it('scales the pointer by the strength per axis', () => {
    expect(parallaxOffset({ x: 0.5, y: -1 }, { x: 2, y: 4 })).toEqual({ x: 1, y: -4 })
  })
  it('clamps the pointer to [-1, 1]', () => {
    expect(parallaxOffset({ x: 3, y: -3 }, { x: 1, y: 1 })).toEqual({ x: 1, y: -1 })
  })
  it('is zero at the center', () => {
    expect(parallaxOffset({ x: 0, y: 0 }, { x: 5, y: 5 })).toEqual({ x: 0, y: 0 })
  })
})
