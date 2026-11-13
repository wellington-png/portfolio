import { paletteOf, stepTitle } from './palette'

describe('palette', () => {
  it('blends the project color with parchment', () => {
    const p = paletteOf('#000000')
    expect(p.acento).toBe('#000000')
    expect(p.fundo).toBe('#c6ba9f')
    expect(p.suave).toBe('#918874')
    expect(paletteOf('#f1e3c2').fundo).toBe('#f1e3c2')
  })

  it('builds a step title from the alt text', () => {
    expect(stepTitle('Occlo: agenda do dia com uma coluna por dentista')).toBe('Agenda do dia com uma coluna por dentista')
    expect(stepTitle('sem prefixo')).toBe('Sem prefixo')
  })
})
