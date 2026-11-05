import { contact, profile, skillGroups } from '../content'
import type { Project } from '../content'

export function ProfileSection() {
  return (
    <section className="section">
      <h2>{profile.name}</h2>
      <p className="muted">{profile.title}</p>
      <p>{profile.bio}</p>
    </section>
  )
}

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="section" style={{ ['--accent' as string]: project.color }}>
      <h3>{project.title}</h3>
      <p className="muted">
        {project.tagline} · {project.kind}
      </p>
      <p>{project.description}</p>
      <ul className="chips">
        {project.stack.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <ul className="shots">
        {project.images.map((img) => (
          <li key={img.src}>
            <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" />
          </li>
        ))}
      </ul>
      <p className="links">
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
          Ver site
        </a>
      </p>
    </article>
  )
}

export function SkillsSection() {
  return (
    <section className="section">
      <h2>Skills</h2>
      {skillGroups.map((g) => (
        <div key={g.id}>
          <h3>{g.label}</h3>
          <ul className="chips">
            {g.skills.map((s) => (
              <li key={s.name}>
                <span aria-hidden="true">{s.icon}</span> {s.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

export function ContactSection() {
  return (
    <section className="section">
      <h2>Contato</h2>
      <p className="links">
        <a href={`mailto:${contact.email}`}>Email</a>
        <a href={contact.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </p>
    </section>
  )
}
