import { useCallback, useMemo, useState } from 'react'
import { contact, coverOf, imageKind, profile, projects, quests, services, skillGroups } from '../content'
import { stepTitle } from '../fallback2d/palette'
import { useGameStore } from '../store/gameStore'
import { ThemeToggle } from '../theme/ThemeToggle'
import { THEME_IDS } from '../theme/themes'
import { THEMES } from '../theme/themes'
import { useThemeStore } from '../theme/themeStore'
import { Icon } from './Icon'
import { Alforje } from './landing/Alforje'
import { Counter } from './landing/Counter'
import { Crack } from './landing/Crack'
import { Edge } from './landing/Edge'
import { Faq } from './landing/Faq'
import { Gallery } from './landing/Gallery'
import { HeroGta } from './landing/HeroGta'
import { HeroKeyArt } from './landing/HeroKeyArt'
import { IntroLoader } from './landing/IntroLoader'
import { QuickNav } from './landing/QuickNav'
import { Reveal } from './landing/Reveal'
import { SectionHead } from './landing/SectionHead'
import { Showcase } from './landing/Showcase'
import { SideRail } from './landing/SideRail'
import { Ticker } from './landing/Ticker'
import { useActiveSection } from './landing/useActiveSection'
import { useScrollHud } from './landing/useScrollHud'
import './landing.css'

let introShown = false

const RAIL_IDS = ['visao-geral', 'projetos', 'servicos', 'missoes', 'destaque', 'galeria', 'stack', 'faq', 'contato']
const TOTAL = RAIL_IDS.length
const tagOf = (label: string) => label.toUpperCase().replace(/\s+/g, '_')

export function StartScreen() {
  const setMode = useGameStore((s) => s.setMode)
  const play = () => setMode('play')
  const theme = useThemeStore((s) => s.theme)
  const copy = THEMES[theme].copy
  const [loading, setLoading] = useState(!introShown)
  const done = useCallback(() => {
    introShown = true
    setLoading(false)
  }, [])
  const hud = useScrollHud<HTMLDivElement>()

  const nav = [
    { href: '#visao-geral', label: copy.nav.overview },
    { href: '#projetos', label: copy.nav.projects },
    { href: '#servicos', label: copy.nav.services },
    { href: '#galeria', label: copy.nav.gallery },
    { href: '#stack', label: copy.nav.stack },
  ]
  const railLabels = [copy.nav.overview, copy.nav.projects, copy.nav.services, copy.nav.process, copy.nav.featured, copy.nav.gallery, copy.nav.stack, copy.nav.faq, 'Contato']
  const active = useActiveSection(RAIL_IDS)

  const shots = useMemo(() => projects.flatMap((p) => p.images.map((img) => ({ ...img, color: p.color }))), [])
  const techCount = useMemo(
    () => new Set([...projects.flatMap((p) => p.stack), ...skillGroups.flatMap((g) => g.skills.map((s) => s.name))]).size,
    [],
  )
  const words = useMemo(() => {
    let start = 0
    return profile.name.split(' ').map((text) => {
      const w = { text, start }
      start += text.length + 1
      return w
    })
  }, [])
  const stats = [
    { n: projects.length, label: copy.stats[0] },
    { n: shots.length, label: copy.stats[1] },
    { n: techCount, label: copy.stats[2] },
  ]
  const feat = useMemo(() => [...projects].sort((a, b) => b.images.length - a.images.length)[0], [])
  const featDesktop = feat.images.filter((i) => imageKind(i) === 'desktop')
  const featMobile = feat.images.find((i) => imageKind(i) === 'mobile')
  const featIndex = projects.indexOf(feat)

  return (
    <div className={`landing${loading ? ' is-loading' : ' is-ready'}`} ref={hud}>
      {loading && <IntroLoader onDone={done} />}

      <div className="xp" aria-hidden="true">
        <span />
      </div>

      <div className="announce">
        <span>{copy.announce}</span>
        <button type="button" onClick={play}>
          {copy.announceCta} <Icon name="arrow-up-right" />
        </button>
      </div>

      <nav className="site-nav" aria-label="Seções">
        <div className="wrap nav-row">
          <a href="#topo" className="brand">
            <span className="brand-mark" aria-hidden="true">
              {profile.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </span>
            <span className="brand-name">{profile.name}</span>
          </a>
          <ul className="nav-links">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <ThemeToggle ids={THEME_IDS} />
            <a className="btn nav-contact" href="#contato">
              Contato
            </a>
            <button className="btn btn-primary" onClick={play}>
              Jogar <Icon name="arrow-up-right" />
            </button>
          </div>
        </div>
      </nav>

      <SideRail items={RAIL_IDS.map((id, i) => ({ id, label: railLabels[i] }))} active={active} />
      <QuickNav items={RAIL_IDS.map((id, i) => ({ id, label: railLabels[i] }))} active={active} />

      <header className="hero" id="topo" data-hero>
        <div className="hero-stage">
          <div className="hero-clean" aria-hidden="true" />
          <div className="hero-split" aria-hidden="true">
            <div className="hero-art">
              {theme === 'gta' ? <HeroGta /> : <HeroKeyArt />}
              <div className="hs-grain" />
            </div>
            <Crack />
          </div>
          <div className="hero-grid wrap">
            <div className="hero-content">
              <p className="hello pop" style={{ ['--i' as string]: 0 }}>
                <img src={profile.photo} alt="" />
                <span>
                  <em>{copy.badge}</em>
                  Olá, eu sou
                </span>
              </p>
              <h1 aria-label={profile.name}>
                {words.map((w) => (
                  <span key={w.start} className="word" aria-hidden="true">
                    {Array.from(w.text).map((ch, k) => (
                      <span key={k} className="letter" style={{ ['--i' as string]: w.start + k }}>
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>
              <p className="hero-title pop" style={{ ['--i' as string]: 4 }}>
                {profile.title}
              </p>
              <p className="hero-pitch pop" style={{ ['--i' as string]: 4 }}>
                {profile.pitch}
              </p>
              <div className="hero-actions pop" style={{ ['--i' as string]: 5 }}>
                <button className="btn btn-primary btn-lg" onClick={play}>
                  Jogar <Icon name="arrow-up-right" />
                </button>
                <button className="btn btn-lg" onClick={() => setMode('2d')}>
                  Versão rápida
                </button>
              </div>
              <ul className="hero-stats pop" style={{ ['--i' as string]: 6 }} aria-label="Em números">
                {stats.map((s) => (
                  <li key={s.label}>
                    <strong>{s.n}</strong>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>
              <p className="hero-hint pop" style={{ ['--i' as string]: 7 }}>
                Setas escolhem · Enter abre o tour · Esc volta
              </p>
            </div>
            <div className="hero-showcase">
              <Showcase />
            </div>
          </div>
          <a className="scroll-cue" href="#visao-geral" aria-label="Rolar para baixo">
            <span>{copy.scrollCue}</span>
            <i />
          </a>
        </div>
      </header>

      <Ticker items={[profile.name, profile.title, ...skillGroups.flatMap((g) => g.skills.map((k) => k.name)).slice(0, 6)]} />

      <main>
        {/* 01-02 · visão geral e projetos (escuro) */}
        <section className="overview" id="visao-geral" aria-label="Visão geral">
          <div className="wrap ov-grid">
            <aside className="ov-side">
              <Reveal>
                <h2 className="ov-name">{profile.name}</h2>
                <p className="ov-cta">
                  <button className="btn btn-lg" onClick={play}>
                    Jogar <Icon name="arrow-up-right" />
                  </button>
                </p>
                <div className="frame">
                  <div className="collage" aria-hidden="true">
                    {[...projects.map((pr) => coverOf(pr).src), shots.find((x) => x.height > x.width)?.src ?? coverOf(projects[0]).src].map((src, i) => (
                      <span key={i} className={`cell cell-${i}`}>
                        <img src={src} alt="" loading="lazy" />
                      </span>
                    ))}
                    <span className="cell cell-p">
                      <img src={profile.photo} alt="" loading="lazy" />
                    </span>
                  </div>
                  <figure className="poster">
                    <div className="poster-bg" />
                    <img src={profile.photo} alt={`Foto de ${profile.name}`} loading="lazy" />
                    <figcaption>{copy.posterTag}</figcaption>
                  </figure>
                </div>
              </Reveal>
            </aside>

            <div className="ov-main">
              <SectionHead level={3} index={1} total={TOTAL} tag={tagOf(copy.nav.overview)} title={copy.descTitle} />
              <Reveal>
                <p className="lead">{profile.bio}</p>
              </Reveal>

              <div className="stats">
                {stats.map((s, i) => (
                  <Reveal key={s.label} delay={i * 100} className="stat">
                    <strong>
                      <Counter to={s.n} />
                    </strong>
                    <span>{s.label}</span>
                  </Reveal>
                ))}
              </div>

              <SectionHead level={3} index={2} total={TOTAL} id="projetos" tag={tagOf(copy.nav.projects)} title={copy.projectsTitle} />
              <div className="proj-grid">
                {projects.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 2) * 110} className="proj-wrap">
                    <article className="proj" style={{ ['--accent' as string]: p.color }}>
                      <div className="proj-thumb">
                        <img src={coverOf(p).src} alt={coverOf(p).alt} loading="lazy" />
                        <span className="proj-tag">
                          {copy.level} {i + 1}
                        </span>
                      </div>
                      <div className="proj-body">
                        <h4>{p.title}</h4>
                        <p className="muted">{p.tagline}</p>
                        <ul className="chips">
                          {p.stack.slice(0, 4).map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                        <div className="proj-actions">
                          <button className="btn" onClick={play}>
                            Jogar
                          </button>
                          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                            Ver site <Icon name="arrow-up-right" />
                          </a>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 03 · serviços (claro: quebra de cor) */}
        <section className="services light" id="servicos" aria-label={copy.servicesTitle}>
          <Edge tone="light" label={`/// MÓDULO.${tagOf(copy.nav.services)} · ${services.length} frentes`} />
          <div className="wrap">
            <SectionHead index={3} total={TOTAL} tag={tagOf(copy.nav.services)} title={copy.servicesTitle}>
              <p className="muted">{copy.servicesText}</p>
            </SectionHead>
            <div className="svc-grid">
              {services.map((sv, i) => (
                <Reveal key={sv.title} delay={i * 100} className="svc-wrap">
                  <article className="svc">
                    <span className="svc-n">{String(i + 1).padStart(2, '0')}</span>
                    <Icon name={sv.icon} className="svc-icon" />
                    <h3>{sv.title}</h3>
                    <p>{sv.text}</p>
                    <span className="svc-bar" aria-hidden="true" />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 04 · missões / plano (escuro) */}
        <section className="process" id="missoes" aria-label={copy.processTitle}>
          <Edge tone="bg" label={`/// MÓDULO.${tagOf(copy.nav.process)} · ${quests.length} etapas`} />
          <div className="wrap">
            <SectionHead index={4} total={TOTAL} tag={tagOf(copy.nav.process)} title={copy.processTitle}>
              <p className="muted">{copy.processText}</p>
            </SectionHead>
            <ol className="steps">
              {quests.map((q, i) => (
                <Reveal key={q.title} as="li" delay={i * 130} className="step">
                  <span className="step-n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="step-dot" aria-hidden="true" />
                  <Icon name={q.icon} className="step-icon" />
                  <h3>{q.title}</h3>
                  <p>{q.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 05 · destaque (faixa de cor cheia: quebra de cor) */}
        <section className="featured" id="destaque" aria-label={copy.featuredTitle}>
          <Edge tone="accent" label={`/// MÓDULO.${tagOf(copy.nav.featured)} · ${feat.title}`} />
          <div className="wrap feat-grid">
            <Reveal from="left" className="feat-media">
              <div className="feat-frame">
                <div className="sc-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span className="sc-url">{new URL(feat.liveUrl).host}</span>
                </div>
                <img src={(featDesktop[1] ?? featDesktop[0]).src} alt={(featDesktop[1] ?? featDesktop[0]).alt} loading="lazy" />
              </div>
              {featMobile && (
                <div className="feat-phone" aria-hidden="true">
                  <img src={featMobile.src} alt="" loading="lazy" />
                </div>
              )}
            </Reveal>
            <Reveal from="right" className="feat-copy">
              <SectionHead index={5} total={TOTAL} tag={tagOf(copy.nav.featured)} title={copy.featuredTitle} />
              <p className="feat-kicker">
                {feat.kind} · {copy.level} {featIndex + 1}
              </p>
              <h3 className="feat-name">{feat.title}</h3>
              <p className="feat-desc">{feat.description}</p>
              <ul className="feat-list">
                {featDesktop.map((img) => (
                  <li key={img.src}>
                    <Icon name="check" /> {stepTitle(img.alt)}
                  </li>
                ))}
              </ul>
              <ul className="chips">
                {feat.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="feat-actions">
                <a className="btn btn-lg feat-btn" href={feat.liveUrl} target="_blank" rel="noopener noreferrer">
                  Ver site <Icon name="arrow-up-right" />
                </a>
                <button className="btn btn-lg" onClick={play}>
                  Entrar no portal
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 06 · galeria (escuro) */}
        <section className="gallery" id="galeria" aria-label={copy.galleryTitle}>
          <Edge tone="bg2" label={`/// MÓDULO.${tagOf(copy.nav.gallery)} · ${shots.length} arquivos`} />
          <div className="wrap">
            <SectionHead index={6} total={TOTAL} tag={tagOf(copy.nav.gallery)} title={copy.galleryTitle}>
              <p className="muted">{copy.galleryText}</p>
            </SectionHead>
            <Gallery />
          </div>
        </section>

        {/* 07 · stack / arsenal (escuro) */}
        <section className="stack" id="stack" aria-label={copy.stackTitle}>
          <Edge tone="bg" label={`/// MÓDULO.${tagOf(copy.nav.stack)} · ${techCount} itens`} />
          <div className="wrap">
            <SectionHead index={7} total={TOTAL} tag={tagOf(copy.nav.stack)} title={copy.stackTitle}>
              <p className="muted">{copy.stackText}</p>
            </SectionHead>
            <Reveal from="zoom" delay={120} className="frame">
              <Alforje />
            </Reveal>
          </div>
        </section>

        {/* 08 · perguntas (claro: quebra de cor) */}
        <section className="faq light" id="faq" aria-label={copy.faqTitle}>
          <Edge tone="light" label="/// MÓDULO.PERGUNTAS · respostas rápidas" />
          <div className="wrap faq-grid">
            <div>
              <SectionHead index={8} total={TOTAL} tag={tagOf(copy.nav.faq)} title={copy.faqTitle}>
                <p className="muted">{copy.faqText}</p>
              </SectionHead>
            </div>
            <Reveal from="right">
              <Faq />
            </Reveal>
          </div>
        </section>

        {/* 09 · contato (escuro, com arte) */}
        <section className="contact" id="contato" aria-label={copy.contactTitle}>
          <Edge tone="bg" label="/// MÓDULO.CONTATO · canal aberto" />
          <div className="contact-art" aria-hidden="true">
            <i className="ca-sun" />
            <i className="ca-ring" />
          </div>
          <div className="big-type" aria-hidden="true">
            <span>Vamos conversar · Vamos conversar · Vamos conversar · Vamos conversar ·</span>
          </div>
          <div className="wrap contact-grid">
            <Reveal from="left">
              <SectionHead index={9} total={TOTAL} tag="CONTATO" title={copy.contactTitle} />
              <p className="lead">{copy.contactText}</p>
              <div className="contact-actions">
                <a className="btn btn-primary btn-lg" href={`mailto:${contact.email}`}>
                  <Icon name="mail" /> Enviar email
                </a>
                <button className="btn btn-lg" onClick={play}>
                  Jogar agora <Icon name="arrow-up-right" />
                </button>
              </div>
            </Reveal>
            <Reveal from="right" className="contact-side">
              <div className="chat" aria-hidden="true">
                <p className="bub in">Olá! Tenho uma ideia de sistema.</p>
                <p className="bub out">Vamos conversar! Me conta o que você precisa.</p>
                <p className="bub typing">
                  <i />
                  <i />
                  <i />
                </p>
              </div>
              <ul className="contact-list">
                {[
                  { label: 'Email', href: `mailto:${contact.email}`, icon: 'mail', ext: false },
                  { label: 'GitHub', href: contact.github, icon: 'github', ext: true },
                  { label: 'LinkedIn', href: contact.linkedin, icon: 'linkedin', ext: true },
                  { label: 'WhatsApp', href: contact.whatsapp, icon: 'chat', ext: true },
                ].map((c) => (
                  <li key={c.label}>
                    <a href={c.href} {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      <span>
                        <Icon name={c.icon} /> {c.label}
                      </span>
                      <Icon name="arrow-up-right" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <p>
            © {new Date().getFullYear()} {profile.name} · feito com React
          </p>
        </div>
      </footer>
    </div>
  )
}
