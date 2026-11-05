# Galeria de portais 3D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar o jogo do carrinho por um salão 3D neon com um portal por projeto; clicar num portal atravessa a moldura e leva a uma sala 3D temática com os prints reais do projeto, parallax pelo mouse e um HUD com detalhes.

**Architecture:** Estado de navegação (`phase`: hub → entering → room → leaving, `activeProject`, `focusedImage`, `panel`) vive no store zustand. Lógica pura (layout dos portais e das telas, navegação de imagens, parallax) fica em módulos pequenos e testados. A cena usa React Three Fiber: `PortalFrame` (moldura + capa, e `MeshPortalMaterial` com a sala viva só em hover/entrada), `CameraRig` (única fonte de movimento da câmera, concluindo as transições quando chega na pose), `ProjectRoom` (template da sala). Painéis e HUD são HTML sobre o canvas.

**Tech Stack:** Vite, React 19, TypeScript, three, @react-three/fiber 9, @react-three/drei 10 (`MeshPortalMaterial`, `Image`, `Grid`, `Sparkles`, `Html`, `useCursor`), @react-three/postprocessing, maath (easing), zustand, Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-05-portal-gallery-design.md`

**Estado de partida:** branch `feat/game-portfolio`, commit `72f49cc`. Já existem e são reaproveitados: scaffold Vite/Vitest, `src/content/*` (será estendido), `src/lib/capabilities.ts`, `src/world/{quality,skyline,Skyline,Effects,NeonMaterial}`, `src/ui/{sections,StartScreen,GameErrorBoundary}`, `src/fallback2d/Fallback2D`, `src/App.tsx`, `src/main.tsx`, `src/styles.css`.

**Convenções do plano:** `S` = pasta do projeto `/home/wellington/Documentos/www/postfolio`. Um servidor `npm run dev` pode estar rodando em `http://127.0.0.1:5173`; não suba outro. Cena 3D não tem teste automatizado: a verificação é `npx tsc --noEmit`, `npx vitest run` e `npm run build`, mais conferência visual do usuário.

---

## File Structure

```
public/shots/*.webp                  # 18 prints baixados de tymos.app
scripts/gen-shot-dims.mjs            # gera src/content/shotDims.ts
src/content/
  types.ts images.ts shotDims.ts projects.ts skills.ts profile.ts contact.ts index.ts content.test.ts
src/lib/
  gallery.ts gallery.test.ts parallax.ts parallax.test.ts capabilities.ts(existente)
src/store/gameStore.ts gameStore.test.ts      # reescritos
src/world/
  hallLayout.ts hallLayout.test.ts roomLayout.ts roomLayout.test.ts   # puros
  motion.ts portalRegistry.ts TextureBoundary.tsx TextureBoundary.test.tsx
  PortalFrame.tsx Hall.tsx CameraRig.tsx ProjectRoom.tsx ImageScreen.tsx RoomScreens.tsx
  quality.ts quality.test.ts Skyline.tsx Effects.tsx NeonMaterial.tsx skyline.ts   # existentes
src/ui/
  TopMenu.tsx InfoPanel.tsx ProjectHud.tsx useGameKeys.ts overlay.css (+ testes)
  sections.tsx StartScreen.tsx GameErrorBoundary.tsx                               # existentes
src/game/Game.tsx
```

---

### Task 1: Remover o carrinho, a física e o HUD antigo

**Files:**
- Delete: `src/vehicle/`, `src/zones/`, `src/world/Arena.tsx`, `src/ui/{Minimap,GuideArrow,JoystickPad,Hud,ZonePanel}.tsx`, `src/ui/hud.css`, `src/ui/{useRaf,guide,useInteractKeys}.ts`, `src/ui/{guide.test.ts,ZonePanel.test.tsx,useInteractKeys.test.tsx}`
- Modify: `src/game/Game.tsx`, `src/styles.css`, `package.json`

- [ ] **Step 1: Apagar os arquivos**

```bash
cd /home/wellington/Documentos/www/postfolio
git rm -rq src/vehicle src/zones src/world/Arena.tsx \
  src/ui/Minimap.tsx src/ui/GuideArrow.tsx src/ui/JoystickPad.tsx src/ui/Hud.tsx src/ui/ZonePanel.tsx src/ui/hud.css \
  src/ui/useRaf.ts src/ui/guide.ts src/ui/useInteractKeys.ts \
  src/ui/guide.test.ts src/ui/ZonePanel.test.tsx src/ui/useInteractKeys.test.tsx
npm uninstall @react-three/rapier
```
Expected: `package.json` não lista mais `@react-three/rapier`.

- [ ] **Step 2: Reescrever `src/game/Game.tsx` (cena mínima, sem física)**

```tsx
import { Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useGameStore } from '../store/gameStore'
import { Effects } from '../world/Effects'
import { QUALITY_SETTINGS } from '../world/quality'
import { Skyline } from '../world/Skyline'

export default function Game() {
  const quality = useGameStore((s) => s.quality)
  const settings = QUALITY_SETTINGS[quality]

  return (
    <>
      <Canvas
        dpr={settings.dpr}
        camera={{ position: [0, 1.7, 6], fov: 55, near: 0.1, far: 400 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05050d']} />
        <fog attach="fog" args={['#05050d', 18, 120]} />
        <ambientLight intensity={0.5} color="#6a5cff" />
        <PerformanceMonitor
          onDecline={() => useGameStore.getState().lowerQuality()}
          onIncline={() => useGameStore.getState().raiseQuality()}
          onFallback={() => useGameStore.getState().setQuality('low')}
        />
        <Suspense fallback={null}>
          <Skyline />
        </Suspense>
        <Effects />
      </Canvas>
      <Loader />
    </>
  )
}
```

- [ ] **Step 3: Remover do `src/styles.css` as regras `.zone-label`, `.zone-label.visited` e `.skill-icon`** (o bloco acrescentado no fim do arquivo pela Task 13 antiga). Não mexer no resto.

- [ ] **Step 4: Verificar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx tsc --noEmit && npx vitest run && npm run build`
Expected: tipos sem erro; testes passam (restam os de content, lib, store, world, ui/sections, fallback2d, GameErrorBoundary); build conclui.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove car mechanic, physics and old HUD"
```

---

### Task 2: Conteúdo real, prints locais e galeria 2D

**Files:**
- Create: `scripts/gen-shot-dims.mjs`, `public/shots/*.webp` (18), `src/content/images.ts`, `src/content/shotDims.ts` (gerado)
- Modify: `package.json`, `tsconfig.json`, `src/content/types.ts`, `projects.ts`, `skills.ts`, `index.ts`, `content.test.ts`, `src/ui/sections.tsx`, `src/ui/sections.test.tsx`, `src/styles.css`
- `src/content/profile.ts` e `contact.ts` não mudam.

- [ ] **Step 1: `@types/node` e tsconfig (o teste de conteúdo lê o disco)**

```bash
cd /home/wellington/Documentos/www/postfolio && npm install -D @types/node
```
Em `tsconfig.json`, trocar `"types": ["vite/client", "vitest/globals"]` por `"types": ["vite/client", "vitest/globals", "node"]`.

- [ ] **Step 2: Baixar os 18 prints**

```bash
cd /home/wellington/Documentos/www/postfolio && mkdir -p public/shots && for f in barbuz-agenda barbuz-inicio barber-agenda-cliente barber-dashboard-mobile occlo-agenda occlo-prontuario occlo-financeiro occlo-whatsapp occlo-anamnese-mobile appbov-dashboard appbov-animais appbov-calendario appbov-reproducao app-appbov-sanidade izzi-dashboard izzi-calendario izzi-curso app-izzi-inicio; do curl -fsS -o "public/shots/$f.webp" "https://tymos.app/shots/$f.webp" || echo "FALHOU $f"; done; ls public/shots | wc -l
```
Expected: `18`, sem linhas `FALHOU`.

- [ ] **Step 3: Criar `scripts/gen-shot-dims.mjs`** (lê o cabeçalho dos .webp e gera as dimensões)

```js
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'public/shots'

function dims(buf) {
  const fmt = buf.toString('ascii', 12, 16)
  if (fmt === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)]
  if (fmt === 'VP8L') {
    const b = buf.readUInt32LE(21)
    return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)]
  }
  if (fmt === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff]
  throw new Error(`formato webp desconhecido: ${fmt}`)
}

const entries = readdirSync(dir)
  .filter((f) => f.endsWith('.webp'))
  .sort()
  .map((f) => {
    const [w, h] = dims(readFileSync(join(dir, f)))
    return `  '${f.replace('.webp', '')}': [${w}, ${h}],`
  })

writeFileSync(
  'src/content/shotDims.ts',
  `// Gerado por scripts/gen-shot-dims.mjs — não editar à mão.\nexport const shotDims: Record<string, [number, number]> = {\n${entries.join('\n')}\n}\n`,
)
console.log(`${entries.length} imagens`)
```

Run: `cd /home/wellington/Documentos/www/postfolio && node scripts/gen-shot-dims.mjs && cat src/content/shotDims.ts`
Expected: `18 imagens` e um objeto com 18 pares `[largura, altura]` plausíveis (todos > 100).

- [ ] **Step 4: Escrever o teste que falha** — substituir `src/content/content.test.ts`

```ts
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
```

- [ ] **Step 5: Rodar e ver falhar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run src/content`
Expected: FAIL (`coverOf`/`imageKind` não exportados; projetos antigos).

- [ ] **Step 6: Implementar o conteúdo**

`src/content/types.ts`:
```ts
export interface Profile {
  name: string
  title: string
  bio: string
}

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  /** Ex.: "Produto próprio" ou "Feito para cliente" */
  kind: string
  stack: string[]
  liveUrl: string
  color: string
  images: ProjectImage[]
}

export interface Skill {
  name: string
  icon: string
}

export interface SkillGroup {
  id: string
  label: string
  skills: Skill[]
}

export interface Contact {
  email: string
  github: string
  linkedin: string
  whatsapp: string
}
```

`src/content/images.ts`:
```ts
import type { Project, ProjectImage } from './types'

export type ImageKind = 'desktop' | 'mobile'

export function imageKind(img: ProjectImage): ImageKind {
  return img.height > img.width ? 'mobile' : 'desktop'
}

export function coverOf(project: Project): ProjectImage {
  return project.images[0]
}
```

`src/content/projects.ts`:
```ts
import { shotDims } from './shotDims'
import type { Project, ProjectImage } from './types'

function shot(file: string, alt: string): ProjectImage {
  const dims = shotDims[file]
  if (!dims) throw new Error(`Sem dimensões para o print "${file}". Rode: node scripts/gen-shot-dims.mjs`)
  return { src: `/shots/${file}.webp`, alt, width: dims[0], height: dims[1] }
}

export const projects: Project[] = [
  {
    id: 'barbuz',
    title: 'Barbuz',
    tagline: 'Gestão completa de barbearia',
    description:
      'Agenda, equipe, fidelidade e pagamento online, com multi-tenant, whitelabel por domínio, controle de comissão e agendamento feito pelo próprio cliente. Primeira versão em 2 meses.',
    kind: 'Produto próprio',
    stack: ['Django', 'DRF', 'PostgreSQL', 'Celery', 'Next.js', 'Firebase Auth'],
    liveUrl: 'https://barbuz.com.br',
    color: '#ff2bd6',
    images: [
      shot('barbuz-agenda', 'Barbuz: agenda mensal e semanal com filtro por barbeiro'),
      shot('barbuz-inicio', 'Barbuz: painel inicial com faturamento do dia e do mês'),
      shot('barber-agenda-cliente', 'Barbuz: tela de agendamento feita pelo cliente'),
      shot('barber-dashboard-mobile', 'Barbuz: painel no celular'),
    ],
  },
  {
    id: 'occlo',
    title: 'Occlo',
    tagline: 'Gestão de clínica odontológica',
    description:
      'Agenda por dentista, prontuário com odontograma e anamnese, orçamentos, financeiro, comissões e WhatsApp com IA que atende pacientes e faz a triagem. Suporta várias clínicas por conta.',
    kind: 'Produto próprio',
    stack: ['Django', 'DRF', 'PostgreSQL', 'Celery', 'Redis', 'Next.js', 'Firebase Auth'],
    liveUrl: 'https://occlo.com.br',
    color: '#00f0ff',
    images: [
      shot('occlo-agenda', 'Occlo: agenda do dia com uma coluna por dentista'),
      shot('occlo-prontuario', 'Occlo: prontuário do paciente com odontograma'),
      shot('occlo-financeiro', 'Occlo: fluxo de caixa com previsão de 30 dias'),
      shot('occlo-whatsapp', 'Occlo: atendimento por WhatsApp com IA'),
      shot('occlo-anamnese-mobile', 'Occlo: anamnese no celular'),
    ],
  },
  {
    id: 'appbov',
    title: 'AppBov',
    tagline: 'Gestão de rebanho para pecuaristas',
    description:
      'Rebanho, calendário sanitário, reprodução (incluindo IATF), nutrição e confinamento, e financeiro, no computador e no celular, com várias propriedades por conta e papéis de equipe. Primeira versão em 3 meses.',
    kind: 'Produto próprio',
    stack: ['Django', 'DRF', 'PostgreSQL', 'Celery', 'Redis', 'Next.js', 'Flutter'],
    liveUrl: 'https://appbov.com.br',
    color: '#39ff88',
    images: [
      shot('appbov-dashboard', 'AppBov: a fazenda num relance'),
      shot('appbov-animais', 'AppBov: ficha de cada animal com busca e filtros'),
      shot('appbov-calendario', 'AppBov: calendário sanitário'),
      shot('appbov-reproducao', 'AppBov: painel de reprodução'),
      shot('app-appbov-sanidade', 'AppBov: sanidade no aplicativo do celular'),
    ],
  },
  {
    id: 'diae',
    title: 'Diaê',
    tagline: 'Escola de inglês online',
    description:
      'Aula ao vivo, cursos e módulos com progresso, atividades, registro de aulas, faturas e aplicativo mobile, feito para uma escola de Curitiba. Primeira versão em 2 meses.',
    kind: 'Feito para cliente',
    stack: ['Django', 'DRF', 'PostgreSQL', 'Celery', 'LiveKit', 'Flutter'],
    liveUrl: 'https://diae.com.br',
    color: '#9d4dff',
    images: [
      shot('izzi-dashboard', 'Diaê: painel do aluno'),
      shot('izzi-calendario', 'Diaê: calendário semanal de aulas ao vivo'),
      shot('izzi-curso', 'Diaê: curso e módulos com progresso'),
      shot('app-izzi-inicio', 'Diaê: início no aplicativo mobile'),
    ],
  },
]
```

`src/content/skills.ts` (derivado da stack dos projetos; o usuário pode ajustar):
```ts
import type { SkillGroup } from './types'

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Front-end',
    skills: [
      { name: 'Next.js', icon: '▲' },
      { name: 'React', icon: '⚛️' },
      { name: 'TypeScript', icon: 'TS' },
      { name: 'Flutter', icon: '🐦' },
    ],
  },
  {
    id: 'backend',
    label: 'Back-end',
    skills: [
      { name: 'Python', icon: '🐍' },
      { name: 'Django', icon: '🎸' },
      { name: 'DRF', icon: '🔌' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Celery', icon: '🥬' },
      { name: 'Redis', icon: '🟥' },
    ],
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    skills: [
      { name: 'Docker', icon: '🐳' },
      { name: 'Git', icon: '🔀' },
      { name: 'Firebase Auth', icon: '🔥' },
      { name: 'LiveKit', icon: '🎥' },
    ],
  },
]
```

`src/content/index.ts`:
```ts
export * from './types'
export { coverOf, imageKind } from './images'
export type { ImageKind } from './images'
export { profile } from './profile'
export { projects } from './projects'
export { skillGroups } from './skills'
export { contact } from './contact'
```

- [ ] **Step 7: Atualizar `ProjectDetail` em `src/ui/sections.tsx`** (substituir só essa função)

```tsx
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
```

Acrescentar ao fim de `src/styles.css`:
```css
.shots { list-style: none; padding: 0; margin: 12px 0; display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.shots img { width: 100%; height: auto; display: block; border: 1px solid var(--accent); border-radius: 6px; }
```

- [ ] **Step 8: Atualizar `src/ui/sections.test.tsx`** — trocar apenas o teste do `ProjectDetail`:

```tsx
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
```

- [ ] **Step 9: Rodar tudo**

Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run && npx tsc --noEmit && npm run build`
Expected: todos os testes passam (incl. `src/fallback2d`, que não muda), tipos e build ok.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: real Tymos projects with local screenshots and 2D gallery"
```

---

### Task 3: Funções puras (navegação de imagens, parallax, layouts)

**Files:**
- Create: `src/lib/gallery.ts`, `src/lib/parallax.ts`, `src/world/hallLayout.ts`, `src/world/roomLayout.ts`
- Test: `src/lib/gallery.test.ts`, `src/lib/parallax.test.ts`, `src/world/hallLayout.test.ts`, `src/world/roomLayout.test.ts`

- [ ] **Step 1: Escrever os testes que falham**

`src/lib/gallery.test.ts`:
```ts
import { stepIndex } from './gallery'

describe('stepIndex', () => {
  it('starts at the first image going forward and at the last going back', () => {
    expect(stepIndex(null, 1, 5)).toBe(0)
    expect(stepIndex(null, -1, 5)).toBe(4)
  })
  it('moves by one', () => {
    expect(stepIndex(1, 1, 5)).toBe(2)
    expect(stepIndex(3, -1, 5)).toBe(2)
  })
  it('wraps around', () => {
    expect(stepIndex(4, 1, 5)).toBe(0)
    expect(stepIndex(0, -1, 5)).toBe(4)
  })
  it('returns null when there are no images', () => {
    expect(stepIndex(null, 1, 0)).toBeNull()
  })
})
```

`src/lib/parallax.test.ts`:
```ts
import { parallaxOffset } from './parallax'

describe('parallaxOffset', () => {
  it('scales the pointer by the strength per axis', () => {
    expect(parallaxOffset({ x: 0.5, y: -1 }, { x: 2, y: 4 })).toEqual({ x: 1, y: -4 })
  })
  it('clamps the pointer to [-1, 1]', () => {
    expect(parallaxOffset({ x: 3, y: -3 }, { x: 1, y: 1 })).toEqual({ x: 1, y: -1 })
  })
  it('is zero at the center', () => {
    expect(parallaxOffset({ x: 0, y: 0 }, { x: 5, y: 5 })).toEqual({ x: 0, y: 0 })
  })
})
```

`src/world/hallLayout.test.ts`:
```ts
import { PORTAL_WIDTH, portalPlacements } from './hallLayout'

describe('portalPlacements', () => {
  it('returns one placement per portal', () => {
    expect(portalPlacements(4)).toHaveLength(4)
    expect(portalPlacements(0)).toEqual([])
  })

  it('is symmetric around x = 0', () => {
    const p = portalPlacements(4)
    expect(p[0].position[0]).toBeCloseTo(-p[3].position[0])
    expect(p[1].position[0]).toBeCloseTo(-p[2].position[0])
  })

  it('keeps neighbors farther apart than the portal width', () => {
    const p = portalPlacements(4)
    for (let i = 0; i < p.length - 1; i++) {
      const d = Math.hypot(p[i].position[0] - p[i + 1].position[0], p[i].position[2] - p[i + 1].position[2])
      expect(d).toBeGreaterThan(PORTAL_WIDTH)
    }
  })

  it('turns the outer portals toward the center', () => {
    const p = portalPlacements(4)
    expect(p[0].rotationY).toBeGreaterThan(0)
    expect(p[3].rotationY).toBeLessThan(0)
  })

  it('puts a single portal at the center, facing front', () => {
    const [only] = portalPlacements(1)
    expect(only.position[0]).toBeCloseTo(0)
    expect(only.rotationY).toBeCloseTo(0)
  })
})
```

`src/world/roomLayout.test.ts`:
```ts
import { fitDistance, screenPlacements } from './roomLayout'

const desktop = { width: 1600, height: 1000 }
const phone = { width: 400, height: 800 }

describe('screenPlacements', () => {
  const s = screenPlacements([desktop, phone, desktop])

  it('classifies and sizes screens by aspect', () => {
    expect(s[0].kind).toBe('desktop')
    expect(s[0].width).toBeCloseTo(2.6)
    expect(s[0].height).toBeCloseTo(2.6 / 1.6)
    expect(s[1].kind).toBe('mobile')
    expect(s[1].height).toBeCloseTo(2.2)
    expect(s[1].width).toBeCloseTo(1.1)
  })

  it('lays screens left to right without overlap', () => {
    for (let i = 0; i < s.length - 1; i++) {
      const rightEdge = s[i].position[0] + s[i].width / 2
      const nextLeftEdge = s[i + 1].position[0] - s[i + 1].width / 2
      expect(nextLeftEdge - rightEdge).toBeGreaterThanOrEqual(0.59)
    }
  })

  it('is centered on x = 0', () => {
    const left = s[0].position[0] - s[0].width / 2
    const last = s[s.length - 1]
    const right = last.position[0] + last.width / 2
    expect(left).toBeCloseTo(-right)
  })

  it('keeps the original index', () => {
    expect(s.map((x) => x.index)).toEqual([0, 1, 2])
  })

  it('handles an empty list', () => {
    expect(screenPlacements([])).toEqual([])
  })
})

describe('fitDistance', () => {
  it('fits the taller dimension with 25% margin', () => {
    // fov 90 => tan(45deg) = 1; height 2 => 1 * 1.25
    expect(fitDistance(1, 2, 90, 1)).toBeCloseTo(1.25)
  })
  it('fits the wider dimension on narrow viewports', () => {
    // width 4 on aspect 1 => 2 * 1.25
    expect(fitDistance(4, 1, 90, 1)).toBeCloseTo(2.5)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run src/lib src/world/hallLayout src/world/roomLayout`
Expected: FAIL (módulos não existem).

- [ ] **Step 3: Implementar**

`src/lib/gallery.ts`:
```ts
/** Próximo índice de imagem (circular). `current` null = nenhuma em foco ainda. */
export function stepIndex(current: number | null, delta: 1 | -1, count: number): number | null {
  if (count <= 0) return null
  if (current === null) return delta > 0 ? 0 : count - 1
  return (current + delta + count) % count
}
```

`src/lib/parallax.ts`:
```ts
export interface Vec2 {
  x: number
  y: number
}

const clamp = (v: number) => Math.max(-1, Math.min(1, v))

/** pointer em [-1, 1] (coordenadas normalizadas do R3F) -> deslocamento em unidades do mundo. */
export function parallaxOffset(pointer: Vec2, strength: Vec2): Vec2 {
  return { x: clamp(pointer.x) * strength.x, y: clamp(pointer.y) * strength.y }
}
```

`src/world/hallLayout.ts`:
```ts
export const CAMERA_FOV = 55
export const PORTAL_WIDTH = 2.2
export const PORTAL_HEIGHT = 3.4
export const PORTAL_CENTER_Y = 1.9

const ARC_RADIUS = 6
const ARC_STEP = 0.45 // rad entre portais vizinhos
const ARC_CENTER_Z = -4

export interface PortalPlacement {
  position: [number, number, number]
  rotationY: number
}

/** Portais num arco côncavo voltado para a câmera; os das pontas ficam mais perto e viram para o centro. */
export function portalPlacements(count: number): PortalPlacement[] {
  return Array.from({ length: count }, (_, i) => {
    const theta = (i - (count - 1) / 2) * ARC_STEP
    return {
      position: [
        ARC_RADIUS * Math.sin(theta),
        PORTAL_CENTER_Y,
        ARC_CENTER_Z + ARC_RADIUS * (1 - Math.cos(theta)),
      ],
      rotationY: -theta,
    }
  })
}

/** Pose da câmera no salão (coordenadas do mundo). */
export const HUB_CAMERA = {
  position: [0, 1.7, 6],
  lookAt: [0, 1.9, -3],
} as const

/** Poses da câmera dentro da sala, em coordenadas locais do portal. */
export const ROOM_ENTRY = {
  position: [0, 0, 0.35],
  lookAt: [0, 0, -3],
} as const

export const ROOM_OVERVIEW = {
  position: [0, 0.2, 3.5],
  lookAt: [0, -0.1, -5],
} as const
```

`src/world/roomLayout.ts`:
```ts
export const ROOM_FLOOR_Y = -1.9

const DESKTOP_WIDTH = 2.6
const MOBILE_HEIGHT = 2.2
const GAP = 0.6
const ROOM_Z = -5
const SCREEN_Y = 0.1

export interface ScreenPlacement {
  index: number
  kind: 'desktop' | 'mobile'
  width: number
  height: number
  position: [number, number, number]
  rotationY: number
}

/** Telas lado a lado, centralizadas em x = 0, com uma leve curvatura voltada para o centro. */
export function screenPlacements(images: { width: number; height: number }[]): ScreenPlacement[] {
  const sizes = images.map((img) => {
    const aspect = img.width / img.height
    return img.height > img.width
      ? { kind: 'mobile' as const, width: MOBILE_HEIGHT * aspect, height: MOBILE_HEIGHT }
      : { kind: 'desktop' as const, width: DESKTOP_WIDTH, height: DESKTOP_WIDTH / aspect }
  })
  const total = sizes.reduce((sum, s) => sum + s.width, 0) + GAP * Math.max(sizes.length - 1, 0)
  let cursor = -total / 2
  return sizes.map((s, index) => {
    const x = cursor + s.width / 2
    cursor += s.width + GAP
    return {
      index,
      ...s,
      position: [x, SCREEN_Y, ROOM_Z + Math.abs(x) * 0.12],
      rotationY: -x * 0.06,
    }
  })
}

/** Distância da câmera para a tela caber inteira (com 25% de folga). */
export function fitDistance(width: number, height: number, fovDeg: number, viewAspect: number): number {
  const t = Math.tan((fovDeg * Math.PI) / 360)
  const byHeight = height / 2 / t
  const byWidth = width / 2 / (t * viewAspect)
  return Math.max(byHeight, byWidth) * 1.25
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run src/lib src/world/hallLayout src/world/roomLayout && npx tsc --noEmit`
Expected: PASS em todos; tipos ok.

- [ ] **Step 5: Commit**

```bash
git add src/lib src/world
git commit -m "feat: add pure gallery, parallax and layout helpers"
```

---

### Task 4: Store de navegação

**Files:**
- Modify (reescrever): `src/store/gameStore.ts`, `src/store/gameStore.test.ts`

- [ ] **Step 1: Escrever o teste que falha** — substituir `src/store/gameStore.test.ts`

```ts
import { initialGameState, useGameStore } from './gameStore'

const s = () => useGameStore.getState()

describe('gameStore', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('starts in the menu, in the hub, with nothing active', () => {
    expect(s().mode).toBe('menu')
    expect(s().phase).toBe('hub')
    expect(s().activeProject).toBeNull()
    expect(s().hoveredProject).toBeNull()
    expect(s().focusedImage).toBeNull()
    expect(s().panel).toBeNull()
    expect(s().visited).toEqual([])
  })

  it('hoverProject only works in the hub', () => {
    s().hoverProject('barbuz')
    expect(s().hoveredProject).toBe('barbuz')
    s().hoverProject(null)
    useGameStore.setState({ phase: 'room' })
    s().hoverProject('occlo')
    expect(s().hoveredProject).toBeNull()
  })

  it('enterProject starts the dive and records the project as visited once', () => {
    s().hoverProject('barbuz')
    s().enterProject('barbuz')
    expect(s().phase).toBe('entering')
    expect(s().activeProject).toBe('barbuz')
    expect(s().hoveredProject).toBeNull()
    expect(s().focusedImage).toBeNull()
    expect(s().visited).toEqual(['barbuz'])
    useGameStore.setState({ phase: 'hub', activeProject: null })
    s().enterProject('barbuz')
    expect(s().visited).toEqual(['barbuz'])
  })

  it('enterProject is ignored outside the hub or with a panel open', () => {
    useGameStore.setState({ phase: 'room' })
    s().enterProject('occlo')
    expect(s().activeProject).toBeNull()
    useGameStore.setState({ phase: 'hub', panel: 'about' })
    s().enterProject('occlo')
    expect(s().activeProject).toBeNull()
  })

  it('finishEnter goes entering -> room only', () => {
    s().finishEnter()
    expect(s().phase).toBe('hub')
    s().enterProject('barbuz')
    s().finishEnter()
    expect(s().phase).toBe('room')
  })

  it('leaveProject only works from the room and clears the image focus', () => {
    s().enterProject('barbuz')
    s().leaveProject()
    expect(s().phase).toBe('entering')
    s().finishEnter()
    s().focusImage(2)
    s().leaveProject()
    expect(s().phase).toBe('leaving')
    expect(s().focusedImage).toBeNull()
  })

  it('finishLeave returns to the hub and clears the active project', () => {
    s().enterProject('barbuz')
    s().finishEnter()
    s().leaveProject()
    s().finishLeave()
    expect(s().phase).toBe('hub')
    expect(s().activeProject).toBeNull()
  })

  it('focusImage and stepImage only work in the room', () => {
    s().focusImage(1)
    s().stepImage(1, 4)
    expect(s().focusedImage).toBeNull()
    s().enterProject('barbuz')
    s().finishEnter()
    s().stepImage(1, 4)
    expect(s().focusedImage).toBe(0)
    s().stepImage(-1, 4)
    expect(s().focusedImage).toBe(3)
    s().focusImage(null)
    expect(s().focusedImage).toBeNull()
  })

  it('openPanel only works in the hub; closePanel clears it', () => {
    s().hoverProject('barbuz')
    s().openPanel('skills')
    expect(s().panel).toBe('skills')
    expect(s().hoveredProject).toBeNull()
    s().closePanel()
    expect(s().panel).toBeNull()
    useGameStore.setState({ phase: 'room' })
    s().openPanel('about')
    expect(s().panel).toBeNull()
  })

  it('setMode resets navigation and stores the notice', () => {
    s().enterProject('barbuz')
    s().setMode('2d', 'aviso')
    expect(s().mode).toBe('2d')
    expect(s().notice).toBe('aviso')
    expect(s().phase).toBe('hub')
    expect(s().activeProject).toBeNull()
    s().setMode('menu')
    expect(s().notice).toBeNull()
  })

  it('lowers and raises quality', () => {
    s().lowerQuality()
    expect(s().quality).toBe('medium')
    s().lowerQuality()
    s().lowerQuality()
    expect(s().quality).toBe('low')
    s().raiseQuality()
    expect(s().quality).toBe('medium')
    s().setQuality('high')
    expect(s().quality).toBe('high')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run src/store`
Expected: FAIL (ações novas não existem).

- [ ] **Step 3: Reescrever `src/store/gameStore.ts`**

```ts
import { create } from 'zustand'
import { stepIndex } from '../lib/gallery'
import { lowerQuality, raiseQuality, type Quality } from '../world/quality'

export type Mode = 'menu' | '3d' | '2d'
export type Phase = 'hub' | 'entering' | 'room' | 'leaving'
export type PanelId = 'about' | 'skills' | 'contact'

interface GameState {
  mode: Mode
  notice: string | null
  quality: Quality
  phase: Phase
  activeProject: string | null
  hoveredProject: string | null
  focusedImage: number | null
  panel: PanelId | null
  visited: string[]
  setMode: (mode: Mode, notice?: string | null) => void
  setQuality: (q: Quality) => void
  lowerQuality: () => void
  raiseQuality: () => void
  hoverProject: (id: string | null) => void
  enterProject: (id: string) => void
  finishEnter: () => void
  leaveProject: () => void
  finishLeave: () => void
  focusImage: (index: number | null) => void
  stepImage: (delta: 1 | -1, count: number) => void
  openPanel: (id: PanelId) => void
  closePanel: () => void
}

export const initialGameState = {
  mode: 'menu' as Mode,
  notice: null as string | null,
  quality: 'high' as Quality,
  phase: 'hub' as Phase,
  activeProject: null as string | null,
  hoveredProject: null as string | null,
  focusedImage: null as number | null,
  panel: null as PanelId | null,
  visited: [] as string[],
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialGameState,
  setMode: (mode, notice = null) =>
    set({
      mode,
      notice,
      phase: 'hub',
      activeProject: null,
      hoveredProject: null,
      focusedImage: null,
      panel: null,
    }),
  setQuality: (quality) => set({ quality }),
  lowerQuality: () => set({ quality: lowerQuality(get().quality) }),
  raiseQuality: () => set({ quality: raiseQuality(get().quality) }),

  hoverProject: (id) => {
    if (get().phase !== 'hub') return
    set({ hoveredProject: id })
  },
  enterProject: (id) => {
    const { phase, panel, visited } = get()
    if (phase !== 'hub' || panel !== null) return
    set({
      phase: 'entering',
      activeProject: id,
      hoveredProject: null,
      focusedImage: null,
      visited: visited.includes(id) ? visited : [...visited, id],
    })
  },
  finishEnter: () => {
    if (get().phase === 'entering') set({ phase: 'room' })
  },
  leaveProject: () => {
    if (get().phase === 'room') set({ phase: 'leaving', focusedImage: null })
  },
  finishLeave: () => {
    if (get().phase === 'leaving') set({ phase: 'hub', activeProject: null })
  },
  focusImage: (index) => {
    if (get().phase === 'room') set({ focusedImage: index })
  },
  stepImage: (delta, count) => {
    const { phase, focusedImage } = get()
    if (phase !== 'room') return
    set({ focusedImage: stepIndex(focusedImage, delta, count) })
  },
  openPanel: (id) => {
    if (get().phase !== 'hub') return
    set({ panel: id, hoveredProject: null })
  },
  closePanel: () => set({ panel: null }),
}))
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run && npx tsc --noEmit`
Expected: PASS (suíte inteira); tipos ok. (Nenhum outro arquivo usa os campos antigos do store depois da Task 1.)

- [ ] **Step 5: Commit**

```bash
git add src/store
git commit -m "feat: rewrite store for portal navigation phases"
```

---

### Task 5: Overlays HTML (menu, painéis, HUD do projeto, atalhos)

**Files:**
- Create: `src/ui/TopMenu.tsx`, `src/ui/InfoPanel.tsx`, `src/ui/ProjectHud.tsx`, `src/ui/useGameKeys.ts`, `src/ui/overlay.css`
- Test: `src/ui/TopMenu.test.tsx`, `src/ui/InfoPanel.test.tsx`, `src/ui/ProjectHud.test.tsx`, `src/ui/useGameKeys.test.tsx`

- [ ] **Step 1: Escrever os testes que falham**

`src/ui/TopMenu.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialGameState, useGameStore } from '../store/gameStore'
import { TopMenu } from './TopMenu'

describe('TopMenu', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('opens the info panels', async () => {
    render(<TopMenu />)
    await userEvent.click(screen.getByRole('button', { name: 'Skills' }))
    expect(useGameStore.getState().panel).toBe('skills')
    await userEvent.click(screen.getByRole('button', { name: 'Sobre mim' }))
    expect(useGameStore.getState().panel).toBe('about')
  })

  it('switches to the quick 2D version', async () => {
    render(<TopMenu />)
    await userEvent.click(screen.getByRole('button', { name: /versão rápida/i }))
    expect(useGameStore.getState().mode).toBe('2d')
  })

  it('is hidden inside a project', () => {
    useGameStore.setState({ phase: 'room', activeProject: 'barbuz' })
    render(<TopMenu />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
```

`src/ui/InfoPanel.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { contact, profile } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { InfoPanel } from './InfoPanel'

describe('InfoPanel', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('renders nothing while closed', () => {
    render(<InfoPanel />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the about content', () => {
    useGameStore.setState({ panel: 'about' })
    render(<InfoPanel />)
    expect(screen.getByRole('dialog', { name: 'Sobre mim' })).toBeInTheDocument()
    expect(screen.getByText(profile.bio)).toBeInTheDocument()
  })

  it('shows the contact links', () => {
    useGameStore.setState({ panel: 'contact' })
    render(<InfoPanel />)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', contact.github)
  })

  it('moves focus to the close button and closes with it', async () => {
    useGameStore.setState({ panel: 'skills' })
    render(<InfoPanel />)
    const close = screen.getByRole('button', { name: /fechar/i })
    expect(close).toHaveFocus()
    await userEvent.click(close)
    expect(useGameStore.getState().panel).toBeNull()
  })
})
```

`src/ui/ProjectHud.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { ProjectHud } from './ProjectHud'

const p = projects[0]

describe('ProjectHud', () => {
  beforeEach(() => useGameStore.setState({ ...initialGameState, phase: 'room', activeProject: p.id }))

  it('is hidden outside the room', () => {
    useGameStore.setState({ phase: 'hub', activeProject: null })
    render(<ProjectHud />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('shows the project text, stack and live link', () => {
    render(<ProjectHud />)
    expect(screen.getByRole('heading', { name: p.title })).toBeInTheDocument()
    expect(screen.getByText(p.description)).toBeInTheDocument()
    for (const tech of p.stack) expect(screen.getByText(tech)).toBeInTheDocument()
    const live = screen.getByRole('link', { name: /ver site/i })
    expect(live).toHaveAttribute('href', p.liveUrl)
    expect(live).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('steps through the images and shows the caption', async () => {
    render(<ProjectHud />)
    await userEvent.click(screen.getByRole('button', { name: /próxima imagem/i }))
    expect(useGameStore.getState().focusedImage).toBe(0)
    expect(screen.getByText(`1 / ${p.images.length}`)).toBeInTheDocument()
    expect(screen.getByText(p.images[0].alt)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /imagem anterior/i }))
    expect(useGameStore.getState().focusedImage).toBe(p.images.length - 1)
  })

  it('leaves the project with the back button', async () => {
    render(<ProjectHud />)
    await userEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(useGameStore.getState().phase).toBe('leaving')
  })
})
```

`src/ui/useGameKeys.test.tsx`:
```tsx
import { fireEvent, renderHook } from '@testing-library/react'
import { projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { useGameKeys } from './useGameKeys'

const s = () => useGameStore.getState()
const inRoom = () => useGameStore.setState({ ...initialGameState, phase: 'room', activeProject: projects[0].id })

describe('useGameKeys', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('Escape closes a panel first', () => {
    renderHook(() => useGameKeys())
    useGameStore.setState({ panel: 'about' })
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(s().panel).toBeNull()
  })

  it('Escape then unfocuses the image, then leaves the project', () => {
    renderHook(() => useGameKeys())
    inRoom()
    s().focusImage(1)
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(s().focusedImage).toBeNull()
    expect(s().phase).toBe('room')
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(s().phase).toBe('leaving')
  })

  it('arrows step through the project images only in the room', () => {
    renderHook(() => useGameKeys())
    fireEvent.keyDown(window, { code: 'ArrowRight' })
    expect(s().focusedImage).toBeNull()
    inRoom()
    fireEvent.keyDown(window, { code: 'ArrowRight' })
    expect(s().focusedImage).toBe(0)
    fireEvent.keyDown(window, { code: 'ArrowLeft' })
    expect(s().focusedImage).toBe(projects[0].images.length - 1)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run src/ui`
Expected: FAIL (módulos não existem).

- [ ] **Step 3: Implementar**

`src/ui/TopMenu.tsx`:
```tsx
import { useGameStore, type PanelId } from '../store/gameStore'

const ITEMS: { id: PanelId; label: string }[] = [
  { id: 'about', label: 'Sobre mim' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contato' },
]

export function TopMenu() {
  const phase = useGameStore((s) => s.phase)
  const openPanel = useGameStore((s) => s.openPanel)
  const setMode = useGameStore((s) => s.setMode)

  if (phase !== 'hub') return null

  return (
    <nav className="top-menu" aria-label="Menu do portfólio">
      {ITEMS.map((item) => (
        <button key={item.id} className="btn" onClick={() => openPanel(item.id)}>
          {item.label}
        </button>
      ))}
      <button className="btn" onClick={() => setMode('2d')}>
        Versão rápida
      </button>
    </nav>
  )
}
```

`src/ui/InfoPanel.tsx`:
```tsx
import { useEffect, useRef } from 'react'
import { useGameStore, type PanelId } from '../store/gameStore'
import { ContactSection, ProfileSection, SkillsSection } from './sections'

const TITLES: Record<PanelId, string> = { about: 'Sobre mim', skills: 'Skills', contact: 'Contato' }

export function InfoPanel() {
  const panel = useGameStore((s) => s.panel)
  const closePanel = useGameStore((s) => s.closePanel)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (panel) closeRef.current?.focus()
  }, [panel])

  if (!panel) return null

  return (
    <div
      className="panel-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePanel()
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={TITLES[panel]} className="panel">
        <button ref={closeRef} className="panel-close" aria-label="Fechar" onClick={closePanel}>
          ✕
        </button>
        {panel === 'about' && <ProfileSection />}
        {panel === 'skills' && <SkillsSection />}
        {panel === 'contact' && <ContactSection />}
      </div>
    </div>
  )
}
```

`src/ui/ProjectHud.tsx`:
```tsx
import { projects } from '../content'
import { useGameStore } from '../store/gameStore'

export function ProjectHud() {
  const phase = useGameStore((s) => s.phase)
  const activeProject = useGameStore((s) => s.activeProject)
  const focusedImage = useGameStore((s) => s.focusedImage)
  const stepImage = useGameStore((s) => s.stepImage)
  const leaveProject = useGameStore((s) => s.leaveProject)

  const project = projects.find((p) => p.id === activeProject)
  if (phase !== 'room' || !project) return null

  const count = project.images.length
  const current = focusedImage !== null ? project.images[focusedImage] : null

  return (
    <aside
      className="project-hud"
      aria-label={`Projeto ${project.title}`}
      style={{ ['--accent' as string]: project.color }}
    >
      <div className="project-card">
        <p className="muted small">{project.kind}</p>
        <h2>{project.title}</h2>
        <p className="muted">{project.tagline}</p>
        <p>{project.description}</p>
        <ul className="chips">
          {project.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="links">
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Ver site
          </a>
        </p>
      </div>
      <div className="project-controls">
        <button className="btn" aria-label="Imagem anterior" onClick={() => stepImage(-1, count)}>
          ←
        </button>
        <span aria-live="polite">{focusedImage !== null ? `${focusedImage + 1} / ${count}` : `${count} imagens`}</span>
        <button className="btn" aria-label="Próxima imagem" onClick={() => stepImage(1, count)}>
          →
        </button>
        <button className="btn btn-primary" onClick={leaveProject}>
          Voltar
        </button>
      </div>
      {current && (
        <p className="project-caption" aria-live="polite">
          {current.alt}
        </p>
      )}
    </aside>
  )
}
```

`src/ui/useGameKeys.ts`:
```ts
import { useEffect } from 'react'
import { projects } from '../content'
import { useGameStore } from '../store/gameStore'

export function useGameKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useGameStore.getState()

      if (e.code === 'Escape') {
        if (s.panel) s.closePanel()
        else if (s.focusedImage !== null) s.focusImage(null)
        else if (s.phase === 'room') s.leaveProject()
        return
      }

      if (s.phase !== 'room') return
      const project = projects.find((p) => p.id === s.activeProject)
      if (!project) return
      if (e.code === 'ArrowRight') {
        e.preventDefault()
        s.stepImage(1, project.images.length)
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        s.stepImage(-1, project.images.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
```

`src/ui/overlay.css`:
```css
.top-menu {
  position: fixed;
  top: max(16px, env(safe-area-inset-top));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 32px);
  z-index: 10;
}
.top-menu .btn { background: rgba(5, 5, 13, 0.7); }

.portal-label {
  padding: 4px 12px;
  border: 1px solid;
  border-radius: 4px;
  background: rgba(5, 5, 13, 0.75);
  font-size: 14px;
  white-space: nowrap;
  text-align: center;
  text-shadow: 0 0 8px currentColor;
  pointer-events: none;
  display: grid;
  gap: 2px;
}
.portal-label span { font-size: 12px; color: var(--text); text-shadow: none; }

.project-hud {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: max(16px, env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: minmax(0, 420px) 1fr;
  gap: 12px;
  align-items: end;
  z-index: 10;
  pointer-events: none;
}
.project-hud > * { pointer-events: auto; }
.project-card {
  max-height: 42vh;
  overflow: auto;
  padding: 16px;
  background: var(--panel);
  border: 1px solid var(--accent, var(--cyan));
  border-radius: 10px;
  box-shadow: 0 0 22px color-mix(in srgb, var(--accent, #00f0ff) 35%, transparent);
}
.project-controls {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(5, 5, 13, 0.8);
  border-radius: 8px;
}
.project-caption {
  grid-column: 1 / -1;
  margin: 0;
  padding: 6px 12px;
  background: rgba(5, 5, 13, 0.8);
  border-radius: 6px;
  font-size: 0.85rem;
}
@media (max-width: 700px) {
  .project-hud { grid-template-columns: 1fr; }
  .project-controls { justify-self: stretch; justify-content: space-between; }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run && npx tsc --noEmit`
Expected: PASS (suíte inteira, sem avisos de `act`); tipos ok.

- [ ] **Step 5: Commit**

```bash
git add src/ui
git commit -m "feat: add top menu, info panel, project HUD and game keys"
```

---

### Task 6: Salão 3D (portais com capa, câmera, preload, Game)

**Files:**
- Create: `src/world/motion.ts`, `src/world/portalRegistry.ts`, `src/world/TextureBoundary.tsx`, `src/world/PortalFrame.tsx`, `src/world/Hall.tsx`, `src/world/CameraRig.tsx`
- Test: `src/world/TextureBoundary.test.tsx`
- Modify: `src/game/Game.tsx`, `package.json` (maath)

Visual: verificação por `tsc`/`vitest`/`build`; o usuário confere no navegador.

- [ ] **Step 1: Instalar maath**

```bash
cd /home/wellington/Documentos/www/postfolio && npm install maath
```

- [ ] **Step 2: Teste do `TextureBoundary` (falha)** — `src/world/TextureBoundary.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { TextureBoundary } from './TextureBoundary'

function Boom(): never {
  throw new Error('textura quebrada')
}

describe('TextureBoundary', () => {
  it('renders children when fine', () => {
    render(
      <TextureBoundary fallback={<p>fallback</p>}>
        <p>ok</p>
      </TextureBoundary>,
    )
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  it('renders the fallback when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <TextureBoundary fallback={<p>fallback</p>}>
        <Boom />
      </TextureBoundary>,
    )
    expect(screen.getByText('fallback')).toBeInTheDocument()
    spy.mockRestore()
  })
})
```
Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run src/world/TextureBoundary` → FAIL.

- [ ] **Step 3: Implementar os módulos de apoio**

`src/world/TextureBoundary.tsx`:
```tsx
import { Component, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  children: ReactNode
}

/** Se uma textura falhar ao carregar, mostra o fallback em vez de derrubar a cena. */
export class TextureBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
```

`src/world/motion.ts`:
```ts
import { browserEnv } from '../lib/capabilities'

/** Tempo de suavização (s) das animações; ~instantâneo com movimento reduzido. */
export const SMOOTH = browserEnv.prefersReducedMotion() ? 0.001 : 0.25
```

`src/world/portalRegistry.ts`:
```ts
import type { Object3D } from 'three'

const registry = new Map<string, Object3D>()

/** Registra (ou remove, com null) o objeto de cada portal, para a câmera converter poses locais em mundo. */
export function registerPortal(id: string, obj: Object3D | null) {
  if (obj) registry.set(id, obj)
  else registry.delete(id)
}

export function getPortalObject(id: string): Object3D | undefined {
  return registry.get(id)
}
```

- [ ] **Step 4: `src/world/PortalFrame.tsx`** (moldura neon + capa; a sala viva entra na Task 7)

```tsx
import { Html, Image, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useCallback, useRef } from 'react'
import type { Group } from 'three'
import { coverOf, type Project } from '../content'
import { useGameStore } from '../store/gameStore'
import { PORTAL_HEIGHT as H, PORTAL_WIDTH as W, type PortalPlacement } from './hallLayout'
import { NeonMaterial } from './NeonMaterial'
import { registerPortal } from './portalRegistry'
import { TextureBoundary } from './TextureBoundary'

const BAR = 0.12

interface Props {
  project: Project
  placement: PortalPlacement
}

export function PortalFrame({ project, placement }: Props) {
  const hovered = useGameStore((s) => s.hoveredProject === project.id)
  const visited = useGameStore((s) => s.visited.includes(project.id))
  const phase = useGameStore((s) => s.phase)
  const hoverProject = useGameStore((s) => s.hoverProject)
  const enterProject = useGameStore((s) => s.enterProject)
  const inner = useRef<Group>(null)
  const anchor = useCallback((o: Group | null) => registerPortal(project.id, o), [project.id])

  useCursor(hovered && phase === 'hub')

  useFrame((_, dt) => {
    if (!inner.current) return
    const k = hovered ? 1.06 : 1
    easing.damp3(inner.current.scale, [k, k, k], 0.15, dt)
  })

  const canInteract = () => {
    const s = useGameStore.getState()
    return s.phase === 'hub' && s.panel === null
  }

  return (
    <group ref={anchor} position={placement.position} rotation-y={placement.rotationY}>
      <group ref={inner}>
        {/* moldura neon */}
        <mesh position={[0, H / 2 + BAR / 2, 0]}>
          <boxGeometry args={[W + BAR * 2, BAR, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[0, -H / 2 - BAR / 2, 0]}>
          <boxGeometry args={[W + BAR * 2, BAR, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[-W / 2 - BAR / 2, 0, 0]}>
          <boxGeometry args={[BAR, H, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[W / 2 + BAR / 2, 0, 0]}>
          <boxGeometry args={[BAR, H, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>

        {/* capa do projeto */}
        <TextureBoundary
          fallback={
            <mesh>
              <planeGeometry args={[W, H]} />
              <meshBasicMaterial color="#10102a" />
            </mesh>
          }
        >
          <Image
            url={coverOf(project).src}
            scale={[W, H]}
            toneMapped={false}
            color={hovered ? '#ffffff' : '#9096b8'}
          />
        </TextureBoundary>

        {/* área de clique estável (não troca com o hover) */}
        <mesh
          position={[0, 0, 0.05]}
          onPointerOver={(e) => {
            if (!canInteract()) return
            e.stopPropagation()
            hoverProject(project.id)
          }}
          onPointerOut={() => {
            if (useGameStore.getState().hoveredProject === project.id) hoverProject(null)
          }}
          onClick={(e) => {
            if (!canInteract()) return
            e.stopPropagation()
            enterProject(project.id)
          }}
        >
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <Html position={[0, H / 2 + 0.6, 0.1]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`portal-label${hovered ? ' hovered' : ''}`} style={{ color: project.color, borderColor: project.color }}>
            <strong>
              {visited ? '✓ ' : ''}
              {project.title}
            </strong>
            {hovered && <span>{project.tagline}</span>}
          </div>
        </Html>
      </group>
    </group>
  )
}
```

- [ ] **Step 5: `src/world/Hall.tsx`**

```tsx
import { Grid, Sparkles, useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import { projects } from '../content'
import { useGameStore } from '../store/gameStore'
import { portalPlacements } from './hallLayout'
import { PortalFrame } from './PortalFrame'
import { QUALITY_SETTINGS } from './quality'
import { TextureBoundary } from './TextureBoundary'

const ALL_SRCS = projects.flatMap((p) => p.images.map((i) => i.src))

/** Mantém a textura em cache; assim a sala não "suspende" a cena quando abre. */
function TextureWarm({ src }: { src: string }) {
  useTexture(src)
  return null
}

export function Hall() {
  const quality = useGameStore((s) => s.quality)
  const placements = useMemo(() => portalPlacements(projects.length), [])

  return (
    <>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#07070f" roughness={0.85} metalness={0.2} />
      </mesh>
      <Grid
        position={[0, 0.01, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1b2b6b"
        sectionSize={5}
        sectionThickness={1.1}
        sectionColor="#00f0ff"
        fadeDistance={40}
        fadeStrength={1.5}
        infiniteGrid
      />

      {projects.map((p, i) => (
        <group key={p.id}>
          <PortalFrame project={p} placement={placements[i]} />
          <pointLight
            position={[placements[i].position[0], 2.4, placements[i].position[2] + 2.2]}
            intensity={6}
            distance={9}
            color={p.color}
          />
        </group>
      ))}

      {QUALITY_SETTINGS[quality].sparks && (
        <Sparkles count={80} scale={[16, 6, 10]} position={[0, 3, -3]} size={3} speed={0.3} color="#7fdcff" />
      )}

      {ALL_SRCS.map((src) => (
        <TextureBoundary key={src} fallback={null}>
          <TextureWarm src={src} />
        </TextureBoundary>
      ))}
    </>
  )
}
```

- [ ] **Step 6: `src/world/CameraRig.tsx`** (única fonte de movimento da câmera; conclui as transições)

```tsx
import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import { useMemo, useRef } from 'react'
import { Vector3 } from 'three'
import { projects } from '../content'
import { parallaxOffset } from '../lib/parallax'
import { useGameStore } from '../store/gameStore'
import { CAMERA_FOV, HUB_CAMERA, ROOM_ENTRY, ROOM_OVERVIEW } from './hallLayout'
import { SMOOTH } from './motion'
import { getPortalObject } from './portalRegistry'
import { fitDistance, screenPlacements, type ScreenPlacement } from './roomLayout'

const ARRIVE = 0.08

type Triple = readonly [number, number, number]

export function CameraRig() {
  const { camera, pointer, size } = useThree()
  const look = useRef(new Vector3(...HUB_CAMERA.lookAt))
  const pos = useMemo(() => new Vector3(), [])
  const target = useMemo(() => new Vector3(), [])
  const screens = useRef(new Map<string, ScreenPlacement[]>())

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const s = useGameStore.getState()
    const p = parallaxOffset(pointer, { x: 1, y: 1 })
    const portal = s.activeProject ? getPortalObject(s.activeProject) : undefined
    const inRoom = (s.phase === 'entering' || s.phase === 'room') && portal

    if (!inRoom) {
      // salão (e volta da sala): parallax suave pelo mouse
      pos.set(HUB_CAMERA.position[0] + p.x * 0.9, HUB_CAMERA.position[1] + p.y * 0.35, HUB_CAMERA.position[2])
      target.set(HUB_CAMERA.lookAt[0] + p.x * 0.6, HUB_CAMERA.lookAt[1] + p.y * 0.2, HUB_CAMERA.lookAt[2])
    } else {
      let localPos: Triple = ROOM_ENTRY.position
      let localLook: Triple = ROOM_ENTRY.lookAt

      if (s.phase === 'room') {
        localPos = [ROOM_OVERVIEW.position[0] + p.x * 0.8, ROOM_OVERVIEW.position[1] + p.y * 0.3, ROOM_OVERVIEW.position[2]]
        localLook = [ROOM_OVERVIEW.lookAt[0] + p.x * 0.5, ROOM_OVERVIEW.lookAt[1] + p.y * 0.2, ROOM_OVERVIEW.lookAt[2]]

        if (s.focusedImage !== null && s.activeProject) {
          let list = screens.current.get(s.activeProject)
          if (!list) {
            const project = projects.find((x) => x.id === s.activeProject)
            list = screenPlacements(project?.images ?? [])
            screens.current.set(s.activeProject, list)
          }
          const sc = list[s.focusedImage]
          if (sc) {
            const d = fitDistance(sc.width, sc.height, CAMERA_FOV, size.width / size.height)
            localPos = [sc.position[0] + p.x * 0.15, sc.position[1] + p.y * 0.1, sc.position[2] + d]
            localLook = sc.position
          }
        }
      }

      portal.updateWorldMatrix(true, false)
      pos.set(...localPos)
      portal.localToWorld(pos)
      target.set(...localLook)
      portal.localToWorld(target)
    }

    easing.damp3(camera.position, pos, SMOOTH, dt)
    easing.damp3(look.current, target, SMOOTH, dt)
    camera.lookAt(look.current)

    // conclui as transições quando a câmera chega na pose
    if (s.phase === 'entering' && camera.position.distanceTo(pos) < ARRIVE) s.finishEnter()
    else if (s.phase === 'leaving' && camera.position.distanceTo(pos) < ARRIVE) s.finishLeave()
  })

  return null
}
```

- [ ] **Step 7: Reescrever `src/game/Game.tsx`**

```tsx
import { Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useGameStore } from '../store/gameStore'
import { InfoPanel } from '../ui/InfoPanel'
import '../ui/overlay.css'
import { ProjectHud } from '../ui/ProjectHud'
import { TopMenu } from '../ui/TopMenu'
import { useGameKeys } from '../ui/useGameKeys'
import { CameraRig } from '../world/CameraRig'
import { Effects } from '../world/Effects'
import { Hall } from '../world/Hall'
import { CAMERA_FOV, HUB_CAMERA } from '../world/hallLayout'
import { QUALITY_SETTINGS } from '../world/quality'
import { Skyline } from '../world/Skyline'

export default function Game() {
  useGameKeys()
  const quality = useGameStore((s) => s.quality)
  const settings = QUALITY_SETTINGS[quality]

  return (
    <>
      <Canvas
        dpr={settings.dpr}
        camera={{ position: [...HUB_CAMERA.position], fov: CAMERA_FOV, near: 0.1, far: 400 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05050d']} />
        <fog attach="fog" args={['#05050d', 18, 120]} />
        <ambientLight intensity={0.5} color="#6a5cff" />
        <PerformanceMonitor
          onDecline={() => useGameStore.getState().lowerQuality()}
          onIncline={() => useGameStore.getState().raiseQuality()}
          onFallback={() => useGameStore.getState().setQuality('low')}
        />
        <Suspense fallback={null}>
          <Hall />
          <Skyline />
        </Suspense>
        <CameraRig />
        <Effects />
      </Canvas>
      <TopMenu />
      <InfoPanel />
      <ProjectHud />
      <Loader />
    </>
  )
}
```

- [ ] **Step 8: Verificar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx tsc --noEmit && npx vitest run && npm run build`
Expected: tipos ok (se algum detalhe de tipo do drei/maath rejeitar, fazer o ajuste mínimo e listar no relatório); testes passam (incl. `TextureBoundary`); build conclui.
Nota ao implementador: não consegue ver o navegador; não declarar verificação visual.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add 3D hall with cover portals, camera rig and overlays"
```

---

### Task 7: Portal vivo e sala do projeto (base)

**Files:**
- Create: `src/world/ProjectRoom.tsx`
- Modify (reescrever): `src/world/PortalFrame.tsx`

- [ ] **Step 1: Criar `src/world/ProjectRoom.tsx`**

```tsx
import { Grid } from '@react-three/drei'
import { useMemo } from 'react'
import { Color } from 'three'
import type { Project } from '../content'
import { ROOM_FLOOR_Y } from './roomLayout'

/** Sala temática do projeto, em coordenadas locais do portal. */
export function ProjectRoom({ project }: { project: Project }) {
  const bg = useMemo(() => `#${new Color(project.color).multiplyScalar(0.07).getHexString()}`, [project.color])

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 10, 34]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 3, -2]} intensity={25} distance={24} color={project.color} />
      <Grid
        position={[0, ROOM_FLOOR_Y, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1b2b6b"
        sectionSize={4}
        sectionThickness={1.2}
        sectionColor={project.color}
        fadeDistance={30}
        fadeStrength={1.2}
        infiniteGrid
      />
    </>
  )
}
```

- [ ] **Step 2: Reescrever `src/world/PortalFrame.tsx`** (acrescenta a superfície viva com `MeshPortalMaterial`, o blend e a animação)

```tsx
import { Html, Image, MeshPortalMaterial, useCursor } from '@react-three/drei'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { easing } from 'maath'
import { useCallback, useRef } from 'react'
import { DoubleSide, type Group } from 'three'
import { coverOf, type Project } from '../content'
import { useGameStore } from '../store/gameStore'
import { PORTAL_HEIGHT as H, PORTAL_WIDTH as W, type PortalPlacement } from './hallLayout'
import { SMOOTH } from './motion'
import { NeonMaterial } from './NeonMaterial'
import { registerPortal } from './portalRegistry'
import { ProjectRoom } from './ProjectRoom'
import { TextureBoundary } from './TextureBoundary'

const BAR = 0.12

interface Props {
  project: Project
  placement: PortalPlacement
}

export function PortalFrame({ project, placement }: Props) {
  const hovered = useGameStore((s) => s.hoveredProject === project.id)
  const active = useGameStore((s) => s.activeProject === project.id)
  const visited = useGameStore((s) => s.visited.includes(project.id))
  const phase = useGameStore((s) => s.phase)
  const hoverProject = useGameStore((s) => s.hoverProject)
  const enterProject = useGameStore((s) => s.enterProject)
  const inner = useRef<Group>(null)
  const portal = useRef<ThreeElements['portalMaterialImpl']>(null)
  const anchor = useCallback((o: Group | null) => registerPortal(project.id, o), [project.id])

  // sala viva só no portal em hover ou em uso (limite de GPU)
  const live = active || hovered

  useCursor(hovered && phase === 'hub')

  useFrame((_, dt) => {
    if (inner.current) {
      const k = hovered ? 1.06 : 1
      easing.damp3(inner.current.scale, [k, k, k], 0.15, dt)
    }
    if (portal.current) {
      const s = useGameStore.getState()
      const target = s.activeProject === project.id && (s.phase === 'entering' || s.phase === 'room') ? 1 : 0
      easing.damp(portal.current, 'blend', target, SMOOTH, dt)
    }
  })

  const canInteract = () => {
    const s = useGameStore.getState()
    return s.phase === 'hub' && s.panel === null
  }

  return (
    <group ref={anchor} position={placement.position} rotation-y={placement.rotationY}>
      <group ref={inner}>
        {/* moldura neon */}
        <mesh position={[0, H / 2 + BAR / 2, 0]}>
          <boxGeometry args={[W + BAR * 2, BAR, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[0, -H / 2 - BAR / 2, 0]}>
          <boxGeometry args={[W + BAR * 2, BAR, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[-W / 2 - BAR / 2, 0, 0]}>
          <boxGeometry args={[BAR, H, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>
        <mesh position={[W / 2 + BAR / 2, 0, 0]}>
          <boxGeometry args={[BAR, H, 0.2]} />
          <NeonMaterial color={project.color} />
        </mesh>

        {/* superfície: sala viva (hover/uso) ou capa */}
        {live ? (
          <mesh>
            <planeGeometry args={[W, H]} />
            <MeshPortalMaterial ref={portal} events={active} side={DoubleSide}>
              <ProjectRoom project={project} />
            </MeshPortalMaterial>
          </mesh>
        ) : (
          <TextureBoundary
            fallback={
              <mesh>
                <planeGeometry args={[W, H]} />
                <meshBasicMaterial color="#10102a" />
              </mesh>
            }
          >
            <Image url={coverOf(project).src} scale={[W, H]} toneMapped={false} color="#9096b8" />
          </TextureBoundary>
        )}

        {/* área de clique estável (não troca com o hover) */}
        <mesh
          position={[0, 0, 0.05]}
          onPointerOver={(e) => {
            if (!canInteract()) return
            e.stopPropagation()
            hoverProject(project.id)
          }}
          onPointerOut={() => {
            if (useGameStore.getState().hoveredProject === project.id) hoverProject(null)
          }}
          onClick={(e) => {
            if (!canInteract()) return
            e.stopPropagation()
            enterProject(project.id)
          }}
        >
          <planeGeometry args={[W, H]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <Html position={[0, H / 2 + 0.6, 0.1]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`portal-label${hovered ? ' hovered' : ''}`} style={{ color: project.color, borderColor: project.color }}>
            <strong>
              {visited ? '✓ ' : ''}
              {project.title}
            </strong>
            {hovered && <span>{project.tagline}</span>}
          </div>
        </Html>
      </group>
    </group>
  )
}
```

- [ ] **Step 3: Verificar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx tsc --noEmit && npx vitest run && npm run build`
Expected: tipos ok (ajustes mínimos de tipo do `ref`/`blend` do `MeshPortalMaterial` são aceitáveis; listar no relatório), testes e build passam.
Riscos a relatar sem tentar "corrigir às cegas": se o `hit mesh` interceptar eventos da sala; se `events={active}` desligar os eventos do salão ao entrar. O usuário confere no navegador.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: live portal rooms with MeshPortalMaterial and room base"
```

---

### Task 8: Telas dos prints na sala + foco por clique

**Files:**
- Create: `src/world/ImageScreen.tsx`, `src/world/RoomScreens.tsx`
- Modify: `src/world/ProjectRoom.tsx`

- [ ] **Step 1: Criar `src/world/ImageScreen.tsx`**

```tsx
import { Image, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState } from 'react'
import type { Group } from 'three'
import type { ProjectImage } from '../content'
import { NeonMaterial } from './NeonMaterial'
import type { ScreenPlacement } from './roomLayout'
import { TextureBoundary } from './TextureBoundary'

interface Props {
  image: ProjectImage
  placement: ScreenPlacement
  color: string
  focused: boolean
  onSelect: () => void
}

export function ImageScreen({ image, placement, color, focused, onSelect }: Props) {
  const { width, height, kind, position, rotationY, index } = placement
  const [hovered, setHovered] = useState(false)
  const bob = useRef<Group>(null)
  const zoom = useRef<Group>(null)
  useCursor(hovered)

  useFrame(({ clock }, dt) => {
    if (bob.current) bob.current.position.y = Math.sin(clock.elapsedTime * 0.8 + index) * 0.05
    if (zoom.current) {
      const k = hovered && !focused ? 1.04 : 1
      easing.damp3(zoom.current.scale, [k, k, k], 0.15, dt)
    }
  })

  const pad = kind === 'mobile' ? 0.14 : 0.1

  return (
    <group position={position} rotation-y={rotationY}>
      <group ref={bob}>
        <group ref={zoom}>
          {/* borda neon + corpo escuro (monitor ou telefone) */}
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[width + pad * 2 + 0.08, height + pad * 2 + 0.08, 0.04]} />
            <NeonMaterial color={color} intensity={focused ? 3.5 : 2} />
          </mesh>
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[width + pad * 2, height + pad * 2, 0.08]} />
            <meshStandardMaterial color="#0a0a16" metalness={0.6} roughness={0.35} />
          </mesh>

          <TextureBoundary
            fallback={
              <mesh>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color="#10102a" />
              </mesh>
            }
          >
            <Image
              url={image.src}
              scale={[width, height]}
              radius={kind === 'mobile' ? 0.08 : 0.02}
              toneMapped={false}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
              }}
              onPointerOut={() => setHovered(false)}
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            />
          </TextureBoundary>
        </group>
      </group>
    </group>
  )
}
```

- [ ] **Step 2: Criar `src/world/RoomScreens.tsx`**

```tsx
import { useMemo } from 'react'
import type { Project } from '../content'
import { useGameStore } from '../store/gameStore'
import { ImageScreen } from './ImageScreen'
import { screenPlacements } from './roomLayout'

export function RoomScreens({ project }: { project: Project }) {
  const focused = useGameStore((s) => s.focusedImage)
  const focusImage = useGameStore((s) => s.focusImage)
  const screens = useMemo(() => screenPlacements(project.images), [project])

  return (
    <>
      {/* fundo clicável: clicar fora de uma tela desfaz o foco */}
      <mesh position={[0, 0, -9]} onClick={() => focusImage(null)}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {screens.map((sp) => (
        <ImageScreen
          key={project.images[sp.index].src}
          image={project.images[sp.index]}
          placement={sp}
          color={project.color}
          focused={focused === sp.index}
          onSelect={() => focusImage(focused === sp.index ? null : sp.index)}
        />
      ))}
    </>
  )
}
```

- [ ] **Step 3: Incluir as telas em `src/world/ProjectRoom.tsx`**

Adicionar o import `import { RoomScreens } from './RoomScreens'` e, dentro do fragmento, logo depois de `<Grid ... />`, a linha `<RoomScreens project={project} />`.

- [ ] **Step 4: Verificar**

Run: `cd /home/wellington/Documentos/www/postfolio && npx tsc --noEmit && npx vitest run && npm run build`
Expected: tipos, testes e build ok. Relatar apenas o que foi realmente verificado; o usuário confere no navegador (telas aparecem, clicar aproxima, setas/botões trocam, clicar no fundo ou `Esc` desfaz o foco).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add screenshot screens with click-to-focus inside project rooms"
```

---

### Task 9: Qualidade, polimento e verificação final

**Files:**
- Modify: `src/world/quality.ts`, `src/world/quality.test.ts`, `src/world/PortalFrame.tsx`, `src/world/ProjectRoom.tsx`

- [ ] **Step 1: Teste que falha** — em `src/world/quality.test.ts`, no último `it`, acrescentar:

```ts
    expect(QUALITY_SETTINGS.high.hoverPreview).toBe(true)
    expect(QUALITY_SETTINGS.medium.hoverPreview).toBe(true)
    expect(QUALITY_SETTINGS.low.hoverPreview).toBe(false)
```
Run: `cd /home/wellington/Documentos/www/postfolio && npx vitest run src/world/quality` → FAIL.

- [ ] **Step 2: `src/world/quality.ts`** — adicionar `hoverPreview: boolean` à interface `QualitySettings` e ao `QUALITY_SETTINGS`: `high: { ..., hoverPreview: true }`, `medium: { ..., hoverPreview: true }`, `low: { ..., hoverPreview: false }` (manter os campos existentes `dpr`, `bloom`, `buildings`, `trails`, `sparks`).

- [ ] **Step 3: `src/world/PortalFrame.tsx`** — importar `QUALITY_SETTINGS` de `./quality`; dentro do componente ler `const hoverPreview = useGameStore((s) => QUALITY_SETTINGS[s.quality].hoverPreview)` e trocar `const live = active || hovered` por `const live = active || (hovered && hoverPreview)`. Na qualidade baixa o hover mostra só a capa; a sala continua abrindo ao entrar.

- [ ] **Step 4: `src/world/ProjectRoom.tsx`** — adicionar partículas na sala quando permitido: importar `Sparkles` (drei) e `useGameStore`/`QUALITY_SETTINGS`; ler `const sparks = useGameStore((s) => QUALITY_SETTINGS[s.quality].sparks)` e, depois de `<RoomScreens ... />`, `{sparks && <Sparkles count={60} scale={[14, 5, 10]} position={[0, 0.5, -4]} size={3} speed={0.25} color={project.color} />}`.

- [ ] **Step 5: Verificação final**

Run: `cd /home/wellington/Documentos/www/postfolio && npx tsc --noEmit && npx vitest run && npm run build`
Expected: tudo passa; reportar contagens exatas de testes e o tamanho do chunk `Game-*.js` (a remoção do Rapier deve ter reduzido o chunk em relação aos 3,27 MB anteriores).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: gate hover previews and room particles by quality"
```

- [ ] **Step 7 (manual, do usuário):** checklist no navegador em `http://127.0.0.1:5173`
1. Start → salão com 4 portais em arco; câmera acompanha o mouse; labels visíveis.
2. Hover num portal: cresce, mostra a frase e a sala viva aparece dentro da moldura; cursor muda.
3. Clique: a câmera mergulha no portal e a sala do projeto aparece com as telas dos prints.
4. Clicar numa tela aproxima; ← → e botões trocam; clicar no fundo ou `Esc` desfaz o foco.
5. "Ver site" abre o site em nova aba. "Voltar" ou `Esc` sai do portal e volta ao salão; o portal visitado ganha ✓.
6. Menu superior abre Sobre/Skills/Contato; "Versão rápida" mostra a galeria 2D com os prints.
7. Celular (DevTools): arrastar/tocar equivale a mouse/clique.

---

## Self-Review

**Cobertura do spec** (`2026-11-05-portal-gallery-design.md`):
- Tela inicial, salão com 4 portais em arco, parallax, hover (cresce, label, reticle via `useCursor`, frase), clique com mergulho de ~1,2 s: Tasks 5 e 6 (`PortalFrame`, `CameraRig` com `SMOOTH` 0,25 s e conclusão por chegada na pose).
- Menu HUD Sobre/Skills/Contato com painéis acessíveis: Task 5.
- Sala 3D temática, telas flutuantes com moldura de monitor/telefone, parallax, foco por clique, setas/botões/`Esc`, HUD com título/descrição/stack/"Ver site"/"Voltar", saída reversa e portal visitado: Tasks 5, 7 e 8.
- Fases `hub → entering → room → leaving → hub` no store: Task 4.
- Dados reais da Tymos, 18 prints locais com dimensões geradas, `types` conforme o spec (a capa é `images[0]` via `coverOf`; o campo `kind` do projeto guarda "Produto próprio"/"Feito para cliente"): Task 2.
- Galeria 2D com os prints reais: Task 2.
- Placeholder quando a textura falha: `TextureBoundary` em capa, telas e preload (Tasks 6 e 8).
- Sem WebGL / movimento reduzido: 2D automático já existente; `SMOOTH` quase instantâneo remove a animação do mergulho (Task 6).
- Portal em hover/entrada renderiza a sala viva, os outros mostram a capa; qualidade baixa só com capa no hover; bloom/partículas por qualidade; lazy loading mantido: Tasks 7 e 9.
- Remoção de `vehicle/`, `zones/`, Minimap, GuideArrow, Joystick, Hud, Rapier: Task 1.
- Testes: `parallax`, `gallery`, layouts, store, conteúdo (arquivos existem em `public/shots`), `TopMenu`, `InfoPanel`, `ProjectHud`, `useGameKeys`, `TextureBoundary`, galeria 2D: Tasks 2–6.

**Placeholders:** nenhum "TBD/TODO". O nome/bio do usuário continuam "Seu Nome" por decisão do spec. Os campos de `skills.ts` foram derivados da stack dos projetos.

**Consistência de tipos/nomes:** `Phase`, `PanelId`, ações do store (`hoverProject`, `enterProject`, `finishEnter`, `leaveProject`, `finishLeave`, `focusImage`, `stepImage`, `openPanel`, `closePanel`), `PortalPlacement`, `ScreenPlacement`, `portalPlacements`, `screenPlacements`, `fitDistance`, `HUB_CAMERA/ROOM_ENTRY/ROOM_OVERVIEW`, `CAMERA_FOV`, `ROOM_FLOOR_Y`, `coverOf`, `imageKind`, `registerPortal/getPortalObject`, `SMOOTH` aparecem com os mesmos nomes em todas as tasks. Convenção: `rotationY = -theta` (portais das pontas viram para o centro); poses da sala em coordenadas locais do portal e convertidas por `localToWorld`.

**Riscos conhecidos (só confirmáveis no navegador):** tipagem exata do `ref`/`blend` do `MeshPortalMaterial`; o comportamento de `events={active}` ao entrar; a área de clique estável por cima do portal; o enquadramento do foco nas telas. As tasks pedem relato honesto do que não foi visto.
