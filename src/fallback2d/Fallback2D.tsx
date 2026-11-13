import { contact, profile, projects, skillGroups } from '../content'
import { useGameStore } from '../store/gameStore'
import { ThemeToggle } from '../theme/ThemeToggle'
import { Icon } from '../ui/Icon'
import { QuickNav } from '../ui/landing/QuickNav'
import { useActiveSection } from '../ui/landing/useActiveSection'
import { useScrollHud } from '../ui/landing/useScrollHud'
import { Reveal } from '../ui/landing/Reveal'
import './fallback2d.css'
import { Story } from './Story'
import { Vitrine } from './Vitrine'

export function Fallback2D() {
  const notice = useGameStore((s) => s.notice)
  const setMode = useGameStore((s) => s.setMode)
  const hud = useScrollHud<HTMLDivElement>()
  const ids = projects.map((p) => p.id)
  const active = useActiveSection(ids)

  return (
    <div className="fb" ref={hud}>
      <div className="fb-xp" aria-hidden="true">
        <span />
      </div>
      <nav className="fb-bar" aria-label="Modo rápido">
        <button className="btn" onClick={() => setMode('menu')}>
          <Icon name="arrow-left" /> Início
        </button>
        <strong className="fb-bar-title">Modo rápido</strong>
        <ThemeToggle />
        <button className="btn btn-primary" onClick={() => setMode('play')}>
          <Icon name="play" /> Abrir o launcher
        </button>
      </nav>

      <QuickNav items={projects.map((p) => ({ id: p.id, label: p.title }))} active={active} title="Projetos" />

      <main>
        <header className="fb-hero">
          <div className="fb-wrap">
            {notice && (
              <p role="status" className="notice">
                {notice}
              </p>
            )}
            <p className="badge">Fase rápida</p>
            <h1>
              Meus <span className="fb-hl">trabalhos</span>
            </h1>
            <p className="fb-sub">
              Quatro sistemas reais, do primeiro rascunho ao uso diário. Role para atravessar um portal por vez.
            </p>
          </div>
          <svg className="fb-hills" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 70 C 240 10 480 20 720 70 S 1200 120 1440 50 V120 H0Z" fill="#fff6e5" />
          </svg>
        </header>

        <Vitrine />
        <Story />

        <section className="fb-end" aria-labelledby="fb-end-title">
          <div className="fb-wrap fb-end-grid">
            <Reveal from="left" className="fb-card">
              <h2 id="fb-end-title">{profile.name}</h2>
              <p className="muted">{profile.title}</p>
              <p>{profile.bio}</p>
              {skillGroups.map((g) => (
                <div key={g.id}>
                  <h3>{g.label}</h3>
                  <ul className="chips">
                    {g.skills.map((s) => (
                      <li key={s.name}>
                        <Icon name={s.icon} /> {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
            <Reveal from="right" className="fb-card fb-contact">
              <h2>Contato</h2>
              <p>Vamos conversar sobre o seu próximo projeto?</p>
              <p className="links">
                <a href={`mailto:${contact.email}`}>
                  <Icon name="mail" /> Email
                </a>
                <a href={contact.github} target="_blank" rel="noopener noreferrer">
                  <Icon name="github" /> GitHub
                </a>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <Icon name="linkedin" /> LinkedIn
                </a>
                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  <Icon name="chat" /> WhatsApp
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  )
}
