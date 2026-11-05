import { contact, profile, projects, skillGroups } from './index'

describe('content', () => {
  it('has a profile with name, title and bio', () => {
    expect(profile.name).toBeTruthy()
    expect(profile.title).toBeTruthy()
    expect(profile.bio).toBeTruthy()
  })

  it('has projects with unique ids, stack and http urls', () => {
    expect(projects.length).toBeGreaterThanOrEqual(1)
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of projects) {
      expect(p.stack.length).toBeGreaterThan(0)
      expect(p.demoUrl).toMatch(/^https?:\/\//)
      expect(p.repoUrl).toMatch(/^https?:\/\//)
      expect(p.color).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })

  it('has non-empty skill groups', () => {
    expect(skillGroups.length).toBeGreaterThan(0)
    for (const g of skillGroups) {
      expect(g.skills.length).toBeGreaterThan(0)
      for (const s of g.skills) {
        expect(s.name).toBeTruthy()
        expect(s.icon).toBeTruthy()
      }
    }
  })

  it('has contact links', () => {
    expect(contact.email).toContain('@')
    expect(contact.github).toMatch(/^https?:\/\//)
    expect(contact.linkedin).toMatch(/^https?:\/\//)
    expect(contact.whatsapp).toMatch(/^https?:\/\//)
  })
})
