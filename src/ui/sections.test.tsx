import { render, screen } from '@testing-library/react'
import { contact, profile, projects, skillGroups } from '../content'
import { ContactSection, ProfileSection, ProjectDetail, SkillsSection } from './sections'

describe('sections', () => {
  it('ProfileSection shows name, title and bio', () => {
    render(<ProfileSection />)
    expect(screen.getByRole('heading', { name: profile.name })).toBeInTheDocument()
    expect(screen.getByText(profile.title)).toBeInTheDocument()
    expect(screen.getByText(profile.bio)).toBeInTheDocument()
  })

  it('ProjectDetail shows stack and external links', () => {
    const p = projects[0]
    render(<ProjectDetail project={p} />)
    expect(screen.getByRole('heading', { name: p.title })).toBeInTheDocument()
    for (const tech of p.stack) expect(screen.getByText(tech)).toBeInTheDocument()
    const demo = screen.getByRole('link', { name: /demo/i })
    expect(demo).toHaveAttribute('href', p.demoUrl)
    expect(demo).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('SkillsSection lists every skill', () => {
    render(<SkillsSection />)
    for (const g of skillGroups) {
      expect(screen.getByRole('heading', { name: g.label })).toBeInTheDocument()
      for (const s of g.skills) expect(screen.getByText(s.name)).toBeInTheDocument()
    }
  })

  it('ContactSection links to email and socials', () => {
    render(<ContactSection />)
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute('href', `mailto:${contact.email}`)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', contact.github)
  })
})
