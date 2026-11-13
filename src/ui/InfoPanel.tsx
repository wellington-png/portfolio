import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { contact, coverOf, profile, projects, services, skillGroups } from '../content'
import { useGameStore, type PanelId } from '../store/gameStore'
import { Counter } from './landing/Counter'
import { Alforje } from './landing/Alforje'
import { Icon } from './Icon'

const TITLES: Record<PanelId, string> = { about: 'Sobre mim', skills: 'Skills', contact: 'Contato' }
export const PANEL_ORDER: PanelId[] = ['about', 'skills', 'contact']

function Head({ id, title, text }: { id: PanelId; title: string; text?: string }) {
  const i = PANEL_ORDER.indexOf(id) + 1
  return (
    <header className="pn-head">
      <p className="pn-meta">
        <span>
          {String(i).padStart(2, '0')}
          <i> / {String(PANEL_ORDER.length).padStart(2, '0')}</i>
        </span>
        <b>/// {title.toUpperCase().replace(/\s+/g, '_')}</b>
        <span className="pn-line" />
      </p>
      <h2>{title}</h2>
      {text && <p className="muted">{text}</p>}
    </header>
  )
}

/** Quantos projetos usam cada ferramenta, em ordem. Só entra quem aparece em algum projeto. */
export function usageRanking() {
  const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name))
  return names
    .map((name) => ({ name, count: projects.filter((p) => p.stack.some((t) => t.toLowerCase() === name.toLowerCase())).length }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

function About() {
  const select = useGameStore((s) => s.select)
  const openTour = useGameStore((s) => s.openTour)
  const closePanel = useGameStore((s) => s.closePanel)
  const techCount = new Set([...projects.flatMap((p) => p.stack), ...skillGroups.flatMap((g) => g.skills.map((s) => s.name))]).size
  const screens = projects.reduce((n, p) => n + p.images.length, 0)

  const go = (i: number) => {
    select(i)
    closePanel()
    openTour()
  }

  return (
    <div className="pn-about" key="about">
      <figure className="pn-photo">
        <span className="pn-photo-bg" />
        <img src={profile.photo} alt={`Foto de ${profile.name}`} />
        <figcaption>
          <b>{profile.name}</b>
          <span>Classe · {profile.title}</span>
        </figcaption>
      </figure>

      <div className="pn-body">
        <Head id="about" title="Sobre mim" />
        <p className="lead">{profile.bio}</p>
        <div className="pn-stats">
          <div>
            <strong>
              <Counter to={projects.length} />
            </strong>
            <span>Projetos</span>
          </div>
          <div>
            <strong>
              <Counter to={screens} />
            </strong>
            <span>Telas</span>
          </div>
          <div>
            <strong>
              <Counter to={techCount} />
            </strong>
            <span>Ferramentas</span>
          </div>
        </div>
        <h3 className="pn-sub">Especialidades</h3>
        <ul className="chips pn-chips">
          {services.map((s) => (
            <li key={s.title}>
              <Icon name={s.icon} /> {s.title}
            </li>
          ))}
        </ul>
        <p className="links pn-links">
          <a className="btn" href={contact.github} target="_blank" rel="noopener noreferrer">
            <Icon name="github" /> GitHub
          </a>
          <a className="btn" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <Icon name="linkedin" /> LinkedIn
          </a>
        </p>
      </div>

      <aside className="pn-missions" aria-label="Missões concluídas">
        <h3 className="pn-sub">Missões concluídas</h3>
        <ol>
          {projects.map((p, i) => (
            <li key={p.id} style={{ ['--c' as string]: p.color, ['--k' as string]: i }}>
              <button type="button" onClick={() => go(i)}>
                <img src={coverOf(p).src} alt="" loading="lazy" />
                <span>
                  <b>{p.title}</b>
                  <em>{p.kind}</em>
                </span>
                <Icon name="play" />
                <span className="pn-sr">Ver o tour de {p.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  )
}

function Skills() {
  const ranking = useMemo(usageRanking, [])
  return (
    <div className="pn-skills" key="skills">
      <Head id="skills" title="Skills" text="Escolha uma gaveta da roda para ver as ferramentas e em quais projetos elas aparecem." />
      <Alforje />
      <h3 className="pn-sub">Mais usadas nos projetos</h3>
      <ul className="pn-usage">
        {ranking.slice(0, 7).map((r, i) => (
          <li key={r.name} style={{ ['--w' as string]: `${(r.count / projects.length) * 100}%`, ['--k' as string]: i }}>
            <span>{r.name}</span>
            <i aria-hidden="true" />
            <b>
              {r.count}/{projects.length}
            </b>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <div className="pn-contact" key="contact">
      <div className="pn-contact-l">
        <Head id="contact" title="Contato" text="Vamos conversar sobre o seu próximo projeto?" />
        <div className="chat pn-chat" aria-hidden="true">
          <p className="bub in">Olá! Tenho uma ideia de sistema.</p>
          <p className="bub out">Vamos conversar! Me conta o que você precisa.</p>
          <p className="bub typing">
            <i />
            <i />
            <i />
          </p>
        </div>
        <div className="pn-actions">
          <a className="btn btn-primary btn-lg pn-cta" href={`mailto:${contact.email}`}>
            <Icon name="mail" /> Enviar email
          </a>
          <button type="button" className="btn btn-lg" onClick={copy}>
            <Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Email copiado' : 'Copiar email'}
          </button>
        </div>
        <p className="pn-live" role="status">
          {copied ? `${contact.email} copiado para a área de transferência.` : ''}
        </p>
      </div>
      <ul className="contact-list">
        {[
          { label: 'Email', href: `mailto:${contact.email}`, icon: 'mail', ext: false },
          { label: 'GitHub', href: contact.github, icon: 'github', ext: true },
          { label: 'LinkedIn', href: contact.linkedin, icon: 'linkedin', ext: true },
          { label: 'WhatsApp', href: contact.whatsapp, icon: 'chat', ext: true },
        ].map((c, i) => (
          <li key={c.label} style={{ ['--k' as string]: i }}>
            <a href={c.href} {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span>
                <Icon name={c.icon} /> {c.label}
              </span>
              <Icon name="arrow-up-right" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InfoPanel() {
  const panel = useGameStore((s) => s.panel)
  const openPanel = useGameStore((s) => s.openPanel)
  const closePanel = useGameStore((s) => s.closePanel)
  const closeRef = useRef<HTMLButtonElement>(null)

  const opener = useRef<HTMLElement | null>(null)
  const open = panel !== null

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()
    return () => {
      opener.current?.focus()
      opener.current = null
    }
  }, [open])

  const trapTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const items = e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!panel) return null

  return (
    <div
      className="panel-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePanel()
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={TITLES[panel]} className={`panel panel-wide panel-${panel}`} onKeyDown={trapTab}>
        <div className="pn-top">
          <button ref={closeRef} className="panel-close" aria-label="Fechar" onClick={closePanel}>
            <Icon name="close" />
          </button>
          <div className="pn-tabs" role="group" aria-label="Painéis">
            {PANEL_ORDER.map((id, i) => (
              <button key={id} type="button" aria-pressed={panel === id} onClick={() => openPanel(id)}>
                <i aria-hidden="true">{String(i + 1).padStart(2, '0')}</i>
                {TITLES[id]}
              </button>
            ))}
          </div>
          <p className="pn-keys" aria-hidden="true">
            <kbd>←</kbd>
            <kbd>→</kbd> trocar <kbd>Esc</kbd> fechar
          </p>
        </div>

        {panel === 'about' && <About />}
        {panel === 'skills' && <Skills />}
        {panel === 'contact' && <Contact />}
      </div>
    </div>
  )
}
