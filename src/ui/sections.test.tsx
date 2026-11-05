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

  it('ProjectDetail shows text, stack, screenshots and the live link', () => {
    const p = projects[0]
    render(<ProjectDetail project={p} />)
    expect(screen.getByRole('heading', { name: p.title })).toBeInTheDocument()
    expect(screen.getByText(new RegExp(p.tagline))).toBeInTheDocument()
    for (const tech of p.stack) expect(screen.getByText(tech)).toBeInTheDocument()
    for (const img of p.images) expect(screen.getByAltText(img.alt)).toHaveAttribute('src', img.src)
    const live = screen.getByRole('link', { name: /ver site/i })
    expect(live).toHaveAttribute('href', p.liveUrl)
    expect(live).toHaveAttribute('rel', expect.stringContaining('noopener'))
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
