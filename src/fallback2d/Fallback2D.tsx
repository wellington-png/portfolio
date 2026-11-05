import { projects } from '../content'
import { useGameStore } from '../store/gameStore'
import { ContactSection, ProfileSection, ProjectDetail, SkillsSection } from '../ui/sections'

export function Fallback2D() {
  const notice = useGameStore((s) => s.notice)
  const setMode = useGameStore((s) => s.setMode)

  return (
    <main className="fallback">
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      <button className="btn" onClick={() => setMode('menu')}>
        Entrar no mundo 3D
      </button>
      <ProfileSection />
      <section className="section">
        <h2>Projetos</h2>
        <div className="grid">
          {projects.map((p) => (
            <ProjectDetail key={p.id} project={p} />
          ))}
        </div>
      </section>
      <SkillsSection />
      <ContactSection />
    </main>
  )
}
