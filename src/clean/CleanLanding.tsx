import { useMemo } from 'react'
import { coverOf, emailLink, pitch, profile, projects, skillGroups, whatsappLink } from '../content'
import { ThemeToggle } from '../theme/ThemeToggle'
import { THEME_IDS } from '../theme/themes'
import { Icon } from '../ui/Icon'
import { Faq } from '../ui/landing/Faq'
import { Reveal } from '../ui/landing/Reveal'
import { Showcase } from '../ui/landing/Showcase'
import './clean.css'

const NAV = [
  { href: '#projetos', label: 'Projetos' },
  { href: '#como-funciona', label: 'Como trabalho' },
  { href: '#perguntas', label: 'Perguntas' },
  { href: '#sobre', label: 'Sobre' },
]

/** Versão Clean: página comercial, direta, feita para um visitante decidir se fala com você. */
export function CleanLanding() {
  const tools = useMemo(() => skillGroups.flatMap((g) => g.skills), [])

  return (
    <div className="cl is-ready">
      <header className="cl-nav">
        <div className="cl-wrap cl-nav-row">
          <a href="#topo" className="cl-brand">
            <span aria-hidden="true">{profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
            <b className="cl-name">{profile.name}</b>
          </a>
          <nav aria-label="Seções">
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="cl-nav-actions">
            <ThemeToggle ids={THEME_IDS} />
            <a className="btn btn-primary cl-nav-cta" href={whatsappLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="cl-hero" id="topo">
          <div className="cl-wrap cl-hero-grid">
            <div className="cl-hero-copy">
              <p className="cl-eyebrow">{pitch.hero.eyebrow}</p>
              <h1>{pitch.hero.headline}</h1>
              <p className="cl-lead">{pitch.hero.sub}</p>
              <div className="cl-actions">
                <a className="btn btn-primary btn-lg" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  {pitch.hero.primary}
                </a>
                <a className="cl-textlink" href="#projetos">
                  {pitch.hero.secondary} <Icon name="arrow-down" />
                </a>
              </div>
              <p className="cl-proof">{pitch.hero.proof}</p>
            </div>
            <div className="cl-hero-art">
              <Showcase />
            </div>
          </div>
        </section>

        <section className="cl-sec" id="projetos" aria-labelledby="cl-cases">
          <div className="cl-wrap">
            <Reveal className="cl-head">
              <h2 id="cl-cases">{pitch.cases.title}</h2>
              <p>{pitch.cases.text}</p>
            </Reveal>
            <div className="cl-cases">
              {projects.map((p, i) => {
                const c = pitch.cases.byProject[p.id]
                return (
                  <Reveal key={p.id} className="cl-case-wrap">
                    <article className="cl-case" style={{ ['--accent' as string]: p.color }}>
                      <div className="cl-case-media">
                        <img src={coverOf(p).src} alt={coverOf(p).alt} loading="lazy" />
                      </div>
                      <div className="cl-case-body">
                        <p className="cl-tag">
                          {String(i + 1).padStart(2, '0')} · {c?.segment}
                        </p>
                        <h3>{p.title}</h3>
                        <p className="cl-case-sub">{p.tagline}</p>
                        <dl>
                          <dt>{pitch.cases.labels.problem}</dt>
                          <dd>{c?.problem}</dd>
                          <dt>{pitch.cases.labels.solution}</dt>
                          <dd>{c?.solution}</dd>
                        </dl>
                        <p className="cl-stack">{p.stack.slice(0, 5).join(' · ')}</p>
                        <a className="cl-link" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                          {pitch.cases.labels.cta} <Icon name="arrow-up-right" />
                        </a>
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="cl-sec cl-alt" id="como-funciona" aria-labelledby="cl-ben">
          <div className="cl-wrap cl-split">
            <Reveal className="cl-head">
              <h2 id="cl-ben">{pitch.benefits.title}</h2>
            </Reveal>
            <ol className="cl-list">
              {pitch.benefits.items.map((b) => (
                <li key={b.title}>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="cl-sec" id="processo" aria-labelledby="cl-proc">
          <div className="cl-wrap cl-split">
            <Reveal className="cl-head">
              <h2 id="cl-proc">{pitch.process.title}</h2>
            </Reveal>
            <ol className="cl-list cl-numbered">
              {pitch.process.steps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="cl-sec cl-alt" id="tecnologia" aria-labelledby="cl-tech">
          <div className="cl-wrap cl-split">
            <Reveal className="cl-head">
              <h2 id="cl-tech">{pitch.stack.title}</h2>
              <p>{pitch.stack.text}</p>
            </Reveal>
            <p className="cl-tools">{tools.map((t) => t.name).join(' · ')}</p>
          </div>
        </section>

        <section className="cl-sec" id="perguntas" aria-labelledby="cl-faq">
          <div className="cl-wrap cl-split">
            <Reveal className="cl-head">
              <h2 id="cl-faq">{pitch.faq.title}</h2>
            </Reveal>
            <Faq items={pitch.faq.items} />
          </div>
        </section>

        <section className="cl-sec cl-alt" id="sobre" aria-labelledby="cl-about">
          <div className="cl-wrap cl-about">
            <div className="cl-photo">
              <img src={profile.photo} alt={`Foto de ${profile.name}`} loading="lazy" />
            </div>
            <div className="cl-about-copy">
              <h2 id="cl-about">{pitch.about.title}</h2>
              {pitch.about.text.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="cl-cta" id="contato" aria-labelledby="cl-cta">
          <div className="cl-wrap">
            <h2 id="cl-cta">{pitch.cta.title}</h2>
            <p>{pitch.cta.text}</p>
            <div className="cl-actions">
              <a className="btn btn-lg cl-white" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                {pitch.cta.primary}
              </a>
              <a className="cl-textlink cl-textlink-light" href={emailLink}>
                {pitch.cta.secondary} <Icon name="arrow-up-right" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="cl-foot">
        <div className="cl-wrap">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p>
            <a href="#topo">Voltar ao topo</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
