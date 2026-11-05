import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { contact, coverOf, imageKind, profile, projects, skillGroups } from './index'

describe('content', () => {
  it('has a profile with name, title and bio', () => {
    expect(profile.name).toBeTruthy()
    expect(profile.title).toBeTruthy()
    expect(profile.bio).toBeTruthy()
  })

  it('has the four real projects with unique ids', () => {
    expect(projects.map((p) => p.title)).toEqual(['Barbuz', 'Occlo', 'AppBov', 'Diaê'])
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every project text, stack, live url and color', () => {
    for (const p of projects) {
      expect(p.tagline).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.kind).toBeTruthy()
      expect(p.stack.length).toBeGreaterThan(0)
      expect(p.liveUrl).toMatch(/^https:\/\//)
      expect(p.color).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })

  it('has local screenshots that exist on disk with real dimensions', () => {
    for (const p of projects) {
      expect(p.images.length).toBeGreaterThan(0)
      for (const img of p.images) {
        expect(img.src).toMatch(/^\/shots\/.+\.webp$/)
        expect(existsSync(resolve(process.cwd(), 'public', img.src.slice(1)))).toBe(true)
        expect(img.alt).toBeTruthy()
        expect(img.width).toBeGreaterThan(0)
        expect(img.height).toBeGreaterThan(0)
      }
    }
  })

  it('coverOf returns the first image and imageKind tells phone from desktop', () => {
    for (const p of projects) expect(coverOf(p)).toBe(p.images[0])
    expect(imageKind({ src: '', alt: '', width: 400, height: 800 })).toBe('mobile')
    expect(imageKind({ src: '', alt: '', width: 1600, height: 900 })).toBe('desktop')
  })

  it('has non-empty skill groups with unique skill names', () => {
    expect(skillGroups.length).toBeGreaterThan(0)
    const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name))
    expect(new Set(names).size).toBe(names.length)
    for (const g of skillGroups) expect(g.skills.length).toBeGreaterThan(0)
  })

  it('has contact links', () => {
    expect(contact.email).toContain('@')
    expect(contact.github).toMatch(/^https?:\/\//)
    expect(contact.linkedin).toMatch(/^https?:\/\//)
    expect(contact.whatsapp).toMatch(/^https?:\/\//)
  })
})
