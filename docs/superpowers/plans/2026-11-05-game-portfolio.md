# Portfólio em modo game — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portfólio React em que o visitante dirige um carrinho por uma cidade neon 3D e chega em distritos (Sobre, Projetos, Skills, Contato), com versão 2D rápida como alternativa.

**Architecture:** Vite + React + TypeScript. Lógica pura (input, física do carrinho, layout de zonas, qualidade, navegação) fica em módulos pequenos e testados com Vitest. A cena 3D usa React Three Fiber + Rapier; o estado global (zona ativa, painel, qualidade, modo) fica num store zustand. Painéis de conteúdo são HTML/React sobre o canvas e são reutilizados pela versão 2D, que lê os mesmos dados de `src/content/`.

**Tech Stack:** Vite, React 19, TypeScript, three, @react-three/fiber (v9), @react-three/drei, @react-three/rapier, @react-three/postprocessing, zustand, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-05-game-portfolio-design.md`

**Desvios deliberados do spec (decididos ao planejar):**
- O carrinho tem as rotações X/Z travadas (só gira em Y), então ele nunca vira. O reset (`R`) e o reset automático ao cair do mapa continuam.
- O modo é `'menu' | '3d' | '2d'` no store; a detecção de WebGL/movimento reduzido roda uma vez em `main.tsx`.

---

## File Structure

```
package.json, vite.config.ts, tsconfig.json, index.html, .gitignore
src/
  main.tsx                      # entrada; detecta fallback e monta <App/>
  App.tsx                       # escolhe menu / 3D / 2D
  styles.css                    # estilos globais, menu, painéis, fallback 2D
  test/setup.ts                 # jest-dom
  content/
    types.ts profile.ts projects.ts skills.ts contact.ts index.ts content.test.ts
  store/
    gameStore.ts gameStore.test.ts
  lib/
    capabilities.ts capabilities.test.ts
  world/
    quality.ts quality.test.ts
    skyline.ts skyline.test.ts
    NeonMaterial.tsx Arena.tsx Skyline.tsx Effects.tsx
  vehicle/
    input.ts input.test.ts
    useKeyboardInput.ts
    physics.ts physics.test.ts
    vehicleState.ts
    Vehicle.tsx CameraRig.tsx DriftSparks.tsx
  zones/
    zoneLayout.ts zoneLayout.test.ts
    ZoneBase.tsx Zones.tsx AboutKiosk.tsx ProjectBuilding.tsx SkillsWall.tsx ContactPortal.tsx
  ui/
    sections.tsx sections.test.tsx   # conteúdo reutilizado por painel 3D e 2D
    ZonePanel.tsx ZonePanel.test.tsx
    useInteractKeys.ts useInteractKeys.test.tsx
    guide.ts guide.test.ts           # matemática do minimapa/seta
    useRaf.ts Hud.tsx Minimap.tsx GuideArrow.tsx JoystickPad.tsx hud.css
    StartScreen.tsx GameErrorBoundary.tsx GameErrorBoundary.test.tsx
  fallback2d/
    Fallback2D.tsx Fallback2D.test.tsx
  game/
    Game.tsx                      # Canvas + Physics + HUD (carregado com lazy)
```

---

### Task 1: Scaffold do projeto

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/test/setup.ts`

- [ ] **Step 1: Criar `package.json`**

```json
{
  "name": "postfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Instalar dependências**

```bash
cd /home/wellington/Documentos/www/postfolio
npm install react react-dom three @react-three/fiber @react-three/drei @react-three/rapier @react-three/postprocessing zustand
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/three vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: termina sem erros. Confirme com `npm ls react @react-three/fiber` que React é 19.x e fiber é 9.x (fiber v9 exige React 19).

- [ ] **Step 3: Criar `vite.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
```

- [ ] **Step 4: Criar `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["vite/client", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 5: Criar `index.html`, `.gitignore`, `src/test/setup.ts`, `src/main.tsx`, `src/App.tsx`**

`index.html`:
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Portfólio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`.gitignore`:
```
node_modules
dist
*.local
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

`src/App.tsx` (placeholder, substituído na Task 10):
```tsx
export default function App() {
  return <h1>Portfólio</h1>
}
```

`src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: `tsc` sem erros e `vite build` conclui (`✓ built in ...`).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite react ts project with vitest"
```

---

### Task 2: Conteúdo de exemplo

**Files:**
- Create: `src/content/types.ts`, `profile.ts`, `projects.ts`, `skills.ts`, `contact.ts`, `index.ts`
- Test: `src/content/content.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

`src/content/content.test.ts`:
```ts
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/content`
Expected: FAIL (`Cannot find module './index'`).

- [ ] **Step 3: Implementar**

`src/content/types.ts`:
```ts
export interface Profile {
  name: string
  title: string
  bio: string
}

export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
  demoUrl: string
  repoUrl: string
  color: string
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

`src/content/profile.ts`:
```ts
import type { Profile } from './types'

export const profile: Profile = {
  name: 'Seu Nome',
  title: 'Desenvolvedor Full Stack',
  bio: 'Texto de exemplo: conte aqui sua trajetória, o que você gosta de construir e o que está procurando.',
}
```

`src/content/projects.ts`:
```ts
import type { Project } from './types'

export const projects: Project[] = [
  {
    id: 'exemplo-1',
    title: 'Projeto Exemplo 1',
    description: 'Descrição de exemplo do primeiro projeto.',
    stack: ['React', 'TypeScript', 'Node.js'],
    demoUrl: 'https://example.com/demo-1',
    repoUrl: 'https://github.com/seu-usuario/projeto-1',
    color: '#00f0ff',
  },
  {
    id: 'exemplo-2',
    title: 'Projeto Exemplo 2',
    description: 'Descrição de exemplo do segundo projeto.',
    stack: ['Next.js', 'PostgreSQL'],
    demoUrl: 'https://example.com/demo-2',
    repoUrl: 'https://github.com/seu-usuario/projeto-2',
    color: '#ff2bd6',
  },
  {
    id: 'exemplo-3',
    title: 'Projeto Exemplo 3',
    description: 'Descrição de exemplo do terceiro projeto.',
    stack: ['Three.js', 'WebGL'],
    demoUrl: 'https://example.com/demo-3',
    repoUrl: 'https://github.com/seu-usuario/projeto-3',
    color: '#9d4dff',
  },
  {
    id: 'exemplo-4',
    title: 'Projeto Exemplo 4',
    description: 'Descrição de exemplo do quarto projeto.',
    stack: ['Python', 'Django', 'Docker'],
    demoUrl: 'https://example.com/demo-4',
    repoUrl: 'https://github.com/seu-usuario/projeto-4',
    color: '#39ff88',
  },
]
```

`src/content/skills.ts`:
```ts
import type { SkillGroup } from './types'

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Front-end',
    skills: [
      { name: 'React', icon: '⚛️' },
      { name: 'TypeScript', icon: 'TS' },
      { name: 'Three.js', icon: '🧊' },
    ],
  },
  {
    id: 'backend',
    label: 'Back-end',
    skills: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Python', icon: '🐍' },
      { name: 'PostgreSQL', icon: '🐘' },
    ],
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    skills: [
      { name: 'Git', icon: '🔀' },
      { name: 'Docker', icon: '🐳' },
      { name: 'Linux', icon: '🐧' },
    ],
  },
]
```

`src/content/contact.ts`:
```ts
import type { Contact } from './types'

export const contact: Contact = {
  email: 'voce@example.com',
  github: 'https://github.com/seu-usuario',
  linkedin: 'https://linkedin.com/in/seu-usuario',
  whatsapp: 'https://wa.me/5500000000000',
}
```

`src/content/index.ts`:
```ts
export * from './types'
export { profile } from './profile'
export { projects } from './projects'
export { skillGroups } from './skills'
export { contact } from './contact'
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/content`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/content
git commit -m "feat: add sample portfolio content"
```

---

### Task 3: Layout das zonas

**Files:**
- Create: `src/zones/zoneLayout.ts`
- Test: `src/zones/zoneLayout.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { projects } from '../content'
import { buildZones, getZone, spawnPoint, ARENA_HALF } from './zoneLayout'

describe('zoneLayout', () => {
  const zones = buildZones(projects)

  it('creates about, skills, contact and one zone per project', () => {
    expect(zones).toHaveLength(projects.length + 3)
    expect(zones.map((z) => z.kind).sort()).toEqual(
      ['about', 'contact', 'skills', ...projects.map(() => 'project')].sort(),
    )
  })

  it('has unique ids', () => {
    const ids = zones.map((z) => z.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps every zone inside the arena with margin', () => {
    for (const z of zones) {
      expect(Math.abs(z.position[0])).toBeLessThanOrEqual(ARENA_HALF - 8)
      expect(Math.abs(z.position[1])).toBeLessThanOrEqual(ARENA_HALF - 8)
    }
  })

  it('keeps zones at least 12 units apart', () => {
    for (let i = 0; i < zones.length; i++) {
      for (let j = i + 1; j < zones.length; j++) {
        const [ax, az] = zones[i].position
        const [bx, bz] = zones[j].position
        expect(Math.hypot(ax - bx, az - bz)).toBeGreaterThanOrEqual(12)
      }
    }
  })

  it('links project zones to their project', () => {
    const z = zones.find((x) => x.kind === 'project')!
    expect(z.projectId).toBe(projects[0].id)
    expect(z.id).toBe(`project:${projects[0].id}`)
  })

  it('getZone finds by id and spawn is away from every zone', () => {
    expect(getZone('about')?.kind).toBe('about')
    expect(getZone('nope')).toBeUndefined()
    for (const z of buildZones()) {
      expect(Math.hypot(z.position[0] - spawnPoint[0], z.position[1] - spawnPoint[2])).toBeGreaterThan(10)
    }
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/zones`
Expected: FAIL (módulo não existe).

- [ ] **Step 3: Implementar `src/zones/zoneLayout.ts`**

```ts
import { projects as sampleProjects } from '../content'
import type { Project } from '../content'

export type ZoneKind = 'about' | 'project' | 'skills' | 'contact'

export interface ZoneDef {
  id: string
  kind: ZoneKind
  label: string
  /** [x, z] no plano do chão */
  position: [number, number]
  color: string
  projectId?: string
}

/** Meia-largura da arena quadrada (paredes em ±ARENA_HALF). */
export const ARENA_HALF = 50

/** [x, y, z] onde o carrinho nasce, virado para -z. */
export const spawnPoint: [number, number, number] = [0, 1, 0]

export function buildZones(projectList: Project[] = sampleProjects): ZoneDef[] {
  const n = projectList.length
  const projectZones: ZoneDef[] = projectList.map((p, i) => ({
    id: `project:${p.id}`,
    kind: 'project',
    label: p.title,
    position: [n === 1 ? 0 : -24 + (48 / (n - 1)) * i, 28],
    color: p.color,
    projectId: p.id,
  }))

  return [
    { id: 'about', kind: 'about', label: 'Sobre mim', position: [0, -22], color: '#00f0ff' },
    ...projectZones,
    { id: 'skills', kind: 'skills', label: 'Skills', position: [-30, 5], color: '#39ff88' },
    { id: 'contact', kind: 'contact', label: 'Contato', position: [30, 5], color: '#ff2bd6' },
  ]
}

export const zones: ZoneDef[] = buildZones()

export function getZone(id: string): ZoneDef | undefined {
  return zones.find((z) => z.id === id)
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/zones`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/zones
git commit -m "feat: add zone layout"
```

---

### Task 4: Qualidade e skyline (lógica pura do mundo)

**Files:**
- Create: `src/world/quality.ts`, `src/world/skyline.ts`
- Test: `src/world/quality.test.ts`, `src/world/skyline.test.ts`

- [ ] **Step 1: Escrever os testes que falham**

`src/world/quality.test.ts`:
```ts
import { lowerQuality, QUALITY_SETTINGS, raiseQuality } from './quality'

describe('quality', () => {
  it('lowers high -> medium -> low and stops at low', () => {
    expect(lowerQuality('high')).toBe('medium')
    expect(lowerQuality('medium')).toBe('low')
    expect(lowerQuality('low')).toBe('low')
  })

  it('raises low -> medium -> high and stops at high', () => {
    expect(raiseQuality('low')).toBe('medium')
    expect(raiseQuality('medium')).toBe('high')
    expect(raiseQuality('high')).toBe('high')
  })

  it('has progressively cheaper settings', () => {
    expect(QUALITY_SETTINGS.high.buildings).toBeGreaterThan(QUALITY_SETTINGS.medium.buildings)
    expect(QUALITY_SETTINGS.medium.buildings).toBeGreaterThan(QUALITY_SETTINGS.low.buildings)
    expect(QUALITY_SETTINGS.low.bloom).toBe(false)
    expect(QUALITY_SETTINGS.low.sparks).toBe(false)
  })
})
```

`src/world/skyline.test.ts`:
```ts
import { generateSkyline, mulberry32 } from './skyline'

describe('skyline', () => {
  it('mulberry32 is deterministic and in [0,1)', () => {
    const a = mulberry32(1)
    const b = mulberry32(1)
    for (let i = 0; i < 10; i++) {
      const v = a()
      expect(v).toBe(b())
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('generates the requested count deterministically', () => {
    expect(generateSkyline(30, 7)).toHaveLength(30)
    expect(generateSkyline(30, 7)).toEqual(generateSkyline(30, 7))
    expect(generateSkyline(30, 7)).not.toEqual(generateSkyline(30, 8))
  })

  it('keeps every building outside the arena', () => {
    for (const b of generateSkyline(200, 3)) {
      expect(Math.max(Math.abs(b.x), Math.abs(b.z))).toBeGreaterThanOrEqual(58)
    }
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/world`
Expected: FAIL (módulos não existem).

- [ ] **Step 3: Implementar**

`src/world/quality.ts`:
```ts
export type Quality = 'high' | 'medium' | 'low'

const ORDER: Quality[] = ['high', 'medium', 'low']

export function lowerQuality(q: Quality): Quality {
  return ORDER[Math.min(ORDER.indexOf(q) + 1, ORDER.length - 1)]
}

export function raiseQuality(q: Quality): Quality {
  return ORDER[Math.max(ORDER.indexOf(q) - 1, 0)]
}

export interface QualitySettings {
  dpr: number | [number, number]
  bloom: boolean
  buildings: number
  trails: boolean
  sparks: boolean
}

export const QUALITY_SETTINGS: Record<Quality, QualitySettings> = {
  high: { dpr: [1, 2], bloom: true, buildings: 80, trails: true, sparks: true },
  medium: { dpr: [1, 1.5], bloom: true, buildings: 40, trails: true, sparks: true },
  low: { dpr: 1, bloom: false, buildings: 20, trails: false, sparks: false },
}
```

`src/world/skyline.ts`:
```ts
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Building {
  x: number
  z: number
  w: number
  h: number
  d: number
  neon: string
}

const NEON = ['#00f0ff', '#ff2bd6', '#9d4dff', '#39ff88']

/** Prédios de fundo, sempre fora da arena (Chebyshev >= 58). */
export function generateSkyline(count: number, seed = 7): Building[] {
  const rnd = mulberry32(seed)
  const out: Building[] = []
  while (out.length < count) {
    const x = (rnd() * 2 - 1) * 130
    const z = (rnd() * 2 - 1) * 130
    if (Math.max(Math.abs(x), Math.abs(z)) < 58) continue
    out.push({
      x,
      z,
      w: 6 + rnd() * 6,
      h: 15 + rnd() * 45,
      d: 6 + rnd() * 6,
      neon: NEON[Math.floor(rnd() * NEON.length)],
    })
  }
  return out
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/world`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/world
git commit -m "feat: add quality levels and skyline generator"
```

---

### Task 5: Detecção de capacidades

**Files:**
- Create: `src/lib/capabilities.ts`
- Test: `src/lib/capabilities.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { detectFallbackReason, FALLBACK_MESSAGES, type Env } from './capabilities'

const env = (hasWebGL: boolean, reduced: boolean): Env => ({
  hasWebGL: () => hasWebGL,
  prefersReducedMotion: () => reduced,
})

describe('detectFallbackReason', () => {
  it('returns null when 3D can run', () => {
    expect(detectFallbackReason(env(true, false))).toBeNull()
  })
  it('returns no-webgl first', () => {
    expect(detectFallbackReason(env(false, true))).toBe('no-webgl')
  })
  it('returns reduced-motion when webgl exists', () => {
    expect(detectFallbackReason(env(true, true))).toBe('reduced-motion')
  })
  it('has a message for each reason', () => {
    expect(FALLBACK_MESSAGES['no-webgl']).toBeTruthy()
    expect(FALLBACK_MESSAGES['reduced-motion']).toBeTruthy()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/lib/capabilities.ts`**

```ts
export type FallbackReason = 'no-webgl' | 'reduced-motion'

export interface Env {
  hasWebGL: () => boolean
  prefersReducedMotion: () => boolean
}

export const browserEnv: Env = {
  hasWebGL: () => {
    try {
      const c = document.createElement('canvas')
      return !!(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {
      return false
    }
  },
  prefersReducedMotion: () =>
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
}

export function detectFallbackReason(env: Env = browserEnv): FallbackReason | null {
  if (!env.hasWebGL()) return 'no-webgl'
  if (env.prefersReducedMotion()) return 'reduced-motion'
  return null
}

export const FALLBACK_MESSAGES: Record<FallbackReason, string> = {
  'no-webgl': 'Seu dispositivo não suporta WebGL, então você está vendo a versão rápida.',
  'reduced-motion': 'Movimento reduzido ativo no seu sistema: mostrando a versão rápida.',
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib
git commit -m "feat: detect webgl and reduced motion"
```

---

### Task 6: Store global

**Files:**
- Create: `src/store/gameStore.ts`
- Test: `src/store/gameStore.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { initialGameState, useGameStore } from './gameStore'

const s = () => useGameStore.getState()

describe('gameStore', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('starts in menu with nothing active', () => {
    expect(s().mode).toBe('menu')
    expect(s().activeZone).toBeNull()
    expect(s().panelOpen).toBe(false)
    expect(s().visited).toEqual([])
  })

  it('enterZone sets activeZone; leaveZone clears it and closes panel', () => {
    s().enterZone('about')
    expect(s().activeZone).toBe('about')
    s().openPanel()
    expect(s().panelOpen).toBe(true)
    s().leaveZone('about')
    expect(s().activeZone).toBeNull()
    expect(s().panelOpen).toBe(false)
  })

  it('leaveZone of a different zone is a no-op', () => {
    s().enterZone('about')
    s().leaveZone('skills')
    expect(s().activeZone).toBe('about')
  })

  it('openPanel needs an active zone and records visited once', () => {
    s().openPanel()
    expect(s().panelOpen).toBe(false)
    s().enterZone('about')
    s().openPanel()
    s().closePanel()
    s().openPanel()
    expect(s().visited).toEqual(['about'])
  })

  it('setMode stores notice and resets zone state', () => {
    s().enterZone('about')
    s().setMode('2d', 'aviso')
    expect(s().mode).toBe('2d')
    expect(s().notice).toBe('aviso')
    expect(s().activeZone).toBeNull()
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
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/store`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/store/gameStore.ts`**

```ts
import { create } from 'zustand'
import { lowerQuality, raiseQuality, type Quality } from '../world/quality'

export type Mode = 'menu' | '3d' | '2d'

interface GameState {
  mode: Mode
  notice: string | null
  quality: Quality
  activeZone: string | null
  panelOpen: boolean
  visited: string[]
  setMode: (mode: Mode, notice?: string | null) => void
  setQuality: (q: Quality) => void
  lowerQuality: () => void
  raiseQuality: () => void
  enterZone: (id: string) => void
  leaveZone: (id: string) => void
  openPanel: () => void
  closePanel: () => void
}

export const initialGameState = {
  mode: 'menu' as Mode,
  notice: null as string | null,
  quality: 'high' as Quality,
  activeZone: null as string | null,
  panelOpen: false,
  visited: [] as string[],
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialGameState,
  setMode: (mode, notice = null) => set({ mode, notice, activeZone: null, panelOpen: false }),
  setQuality: (quality) => set({ quality }),
  lowerQuality: () => set({ quality: lowerQuality(get().quality) }),
  raiseQuality: () => set({ quality: raiseQuality(get().quality) }),
  enterZone: (id) => set({ activeZone: id }),
  leaveZone: (id) => {
    if (get().activeZone === id) set({ activeZone: null, panelOpen: false })
  },
  openPanel: () => {
    const { activeZone, visited } = get()
    if (!activeZone) return
    set({
      panelOpen: true,
      visited: visited.includes(activeZone) ? visited : [...visited, activeZone],
    })
  },
  closePanel: () => set({ panelOpen: false }),
}))
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/store`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/store
git commit -m "feat: add game store"
```

---

### Task 7: Input unificado (teclado + joystick)

**Files:**
- Create: `src/vehicle/input.ts`, `src/vehicle/useKeyboardInput.ts`
- Test: `src/vehicle/input.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { joystickVector, keysToControls, mergeControls } from './input'

describe('keysToControls', () => {
  it('maps WASD and arrows', () => {
    expect(keysToControls(new Set(['KeyW']))).toEqual({ throttle: 1, steer: 0, brake: false })
    expect(keysToControls(new Set(['ArrowDown']))).toEqual({ throttle: -1, steer: 0, brake: false })
    expect(keysToControls(new Set(['KeyA']))).toEqual({ throttle: 0, steer: 1, brake: false })
    expect(keysToControls(new Set(['ArrowRight']))).toEqual({ throttle: 0, steer: -1, brake: false })
    expect(keysToControls(new Set(['Space']))).toEqual({ throttle: 0, steer: 0, brake: true })
  })

  it('cancels opposite keys', () => {
    expect(keysToControls(new Set(['KeyW', 'KeyS'])).throttle).toBe(0)
    expect(keysToControls(new Set(['KeyA', 'KeyD'])).steer).toBe(0)
  })
})

describe('joystickVector', () => {
  it('normalizes by radius', () => {
    expect(joystickVector(25, 0, 50)).toEqual({ x: 0.5, y: 0 })
  })
  it('clamps magnitude to 1', () => {
    const v = joystickVector(100, 100, 50)
    expect(Math.hypot(v.x, v.y)).toBeCloseTo(1)
  })
})

describe('mergeControls', () => {
  it('pushing the stick up accelerates, left steers left', () => {
    const none = { throttle: 0, steer: 0, brake: false }
    expect(mergeControls(none, { x: 0, y: -1 })).toEqual({ throttle: 1, steer: 0, brake: false })
    expect(mergeControls(none, { x: -1, y: 0 })).toEqual({ throttle: 0, steer: 1, brake: false })
  })
  it('clamps combined input to [-1, 1]', () => {
    const k = { throttle: 1, steer: 1, brake: true }
    expect(mergeControls(k, { x: -1, y: -1 })).toEqual({ throttle: 1, steer: 1, brake: true })
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/vehicle/input`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/vehicle/input.ts`**

```ts
export interface Controls {
  /** -1 (ré) .. 1 (frente) */
  throttle: number
  /** -1 (direita) .. 1 (esquerda) */
  steer: number
  brake: boolean
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function keysToControls(pressed: ReadonlySet<string>): Controls {
  const up = pressed.has('KeyW') || pressed.has('ArrowUp')
  const down = pressed.has('KeyS') || pressed.has('ArrowDown')
  const left = pressed.has('KeyA') || pressed.has('ArrowLeft')
  const right = pressed.has('KeyD') || pressed.has('ArrowRight')
  return {
    throttle: (up ? 1 : 0) - (down ? 1 : 0),
    steer: (left ? 1 : 0) - (right ? 1 : 0),
    brake: pressed.has('Space'),
  }
}

/** dx/dy em pixels a partir do centro do joystick; saída com magnitude <= 1. */
export function joystickVector(dx: number, dy: number, radius: number): { x: number; y: number } {
  const mag = Math.hypot(dx, dy)
  const scale = mag > radius ? radius / mag : 1
  return { x: (dx * scale) / radius, y: (dy * scale) / radius }
}

export function mergeControls(k: Controls, joystick: { x: number; y: number }): Controls {
  return {
    throttle: clamp(k.throttle - joystick.y, -1, 1),
    steer: clamp(k.steer - joystick.x, -1, 1),
    brake: k.brake,
  }
}

/** Estado mutável lido pelo loop de física (evita re-render do React). */
export const inputState = {
  keys: new Set<string>(),
  joystick: { x: 0, y: 0 },
  resetRequested: false,
}

export function getControls(): Controls {
  return mergeControls(keysToControls(inputState.keys), inputState.joystick)
}
```

- [ ] **Step 4: Implementar `src/vehicle/useKeyboardInput.ts`**

```ts
import { useEffect } from 'react'
import { inputState } from './input'

const GAME_KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space',
])

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
}

export function useKeyboardInput() {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return
      if (e.code === 'KeyR') inputState.resetRequested = true
      if (GAME_KEYS.has(e.code)) {
        inputState.keys.add(e.code)
        e.preventDefault()
      }
    }
    const up = (e: KeyboardEvent) => {
      inputState.keys.delete(e.code)
    }
    const clear = () => inputState.keys.clear()

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
      inputState.keys.clear()
    }
  }, [])
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run src/vehicle/input`
Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add src/vehicle
git commit -m "feat: add unified vehicle input"
```

---

### Task 8: Física do carrinho e matemática de câmera/guia

**Files:**
- Create: `src/vehicle/physics.ts`, `src/ui/guide.ts`
- Test: `src/vehicle/physics.test.ts`, `src/ui/guide.test.ts`

- [ ] **Step 1: Escrever os testes que falham**

`src/vehicle/physics.test.ts`:
```ts
import { brakeImpulse, DRIVE, driveForce, followPosition, lateralImpulse, yawRate } from './physics'

describe('driveForce', () => {
  it('accelerates forward and backward', () => {
    expect(driveForce(1, 0)).toBe(DRIVE.engine)
    expect(driveForce(-1, 0)).toBe(-DRIVE.reverse)
    expect(driveForce(0, 5)).toBe(0)
  })
  it('stops pushing at max speed', () => {
    expect(driveForce(1, DRIVE.maxSpeed)).toBe(0)
    expect(driveForce(-1, -DRIVE.maxReverse)).toBe(0)
  })
})

describe('yawRate', () => {
  it('does not rotate when stopped', () => {
    expect(yawRate(1, 0)).toBe(0)
  })
  it('turns left (positive) when steering left while moving forward', () => {
    expect(yawRate(1, 12)).toBeGreaterThan(0)
  })
  it('inverts when reversing', () => {
    expect(yawRate(1, -12)).toBeLessThan(0)
  })
})

describe('lateralImpulse', () => {
  it('opposes sideways velocity', () => {
    expect(lateralImpulse(4, false, 1 / 60)).toBeLessThan(0)
    expect(lateralImpulse(-4, false, 1 / 60)).toBeGreaterThan(0)
  })
  it('slides more with handbrake', () => {
    expect(Math.abs(lateralImpulse(4, true, 1 / 60))).toBeLessThan(Math.abs(lateralImpulse(4, false, 1 / 60)))
  })
})

describe('brakeImpulse', () => {
  it('opposes forward velocity', () => {
    expect(brakeImpulse(10, 1 / 60)).toBeLessThan(0)
    expect(brakeImpulse(-10, 1 / 60)).toBeGreaterThan(0)
  })
})

describe('followPosition', () => {
  it('sits behind and above the car', () => {
    const p = followPosition({ x: 0, y: 0, z: 0 }, 0, 10, 5)
    expect(p.x).toBeCloseTo(0)
    expect(p.y).toBeCloseTo(5)
    expect(p.z).toBeCloseTo(10)
  })
  it('rotates with heading', () => {
    const p = followPosition({ x: 0, y: 0, z: 0 }, Math.PI / 2, 10, 5)
    expect(p.x).toBeCloseTo(10)
    expect(p.z).toBeCloseTo(0)
  })
})
```

`src/ui/guide.test.ts`:
```ts
import { bearingTo, nearestUnvisited } from './guide'
import type { ZoneDef } from '../zones/zoneLayout'

const z = (id: string, x: number, zz: number): ZoneDef => ({
  id, kind: 'about', label: id, position: [x, zz], color: '#fff',
})

describe('bearingTo', () => {
  const from = { x: 0, z: 0 }
  it('is 0 when the target is straight ahead', () => {
    expect(bearingTo(from, 0, [0, -10])).toBeCloseTo(0)
  })
  it('is +PI/2 when the target is on the right', () => {
    expect(bearingTo(from, 0, [10, 0])).toBeCloseTo(Math.PI / 2)
  })
  it('is -PI/2 on the left', () => {
    expect(bearingTo(from, 0, [-10, 0])).toBeCloseTo(-Math.PI / 2)
  })
  it('is PI behind', () => {
    expect(Math.abs(bearingTo(from, 0, [0, 10]))).toBeCloseTo(Math.PI)
  })
  it('accounts for heading', () => {
    // virado para -x (heading PI/2), alvo em -x => à frente
    expect(bearingTo(from, Math.PI / 2, [-10, 0])).toBeCloseTo(0)
  })
})

describe('nearestUnvisited', () => {
  const zones = [z('a', 0, -10), z('b', 30, 0), z('c', 5, 5)]
  it('returns the closest zone not yet visited', () => {
    expect(nearestUnvisited({ x: 0, z: 0 }, zones, ['a'])?.id).toBe('c')
  })
  it('returns undefined when everything was visited', () => {
    expect(nearestUnvisited({ x: 0, z: 0 }, zones, ['a', 'b', 'c'])).toBeUndefined()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/vehicle/physics src/ui/guide`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/vehicle/physics.ts`**

```ts
export interface DriveParams {
  engine: number
  reverse: number
  maxSpeed: number
  maxReverse: number
  steer: number
  grip: number
  brakeGrip: number
}

/** Valores de "feeling" do carrinho — ajuste aqui. Massa efetiva = 1, então força == aceleração (m/s²). */
export const DRIVE: DriveParams = {
  engine: 30,
  reverse: 18,
  maxSpeed: 24,
  maxReverse: 8,
  steer: 2.4,
  grip: 5,
  brakeGrip: 1,
}

/** Aceleração ao longo do eixo frontal. `speed` é a velocidade frontal atual. */
export function driveForce(throttle: number, speed: number, p: DriveParams = DRIVE): number {
  if (throttle > 0) return speed >= p.maxSpeed ? 0 : throttle * p.engine
  if (throttle < 0) return speed <= -p.maxReverse ? 0 : throttle * p.reverse
  return 0
}

/** Velocidade angular em Y. Só gira quando está em movimento; inverte em ré. */
export function yawRate(steer: number, speed: number, p: DriveParams = DRIVE): number {
  const factor = Math.min(Math.abs(speed) / 6, 1)
  const dir = speed >= 0 ? 1 : -1
  return steer * p.steer * factor * dir
}

/** Variação de velocidade lateral por frame que mata a derrapagem (menos grip = derrapa mais). */
export function lateralImpulse(lateralSpeed: number, brake: boolean, dt: number, p: DriveParams = DRIVE): number {
  const grip = brake ? p.brakeGrip : p.grip
  return -lateralSpeed * Math.min(grip * dt, 1)
}

/** Freio de mão: reduz a velocidade frontal. */
export function brakeImpulse(speed: number, dt: number): number {
  return -speed * Math.min(3 * dt, 1)
}

/** Posição da câmera atrás e acima do carrinho. heading: rotação em Y (0 = olhando para -z). */
export function followPosition(
  pos: { x: number; y: number; z: number },
  heading: number,
  distance: number,
  height: number,
) {
  return {
    x: pos.x + Math.sin(heading) * distance,
    y: pos.y + height,
    z: pos.z + Math.cos(heading) * distance,
  }
}
```

- [ ] **Step 4: Implementar `src/ui/guide.ts`**

```ts
import type { ZoneDef } from '../zones/zoneLayout'

/** Ângulo (rad) do alvo relativo à frente do carrinho; positivo = à direita. */
export function bearingTo(from: { x: number; z: number }, heading: number, target: [number, number]): number {
  const dx = target[0] - from.x
  const dz = target[1] - from.z
  const fx = -Math.sin(heading)
  const fz = -Math.cos(heading)
  const rx = Math.cos(heading)
  const rz = -Math.sin(heading)
  return Math.atan2(dx * rx + dz * rz, dx * fx + dz * fz)
}

export function nearestUnvisited(
  from: { x: number; z: number },
  zoneList: ZoneDef[],
  visited: string[],
): ZoneDef | undefined {
  let best: ZoneDef | undefined
  let bestDist = Infinity
  for (const z of zoneList) {
    if (visited.includes(z.id)) continue
    const d = Math.hypot(z.position[0] - from.x, z.position[1] - from.z)
    if (d < bestDist) {
      best = z
      bestDist = d
    }
  }
  return best
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run src/vehicle/physics src/ui/guide`
Expected: PASS (14 tests).

- [ ] **Step 6: Commit**

```bash
git add src/vehicle/physics.ts src/vehicle/physics.test.ts src/ui/guide.ts src/ui/guide.test.ts
git commit -m "feat: add vehicle physics helpers and guide math"
```

---

### Task 9: Seções de conteúdo, painel de zona e atalhos E/Esc

**Files:**
- Create: `src/ui/sections.tsx`, `src/ui/ZonePanel.tsx`, `src/ui/useInteractKeys.ts`
- Test: `src/ui/sections.test.tsx`, `src/ui/ZonePanel.test.tsx`, `src/ui/useInteractKeys.test.tsx`

- [ ] **Step 1: Escrever os testes que falham**

`src/ui/sections.test.tsx`:
```tsx
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
```

`src/ui/ZonePanel.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { profile, projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { ZonePanel } from './ZonePanel'

describe('ZonePanel', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('renders nothing while closed', () => {
    render(<ZonePanel />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the about content when the about zone panel is open', () => {
    useGameStore.setState({ activeZone: 'about', panelOpen: true })
    render(<ZonePanel />)
    expect(screen.getByRole('dialog', { name: 'Sobre mim' })).toBeInTheDocument()
    expect(screen.getByText(profile.bio)).toBeInTheDocument()
  })

  it('shows a project when a project zone is open', () => {
    useGameStore.setState({ activeZone: `project:${projects[1].id}`, panelOpen: true })
    render(<ZonePanel />)
    expect(screen.getByRole('heading', { name: projects[1].title })).toBeInTheDocument()
  })

  it('closes with the close button', async () => {
    useGameStore.setState({ activeZone: 'about', panelOpen: true })
    render(<ZonePanel />)
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(useGameStore.getState().panelOpen).toBe(false)
  })
})
```

`src/ui/useInteractKeys.test.tsx`:
```tsx
import { renderHook } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { initialGameState, useGameStore } from '../store/gameStore'
import { useInteractKeys } from './useInteractKeys'

describe('useInteractKeys', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('E opens the panel only inside a zone', () => {
    renderHook(() => useInteractKeys())
    fireEvent.keyDown(window, { code: 'KeyE' })
    expect(useGameStore.getState().panelOpen).toBe(false)
    useGameStore.getState().enterZone('about')
    fireEvent.keyDown(window, { code: 'KeyE' })
    expect(useGameStore.getState().panelOpen).toBe(true)
  })

  it('Escape closes the panel', () => {
    renderHook(() => useInteractKeys())
    useGameStore.getState().enterZone('about')
    useGameStore.getState().openPanel()
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(useGameStore.getState().panelOpen).toBe(false)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/ui`
Expected: FAIL (módulos não existem; os testes de `guide` já passam).

- [ ] **Step 3: Implementar `src/ui/sections.tsx`**

```tsx
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
      <p>{project.description}</p>
      <ul className="chips">
        {project.stack.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="links">
        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
          Demo
        </a>
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
          Código
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
```

- [ ] **Step 4: Implementar `src/ui/ZonePanel.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import { projects } from '../content'
import { useGameStore } from '../store/gameStore'
import { getZone } from '../zones/zoneLayout'
import { ContactSection, ProfileSection, ProjectDetail, SkillsSection } from './sections'

export function ZonePanel() {
  const activeZone = useGameStore((s) => s.activeZone)
  const panelOpen = useGameStore((s) => s.panelOpen)
  const closePanel = useGameStore((s) => s.closePanel)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (panelOpen) closeRef.current?.focus()
  }, [panelOpen])

  if (!panelOpen || !activeZone) return null
  const zone = getZone(activeZone)
  if (!zone) return null

  let body = null
  if (zone.kind === 'about') body = <ProfileSection />
  else if (zone.kind === 'skills') body = <SkillsSection />
  else if (zone.kind === 'contact') body = <ContactSection />
  else if (zone.kind === 'project') {
    const project = projects.find((p) => p.id === zone.projectId)
    body = project ? <ProjectDetail project={project} /> : null
  }

  return (
    <div className="panel-backdrop">
      <div role="dialog" aria-modal="true" aria-label={zone.label} className="panel">
        <button ref={closeRef} className="panel-close" aria-label="Fechar" onClick={closePanel}>
          ✕
        </button>
        {body}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Implementar `src/ui/useInteractKeys.ts`**

```ts
import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useInteractKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { activeZone, panelOpen, openPanel, closePanel } = useGameStore.getState()
      if (e.code === 'KeyE' && activeZone && !panelOpen) openPanel()
      else if (e.code === 'Escape' && panelOpen) closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `npx vitest run src/ui`
Expected: PASS (todos os testes de `ui`).

- [ ] **Step 7: Commit**

```bash
git add src/ui
git commit -m "feat: add content sections, zone panel and interact keys"
```

---

### Task 10: Fallback 2D, menu inicial, error boundary, App e estilos (marco: app roda em 2D)

**Files:**
- Create: `src/fallback2d/Fallback2D.tsx`, `src/ui/StartScreen.tsx`, `src/ui/GameErrorBoundary.tsx`, `src/styles.css`
- Modify: `src/App.tsx`, `src/main.tsx`
- Test: `src/fallback2d/Fallback2D.test.tsx`, `src/ui/GameErrorBoundary.test.tsx`

- [ ] **Step 1: Escrever os testes que falham**

`src/fallback2d/Fallback2D.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { profile, projects } from '../content'
import { initialGameState, useGameStore } from '../store/gameStore'
import { Fallback2D } from './Fallback2D'

describe('Fallback2D', () => {
  beforeEach(() => useGameStore.setState(initialGameState))

  it('renders every section from content', () => {
    render(<Fallback2D />)
    expect(screen.getByRole('heading', { name: profile.name })).toBeInTheDocument()
    for (const p of projects) expect(screen.getByRole('heading', { name: p.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contato' })).toBeInTheDocument()
  })

  it('shows the notice when present', () => {
    useGameStore.setState({ notice: 'sem webgl' })
    render(<Fallback2D />)
    expect(screen.getByRole('status')).toHaveTextContent('sem webgl')
  })

  it('goes back to the menu with the 3D button', async () => {
    useGameStore.setState({ mode: '2d' })
    render(<Fallback2D />)
    await userEvent.click(screen.getByRole('button', { name: /mundo 3d/i }))
    expect(useGameStore.getState().mode).toBe('menu')
  })
})
```

`src/ui/GameErrorBoundary.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { GameErrorBoundary } from './GameErrorBoundary'

function Boom(): never {
  throw new Error('boom')
}

describe('GameErrorBoundary', () => {
  it('renders children when fine', () => {
    render(
      <GameErrorBoundary onError={() => {}}>
        <p>ok</p>
      </GameErrorBoundary>,
    )
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  it('calls onError and hides children when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = vi.fn()
    render(
      <GameErrorBoundary onError={onError}>
        <Boom />
      </GameErrorBoundary>,
    )
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    spy.mockRestore()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/fallback2d src/ui/GameErrorBoundary`
Expected: FAIL.

- [ ] **Step 3: Implementar `src/ui/GameErrorBoundary.tsx`**

```tsx
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onError: (error: Error) => void
}

export class GameErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
```

- [ ] **Step 4: Implementar `src/fallback2d/Fallback2D.tsx`**

```tsx
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
```

- [ ] **Step 5: Implementar `src/ui/StartScreen.tsx`**

```tsx
import { profile } from '../content'
import { useGameStore } from '../store/gameStore'

export function StartScreen() {
  const setMode = useGameStore((s) => s.setMode)
  return (
    <main className="start">
      <h1 className="neon-title">{profile.name}</h1>
      <p className="muted">{profile.title}</p>
      <div className="start-actions">
        <button className="btn btn-primary" onClick={() => setMode('3d')}>
          Start
        </button>
        <button className="btn" onClick={() => setMode('2d')}>
          Versão rápida (2D)
        </button>
      </div>
      <p className="muted small">WASD / setas para dirigir · Espaço freia · E abre · R reinicia</p>
    </main>
  )
}
```

- [ ] **Step 6: Substituir `src/App.tsx`**

```tsx
import { lazy, Suspense } from 'react'
import { Fallback2D } from './fallback2d/Fallback2D'
import { useGameStore } from './store/gameStore'
import { GameErrorBoundary } from './ui/GameErrorBoundary'
import { StartScreen } from './ui/StartScreen'

// A cena 3D e a física só são baixadas quando o jogador aperta Start.
const Game = lazy(() => import('./game/Game'))

export default function App() {
  const mode = useGameStore((s) => s.mode)
  const setMode = useGameStore((s) => s.setMode)

  if (mode === '2d') return <Fallback2D />
  if (mode === 'menu') return <StartScreen />

  return (
    <GameErrorBoundary onError={() => setMode('2d', 'Não foi possível carregar o mundo 3D. Você está vendo a versão rápida.')}>
      <Suspense fallback={<div className="loading">Carregando…</div>}>
        <Game />
      </Suspense>
    </GameErrorBoundary>
  )
}
```

- [ ] **Step 7: Criar um `Game` provisório para o build passar**

`src/game/Game.tsx` (substituído na Task 11):
```tsx
export default function Game() {
  return <div className="loading">Mundo 3D em construção</div>
}
```

- [ ] **Step 8: Atualizar `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { detectFallbackReason, FALLBACK_MESSAGES } from './lib/capabilities'
import { useGameStore } from './store/gameStore'
import './styles.css'

const reason = detectFallbackReason()
if (reason) useGameStore.getState().setMode('2d', FALLBACK_MESSAGES[reason])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 9: Criar `src/styles.css`**

```css
:root {
  --bg: #05050d;
  --panel: rgba(10, 10, 24, 0.92);
  --cyan: #00f0ff;
  --magenta: #ff2bd6;
  --text: #e8ecff;
  --muted: #8b93b8;
  --accent: var(--cyan);
  color-scheme: dark;
}

* { box-sizing: border-box; }

html, body, #root { height: 100%; margin: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  overflow-x: hidden;
}

a { color: var(--cyan); }
h1, h2, h3 { margin: 0 0 0.5rem; }
.muted { color: var(--muted); }
.small { font-size: 0.8rem; }

.btn {
  font: inherit;
  color: var(--text);
  background: transparent;
  border: 1px solid var(--cyan);
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  min-height: 44px;
}
.btn:hover, .btn:focus-visible { background: rgba(0, 240, 255, 0.15); outline: none; box-shadow: 0 0 14px var(--cyan); }
.btn-primary { border-color: var(--magenta); box-shadow: 0 0 14px rgba(255, 43, 214, 0.5); }

.start {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 24px 16px;
  text-align: center;
  background: radial-gradient(circle at 50% 30%, #1a0b3a 0%, var(--bg) 60%);
}
.neon-title {
  font-size: clamp(2rem, 8vw, 4.5rem);
  color: var(--cyan);
  text-shadow: 0 0 8px var(--cyan), 0 0 28px var(--magenta);
  letter-spacing: 0.08em;
}
.start-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

.loading {
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--cyan);
}

/* Fallback 2D */
.fallback { max-width: 900px; margin: 0 auto; padding: 24px 16px 64px; display: grid; gap: 24px; }
.notice { margin: 0; padding: 12px 16px; border: 1px solid var(--magenta); border-radius: 6px; }
.section { padding: 16px; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 8px; background: rgba(10, 10, 24, 0.6); }
.section article, article.section { border-color: var(--accent); }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.chips { list-style: none; padding: 0; margin: 0.5rem 0; display: flex; flex-wrap: wrap; gap: 8px; }
.chips li { padding: 4px 10px; border: 1px solid var(--accent); border-radius: 999px; font-size: 0.85rem; }
.links { display: flex; gap: 16px; flex-wrap: wrap; }

/* Painel sobre o canvas */
.panel-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.45);
  z-index: 20;
}
.panel {
  position: relative;
  width: min(560px, 100%);
  max-height: 85vh;
  overflow: auto;
  padding: 24px;
  background: var(--panel);
  border: 1px solid var(--cyan);
  border-radius: 10px;
  box-shadow: 0 0 28px rgba(0, 240, 255, 0.35);
}
.panel .section { border: 0; background: none; padding: 0; }
.panel-close {
  position: absolute;
  top: 8px;
  right: 8px;
  font: inherit;
  color: var(--text);
  background: transparent;
  border: 1px solid var(--muted);
  border-radius: 6px;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 10: Verificar testes, build e rodar no navegador**

Run: `npx vitest run && npm run build`
Expected: todos os testes passam; build conclui.

Run: `npm run dev` e abra a URL. Confira: menu neon aparece; "Versão rápida (2D)" mostra Sobre/Projetos/Skills/Contato com os dados de exemplo; "Entrar no mundo 3D" volta ao menu; "Start" mostra "Mundo 3D em construção".

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add menu, 2D fallback, error boundary and app shell"
```

---

### Task 11: Cena 3D — Canvas, arena, skyline e efeitos

**Files:**
- Create: `src/world/NeonMaterial.tsx`, `src/world/Arena.tsx`, `src/world/Skyline.tsx`, `src/world/Effects.tsx`
- Modify: `src/game/Game.tsx`

Sem testes automatizados (visual); a verificação é build + olhar no navegador.

- [ ] **Step 1: Criar `src/world/NeonMaterial.tsx`**

```tsx
/** Material emissivo: valores > 1 de luminância é o que o Bloom (threshold 1) realça. */
export function NeonMaterial({ color, intensity = 2.5 }: { color: string; intensity?: number }) {
  return <meshStandardMaterial color="#000000" emissive={color} emissiveIntensity={intensity} toneMapped={false} />
}
```

- [ ] **Step 2: Criar `src/world/Arena.tsx`**

```tsx
import { Grid } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { ARENA_HALF } from '../zones/zoneLayout'
import { NeonMaterial } from './NeonMaterial'

const WALL_H = 4
const WALL_T = 1

const walls: { pos: [number, number, number]; size: [number, number, number] }[] = [
  { pos: [0, WALL_H / 2, -ARENA_HALF], size: [ARENA_HALF + WALL_T, WALL_H / 2, WALL_T / 2] },
  { pos: [0, WALL_H / 2, ARENA_HALF], size: [ARENA_HALF + WALL_T, WALL_H / 2, WALL_T / 2] },
  { pos: [-ARENA_HALF, WALL_H / 2, 0], size: [WALL_T / 2, WALL_H / 2, ARENA_HALF + WALL_T] },
  { pos: [ARENA_HALF, WALL_H / 2, 0], size: [WALL_T / 2, WALL_H / 2, ARENA_HALF + WALL_T] },
]

export function Arena() {
  return (
    <>
      {/* chão */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[200, 0.5, 200]} position={[0, -0.5, 0]} friction={0} />
      </RigidBody>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#07070f" roughness={0.9} />
      </mesh>
      <Grid
        position={[0, 0.02, 0]}
        args={[200, 200]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#1b2b6b"
        sectionSize={10}
        sectionThickness={1.2}
        sectionColor="#00f0ff"
        fadeDistance={110}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* paredes invisíveis + faixa neon baixa */}
      <RigidBody type="fixed" colliders={false}>
        {walls.map((w, i) => (
          <CuboidCollider key={i} args={w.size} position={w.pos} friction={0} />
        ))}
      </RigidBody>
      {walls.map((w, i) => (
        <mesh key={i} position={[w.pos[0], 0.3, w.pos[2]]}>
          <boxGeometry args={[w.size[0] * 2, 0.6, w.size[2] * 2]} />
          <NeonMaterial color="#ff2bd6" intensity={2} />
        </mesh>
      ))}
    </>
  )
}
```

- [ ] **Step 3: Criar `src/world/Skyline.tsx`**

```tsx
import { Instance, Instances } from '@react-three/drei'
import { useMemo } from 'react'
import { Color } from 'three'
import { useGameStore } from '../store/gameStore'
import { QUALITY_SETTINGS } from './quality'
import { generateSkyline } from './skyline'

export function Skyline() {
  const quality = useGameStore((s) => s.quality)
  const count = QUALITY_SETTINGS[quality].buildings
  const buildings = useMemo(() => generateSkyline(count), [count])
  const glow = useMemo(() => buildings.map((b) => new Color(b.neon).multiplyScalar(3)), [buildings])

  return (
    <>
      <Instances limit={200} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color="#0b0b1c" roughness={0.8} />
        {buildings.map((b, i) => (
          <Instance key={i} position={[b.x, b.h / 2, b.z]} scale={[b.w, b.h, b.d]} />
        ))}
      </Instances>
      {/* faixa neon no topo de cada prédio */}
      <Instances limit={200} frustumCulled={false}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
        {buildings.map((b, i) => (
          <Instance key={i} position={[b.x, b.h, b.z]} scale={[b.w + 0.2, 0.5, b.d + 0.2]} color={glow[i]} />
        ))}
      </Instances>
    </>
  )
}
```

- [ ] **Step 4: Criar `src/world/Effects.tsx`**

```tsx
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useGameStore } from '../store/gameStore'
import { QUALITY_SETTINGS } from './quality'

export function Effects() {
  const quality = useGameStore((s) => s.quality)
  if (!QUALITY_SETTINGS[quality].bloom) return null
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={1.1} luminanceThreshold={1} luminanceSmoothing={0.2} mipmapBlur />
    </EffectComposer>
  )
}
```

- [ ] **Step 5: Substituir `src/game/Game.tsx` (cena sem carrinho ainda)**

```tsx
import { Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import { useGameStore } from '../store/gameStore'
import { Arena } from '../world/Arena'
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
        camera={{ position: [0, 6, 10], fov: 60, near: 0.1, far: 400 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05050d']} />
        <fog attach="fog" args={['#05050d', 40, 160]} />
        <ambientLight intensity={0.35} color="#6a5cff" />
        <directionalLight position={[20, 40, 10]} intensity={0.4} color="#8fb4ff" />
        <PerformanceMonitor
          onDecline={() => useGameStore.getState().lowerQuality()}
          onIncline={() => useGameStore.getState().raiseQuality()}
          onFallback={() => useGameStore.getState().setQuality('low')}
        />
        <Suspense fallback={null}>
          <Physics>
            <Arena />
          </Physics>
          <Skyline />
        </Suspense>
        <Effects />
      </Canvas>
      <Loader />
    </>
  )
}
```

- [ ] **Step 6: Verificar**

Run: `npm run build`
Expected: sem erros de tipo.

Run: `npm run dev`, aperte Start. Esperado: cidade noturna com grade neon, prédios ao fundo com topo brilhante, faixa magenta nas bordas, sem erros no console. Se `Instance color` ou `Grid` gerar erro de tipo, ajuste conforme a mensagem do `tsc` (as APIs são do drei ≥ 10).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add 3D arena, skyline and bloom"
```

---

### Task 12: Carrinho, estado compartilhado e câmera

**Files:**
- Create: `src/vehicle/vehicleState.ts`, `src/vehicle/Vehicle.tsx`, `src/vehicle/CameraRig.tsx`
- Modify: `src/game/Game.tsx`

- [ ] **Step 1: Criar `src/vehicle/vehicleState.ts`**

```ts
import { Vector3 } from 'three'
import { spawnPoint } from '../zones/zoneLayout'

/** Estado mutável do carrinho, escrito pelo Vehicle a cada frame e lido por câmera, minimapa e partículas. */
export const vehicleState = {
  position: new Vector3(...spawnPoint),
  /** rotação em Y; 0 = virado para -z */
  heading: 0,
  /** velocidade ao longo do eixo frontal */
  speed: 0,
  /** velocidade lateral (derrapagem) */
  lateral: 0,
}
```

- [ ] **Step 2: Criar `src/vehicle/Vehicle.tsx`**

```tsx
import { Trail } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { Quaternion, Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'
import { NeonMaterial } from '../world/NeonMaterial'
import { QUALITY_SETTINGS } from '../world/quality'
import { spawnPoint } from '../zones/zoneLayout'
import { getControls, inputState } from './input'
import { brakeImpulse, driveForce, lateralImpulse, yawRate } from './physics'
import { vehicleState } from './vehicleState'

const q = new Quaternion()
const fwd = new Vector3()
const right = new Vector3()

export function Vehicle() {
  const body = useRef<RapierRigidBody>(null)
  const lastSafe = useRef(new Vector3(...spawnPoint))
  const lastSafeAt = useRef(0)
  const quality = useGameStore((s) => s.quality)
  const trails = QUALITY_SETTINGS[quality].trails

  useFrame((state, delta) => {
    const b = body.current
    if (!b) return
    const dt = Math.min(delta, 1 / 30)
    const t = b.translation()
    const r = b.rotation()
    const v = b.linvel()

    q.set(r.x, r.y, r.z, r.w)
    fwd.set(0, 0, -1).applyQuaternion(q)
    right.set(1, 0, 0).applyQuaternion(q)
    const speed = v.x * fwd.x + v.z * fwd.z
    const lateral = v.x * right.x + v.z * right.z

    // Reset manual (R) ou queda do mapa
    if (inputState.resetRequested || t.y < -5) {
      inputState.resetRequested = false
      b.setTranslation(lastSafe.current, true)
      b.setLinvel({ x: 0, y: 0, z: 0 }, true)
      b.setAngvel({ x: 0, y: 0, z: 0 }, true)
      b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
      return
    }

    // Ignora o input enquanto um painel está aberto
    const c = useGameStore.getState().panelOpen ? { throttle: 0, steer: 0, brake: true } : getControls()

    let along = driveForce(c.throttle, speed) * dt
    if (c.brake) along += brakeImpulse(speed, dt)
    const side = lateralImpulse(lateral, c.brake, dt)
    b.applyImpulse(
      { x: fwd.x * along + right.x * side, y: 0, z: fwd.z * along + right.z * side },
      true,
    )
    b.setAngvel({ x: 0, y: yawRate(c.steer, speed), z: 0 }, true)

    // Memoriza o último ponto seguro (no chão, a cada 1s)
    if (t.y < 1.2 && state.clock.elapsedTime - lastSafeAt.current > 1) {
      lastSafe.current.set(t.x, 1, t.z)
      lastSafeAt.current = state.clock.elapsedTime
    }

    vehicleState.position.set(t.x, t.y, t.z)
    vehicleState.heading = Math.atan2(-fwd.x, -fwd.z)
    vehicleState.speed = speed
    vehicleState.lateral = lateral
  })

  const rear = (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  )

  return (
    <RigidBody
      ref={body}
      name="vehicle"
      position={spawnPoint}
      colliders={false}
      enabledRotations={[false, true, false]}
      linearDamping={0.3}
      canSleep={false}
    >
      <CuboidCollider args={[0.9, 0.35, 1.5]} position={[0, 0.35, 0]} mass={1} friction={0} />
      {/* carroceria */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.5, 3]} />
        <meshStandardMaterial color="#12122a" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.8, 0.2]}>
        <boxGeometry args={[1.4, 0.4, 1.4]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* faixa neon lateral */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.9, 0.08, 2.6]} />
        <NeonMaterial color="#00f0ff" />
      </mesh>
      {/* faróis */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.5, -1.5]}>
          <boxGeometry args={[0.35, 0.15, 0.1]} />
          <NeonMaterial color="#ffffff" intensity={3} />
        </mesh>
      ))}
      <pointLight position={[0, 0.6, -2.2]} intensity={6} distance={14} color="#9fe8ff" />
      {/* rodas visuais */}
      {[
        [-0.95, 0.3, -1],
        [0.95, 0.3, -1],
        [-0.95, 0.3, 1],
        [0.95, 0.3, 1],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 0.3, 16]} />
          <meshStandardMaterial color="#05050a" />
        </mesh>
      ))}
      {/* rastro de luz atrás do carrinho */}
      {trails && (
        <Trail width={1.4} length={6} color="#00f0ff" attenuation={(w) => w * w}>
          <group position={[0, 0.25, 1.6]}>{rear}</group>
        </Trail>
      )}
    </RigidBody>
  )
}
```

Nota: `Trail` precisa de um `Object3D` filho móvel; o `group` dentro do `RigidBody` acompanha o corpo. Se o rastro não aparecer, troque o filho por `<mesh>` direto com `<boxGeometry args={[0.1,0.1,0.1]}/>` e `<meshBasicMaterial visible={false}/>`.

- [ ] **Step 3: Criar `src/vehicle/CameraRig.tsx`**

```tsx
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'
import { getZone } from '../zones/zoneLayout'
import { followPosition } from './physics'
import { vehicleState } from './vehicleState'

const BASE_FOV = 60
const MAX_FOV_BOOST = 18
const MAX_SPEED = 24

export function CameraRig() {
  const { camera } = useThree()
  const desired = useRef(new Vector3())
  const look = useRef(new Vector3(0, 1, -5))
  const lookTarget = useRef(new Vector3())
  const zoneCenter = useRef(new Vector3())
  const dir = useRef(new Vector3())

  useFrame((_, delta) => {
    const { position, heading, speed } = vehicleState
    const zone = useGameStore.getState().activeZone
    const def = zone ? getZone(zone) : undefined

    if (def) {
      // Enquadra o prédio/terminal mantendo o carrinho visível
      zoneCenter.current.set(def.position[0], 0, def.position[1])
      dir.current.set(position.x - zoneCenter.current.x, 0, position.z - zoneCenter.current.z)
      if (dir.current.lengthSq() < 0.001) dir.current.set(0, 0, 1)
      dir.current.normalize()
      desired.current.copy(zoneCenter.current).addScaledVector(dir.current, 16).setY(8)
      lookTarget.current.set(zoneCenter.current.x, 3, zoneCenter.current.z)
    } else {
      const p = followPosition(position, heading, 9, 5)
      desired.current.set(p.x, p.y, p.z)
      lookTarget.current.set(
        position.x - Math.sin(heading) * 3,
        position.y + 1,
        position.z - Math.cos(heading) * 3,
      )
    }

    const k = 1 - Math.exp(-4 * delta)
    camera.position.lerp(desired.current, k)
    look.current.lerp(lookTarget.current, k)
    camera.lookAt(look.current)

    const cam = camera as PerspectiveCamera
    const targetFov = BASE_FOV + (Math.min(Math.abs(speed), MAX_SPEED) / MAX_SPEED) * MAX_FOV_BOOST
    cam.fov += (targetFov - cam.fov) * k
    cam.updateProjectionMatrix()
  })

  return null
}
```

- [ ] **Step 4: Ligar em `src/game/Game.tsx`**

Adicionar os imports:
```tsx
import { CameraRig } from '../vehicle/CameraRig'
import { useKeyboardInput } from '../vehicle/useKeyboardInput'
import { Vehicle } from '../vehicle/Vehicle'
import { useInteractKeys } from '../ui/useInteractKeys'
```
Dentro de `Game()`, antes do `return`, chamar `useKeyboardInput()` e `useInteractKeys()`. Dentro de `<Physics>`, depois de `<Arena />`, adicionar `<Vehicle />`. Depois do `</Suspense>`, adicionar `<CameraRig />`.

- [ ] **Step 5: Verificar**

Run: `npm run build` → sem erros.

Run: `npm run dev`, Start. Teste manual: W acelera, A/D esterçam só em movimento, S dá ré, Espaço freia e derrapa, a câmera segue e abre o FOV com velocidade, o carrinho bate na parede neon e não atravessa, `R` volta ao último ponto. Se a direção estiver invertida (A vira à direita), inverta o sinal em `yawRate`/`steer` e ajuste o teste de `physics.test.ts` junto. Ajuste os números de `DRIVE` em `src/vehicle/physics.ts` até o "feeling" ficar bom.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add drivable vehicle with follow camera"
```

---

### Task 13: Zonas 3D (sensores, prédios, quiosque, skills, portal)

**Files:**
- Create: `src/zones/ZoneBase.tsx`, `AboutKiosk.tsx`, `ProjectBuilding.tsx`, `SkillsWall.tsx`, `ContactPortal.tsx`, `Zones.tsx`
- Modify: `src/game/Game.tsx`

- [ ] **Step 1: Criar `src/zones/ZoneBase.tsx`** (anel no chão, sensor e rótulo, compartilhados por todas as zonas)

```tsx
import { Html } from '@react-three/drei'
import { CuboidCollider, type IntersectionEnterPayload, type IntersectionExitPayload } from '@react-three/rapier'
import { useGameStore } from '../store/gameStore'
import type { ZoneDef } from './zoneLayout'

export const ZONE_RADIUS = 7

const isVehicle = (e: IntersectionEnterPayload | IntersectionExitPayload) =>
  e.other.rigidBodyObject?.name === 'vehicle'

export function ZoneBase({ zone, labelHeight = 6 }: { zone: ZoneDef; labelHeight?: number }) {
  const enterZone = useGameStore((s) => s.enterZone)
  const leaveZone = useGameStore((s) => s.leaveZone)
  const visited = useGameStore((s) => s.visited.includes(zone.id))
  const [x, z] = zone.position

  return (
    <>
      <CuboidCollider
        sensor
        args={[ZONE_RADIUS, 4, ZONE_RADIUS]}
        position={[x, 4, z]}
        onIntersectionEnter={(e) => isVehicle(e) && enterZone(zone.id)}
        onIntersectionExit={(e) => isVehicle(e) && leaveZone(zone.id)}
      />
      <mesh rotation-x={-Math.PI / 2} position={[x, 0.05, z]}>
        <ringGeometry args={[ZONE_RADIUS - 0.6, ZONE_RADIUS, 48]} />
        <meshBasicMaterial color={zone.color} transparent opacity={visited ? 0.3 : 1} toneMapped={false} />
      </mesh>
      <Html position={[x, labelHeight, z]} center distanceFactor={18} zIndexRange={[5, 0]}>
        <div className={`zone-label${visited ? ' visited' : ''}`} style={{ color: zone.color, borderColor: zone.color }}>
          {zone.label}
        </div>
      </Html>
    </>
  )
}
```

- [ ] **Step 2: Criar `src/zones/AboutKiosk.tsx`**

```tsx
import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { NeonMaterial } from '../world/NeonMaterial'
import type { ZoneDef } from './zoneLayout'

export function AboutKiosk({ zone }: { zone: ZoneDef }) {
  const [x, z] = zone.position
  const ring = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 1.2
  })

  return (
    <group position={[x, 0, z]}>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[1, 1.2]} position={[0, 1, 0]} />
      </RigidBody>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 2, 24]} />
        <meshStandardMaterial color="#0b0b1c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.05, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.6, 1.2, 32]} />
        <NeonMaterial color={zone.color} />
      </mesh>
      {/* holograma giratório */}
      <mesh ref={ring} position={[0, 3.6, 0]}>
        <torusKnotGeometry args={[0.8, 0.22, 96, 12]} />
        <NeonMaterial color={zone.color} intensity={3} />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 3: Criar `src/zones/ProjectBuilding.tsx`**

```tsx
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { NeonMaterial } from '../world/NeonMaterial'
import type { ZoneDef } from './zoneLayout'

const HEIGHT = 8

export function ProjectBuilding({ zone }: { zone: ZoneDef }) {
  const [x, z] = zone.position
  return (
    <group position={[x, 0, z]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[2.5, HEIGHT / 2, 2.5]} position={[0, HEIGHT / 2, 0]} />
      </RigidBody>
      <mesh position={[0, HEIGHT / 2, 0]}>
        <boxGeometry args={[5, HEIGHT, 5]} />
        <meshStandardMaterial color="#0b0b1c" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* arestas neon */}
      {[
        [-2.5, -2.5],
        [2.5, -2.5],
        [-2.5, 2.5],
        [2.5, 2.5],
      ].map(([cx, cz], i) => (
        <mesh key={i} position={[cx, HEIGHT / 2, cz]}>
          <boxGeometry args={[0.15, HEIGHT, 0.15]} />
          <NeonMaterial color={zone.color} />
        </mesh>
      ))}
      <mesh position={[0, HEIGHT + 0.15, 0]}>
        <boxGeometry args={[5.3, 0.3, 5.3]} />
        <NeonMaterial color={zone.color} intensity={3} />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 4: Criar `src/zones/SkillsWall.tsx`** (cubos empurráveis, um por skill)

```tsx
import { Html } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { skillGroups } from '../content'
import { NeonMaterial } from '../world/NeonMaterial'
import type { ZoneDef } from './zoneLayout'

const COLORS = ['#39ff88', '#00f0ff', '#ff2bd6', '#9d4dff']
const COLS = 3
const GAP = 1.8

export function SkillsWall({ zone }: { zone: ZoneDef }) {
  const [x, z] = zone.position
  const skills = skillGroups.flatMap((g, gi) => g.skills.map((s) => ({ ...s, color: COLORS[gi % COLORS.length] })))

  return (
    <group>
      {skills.map((s, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const px = x + (col - (COLS - 1) / 2) * GAP
        const pz = z - 3 + row * GAP
        return (
          <RigidBody key={s.name} name="skill" position={[px, 0.7, pz]} colliders="cuboid" linearDamping={0.8} angularDamping={0.8}>
            <mesh>
              <boxGeometry args={[1.3, 1.3, 1.3]} />
              <NeonMaterial color={s.color} intensity={1.6} />
            </mesh>
            <Html center distanceFactor={9} position={[0, 0, 0.7]} zIndexRange={[4, 0]}>
              <span className="skill-icon" title={s.name}>
                {s.icon}
              </span>
            </Html>
          </RigidBody>
        )
      })}
    </group>
  )
}
```

- [ ] **Step 5: Criar `src/zones/ContactPortal.tsx`**

```tsx
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { NeonMaterial } from '../world/NeonMaterial'
import type { ZoneDef } from './zoneLayout'

export function ContactPortal({ zone }: { zone: ZoneDef }) {
  const [x, z] = zone.position
  const inner = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (inner.current) inner.current.rotation.z += dt
  })

  return (
    <group position={[x, 0, z]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.4, 2.5, 0.4]} position={[-3, 2.5, 0]} />
        <CuboidCollider args={[0.4, 2.5, 0.4]} position={[3, 2.5, 0]} />
      </RigidBody>
      {[-3, 3].map((px) => (
        <mesh key={px} position={[px, 2.5, 0]}>
          <boxGeometry args={[0.8, 5, 0.8]} />
          <meshStandardMaterial color="#0b0b1c" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[6.8, 0.4, 0.8]} />
        <NeonMaterial color={zone.color} />
      </mesh>
      <mesh ref={inner} position={[0, 2.6, 0]}>
        <torusGeometry args={[1.8, 0.12, 12, 48]} />
        <NeonMaterial color={zone.color} intensity={3} />
      </mesh>
    </group>
  )
}
```

- [ ] **Step 6: Criar `src/zones/Zones.tsx`**

```tsx
import { AboutKiosk } from './AboutKiosk'
import { ContactPortal } from './ContactPortal'
import { ProjectBuilding } from './ProjectBuilding'
import { SkillsWall } from './SkillsWall'
import { ZoneBase } from './ZoneBase'
import { zones, type ZoneDef } from './zoneLayout'

function ZoneVisual({ zone }: { zone: ZoneDef }) {
  switch (zone.kind) {
    case 'about':
      return <AboutKiosk zone={zone} />
    case 'project':
      return <ProjectBuilding zone={zone} />
    case 'skills':
      return <SkillsWall zone={zone} />
    case 'contact':
      return <ContactPortal zone={zone} />
  }
}

export function Zones() {
  return (
    <>
      {zones.map((zone) => (
        <group key={zone.id}>
          <ZoneBase zone={zone} labelHeight={zone.kind === 'project' ? 11 : 7} />
          <ZoneVisual zone={zone} />
        </group>
      ))}
    </>
  )
}
```

- [ ] **Step 7: Estilos dos rótulos — acrescentar ao final de `src/styles.css`**

```css
.zone-label {
  padding: 4px 10px;
  border: 1px solid;
  border-radius: 4px;
  background: rgba(5, 5, 13, 0.7);
  font-size: 14px;
  white-space: nowrap;
  text-shadow: 0 0 8px currentColor;
  pointer-events: none;
}
.zone-label.visited { opacity: 0.55; }
.skill-icon { font-size: 18px; pointer-events: none; user-select: none; }
```

- [ ] **Step 8: Ligar em `src/game/Game.tsx`**

Importar `import { Zones } from '../zones/Zones'` e adicionar `<Zones />` dentro de `<Physics>`, depois de `<Arena />` e antes de `<Vehicle />`.

- [ ] **Step 9: Verificar**

Run: `npm run build` → sem erros.

Run: `npm run dev`, Start. Teste manual: quiosque holográfico à frente (−z); prédios de projeto ao fundo (+z); muro de cubos à esquerda; portal à direita. O carrinho colide com prédios, quiosque e portal; empurra os cubos de skill sem disparar a zona de skills a cada cubo (só o carrinho dispara). Ao entrar numa zona a câmera enquadra o local; ao sair, volta a seguir.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add 3D zones with sensors and visuals"
```

---

### Task 14: HUD (prompt de interação, minimapa, seta guia, joystick)

**Files:**
- Create: `src/ui/useRaf.ts`, `src/ui/Minimap.tsx`, `src/ui/GuideArrow.tsx`, `src/ui/JoystickPad.tsx`, `src/ui/Hud.tsx`, `src/ui/hud.css`
- Modify: `src/game/Game.tsx`

- [ ] **Step 1: Criar `src/ui/useRaf.ts`**

```ts
import { useEffect, useRef } from 'react'

/** Executa `cb` a cada frame do navegador sem causar re-render do React. */
export function useRaf(cb: () => void) {
  const saved = useRef(cb)
  saved.current = cb
  useEffect(() => {
    let id = requestAnimationFrame(function tick() {
      saved.current()
      id = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [])
}
```

- [ ] **Step 2: Criar `src/ui/Minimap.tsx`**

```tsx
import { useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { vehicleState } from '../vehicle/vehicleState'
import { ARENA_HALF, zones } from '../zones/zoneLayout'
import { useRaf } from './useRaf'

export function Minimap() {
  const car = useRef<SVGPolygonElement>(null)
  const visited = useGameStore((s) => s.visited)

  useRaf(() => {
    const { position, heading } = vehicleState
    car.current?.setAttribute(
      'transform',
      `translate(${position.x} ${position.z}) rotate(${(-heading * 180) / Math.PI})`,
    )
  })

  const half = ARENA_HALF + 2
  return (
    <svg className="minimap" viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`} role="img" aria-label="Minimapa">
      <rect x={-ARENA_HALF} y={-ARENA_HALF} width={ARENA_HALF * 2} height={ARENA_HALF * 2} className="minimap-arena" />
      {zones.map((z) => (
        <circle
          key={z.id}
          cx={z.position[0]}
          cy={z.position[1]}
          r={3.5}
          fill={z.color}
          opacity={visited.includes(z.id) ? 0.35 : 1}
        />
      ))}
      <polygon ref={car} points="0,-4 3,3 -3,3" className="minimap-car" />
    </svg>
  )
}
```

- [ ] **Step 3: Criar `src/ui/GuideArrow.tsx`**

```tsx
import { useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { vehicleState } from '../vehicle/vehicleState'
import { zones } from '../zones/zoneLayout'
import { bearingTo, nearestUnvisited } from './guide'
import { useRaf } from './useRaf'

export function GuideArrow() {
  const arrow = useRef<HTMLSpanElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useRaf(() => {
    const { position, heading } = vehicleState
    const from = { x: position.x, z: position.z }
    const target = nearestUnvisited(from, zones, useGameStore.getState().visited)
    if (!target || !arrow.current || !label.current) {
      if (label.current) label.current.textContent = 'Tudo explorado!'
      if (arrow.current) arrow.current.style.visibility = 'hidden'
      return
    }
    const angle = bearingTo(from, heading, target.position)
    const dist = Math.round(Math.hypot(target.position[0] - from.x, target.position[1] - from.z))
    arrow.current.style.visibility = 'visible'
    arrow.current.style.transform = `rotate(${angle}rad)`
    label.current.textContent = `${target.label} · ${dist}m`
  })

  return (
    <div className="guide" aria-hidden="true">
      <span ref={arrow} className="guide-arrow">
        ▲
      </span>
      <span ref={label} />
    </div>
  )
}
```

- [ ] **Step 4: Criar `src/ui/JoystickPad.tsx`**

```tsx
import { useRef, useState } from 'react'
import { inputState, joystickVector } from '../vehicle/input'

const RADIUS = 50

export function JoystickPad() {
  const [isTouch] = useState(
    () => typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches,
  )
  const base = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)
  const active = useRef(false)

  if (!isTouch) return null

  const move = (clientX: number, clientY: number) => {
    const rect = base.current!.getBoundingClientRect()
    const dx = clientX - (rect.left + rect.width / 2)
    const dy = clientY - (rect.top + rect.height / 2)
    const v = joystickVector(dx, dy, RADIUS)
    inputState.joystick = v
    if (knob.current) knob.current.style.transform = `translate(${v.x * RADIUS}px, ${v.y * RADIUS}px)`
  }
  const release = () => {
    active.current = false
    inputState.joystick = { x: 0, y: 0 }
    if (knob.current) knob.current.style.transform = 'translate(0,0)'
  }

  return (
    <div
      ref={base}
      className="joystick"
      onPointerDown={(e) => {
        active.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => active.current && move(e.clientX, e.clientY)}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div ref={knob} className="joystick-knob" />
    </div>
  )
}
```

- [ ] **Step 5: Criar `src/ui/Hud.tsx`**

```tsx
import { useGameStore } from '../store/gameStore'
import { getZone } from '../zones/zoneLayout'
import { GuideArrow } from './GuideArrow'
import './hud.css'
import { JoystickPad } from './JoystickPad'
import { Minimap } from './Minimap'

export function Hud() {
  const activeZone = useGameStore((s) => s.activeZone)
  const panelOpen = useGameStore((s) => s.panelOpen)
  const openPanel = useGameStore((s) => s.openPanel)
  const setMode = useGameStore((s) => s.setMode)
  const zone = activeZone ? getZone(activeZone) : undefined

  return (
    <div className="hud">
      <div className="hud-top">
        <Minimap />
        <GuideArrow />
        <button className="btn hud-quick" onClick={() => setMode('2d')}>
          Versão rápida
        </button>
      </div>

      {zone && !panelOpen && (
        <button className="btn btn-primary hud-prompt" onClick={openPanel}>
          {zone.label} — pressione E ou toque para abrir
        </button>
      )}

      <p className="hud-hint">WASD / setas · Espaço freia · R reinicia</p>
      <JoystickPad />
    </div>
  )
}
```

- [ ] **Step 6: Criar `src/ui/hud.css`**

```css
.hud {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
}
.hud > *, .hud-top > * { pointer-events: auto; }
.hud-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  pointer-events: none;
}
.minimap {
  width: 120px;
  height: 120px;
  background: rgba(5, 5, 13, 0.7);
  border: 1px solid var(--cyan);
  border-radius: 6px;
}
.minimap-arena { fill: none; stroke: #1b2b6b; stroke-width: 1; }
.minimap-car { fill: #fff; }
.guide {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(5, 5, 13, 0.7);
  border: 1px solid var(--magenta);
  border-radius: 6px;
  font-size: 0.85rem;
  pointer-events: none;
}
.guide-arrow { display: inline-block; color: var(--magenta); text-shadow: 0 0 8px var(--magenta); }
.hud-quick { margin-left: auto; padding: 0.4rem 0.8rem; }
.hud-prompt {
  position: absolute;
  left: 50%;
  bottom: 96px;
  transform: translateX(-50%);
  background: rgba(5, 5, 13, 0.85);
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse { 50% { box-shadow: 0 0 22px var(--magenta); } }
.hud-hint {
  position: absolute;
  left: 16px;
  bottom: 16px;
  margin: 0;
  font-size: 0.75rem;
  color: var(--muted);
}
.joystick {
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid var(--cyan);
  background: rgba(0, 240, 255, 0.08);
  touch-action: none;
  display: grid;
  place-items: center;
}
.joystick-knob {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 240, 255, 0.5);
  box-shadow: 0 0 14px var(--cyan);
}
@media (pointer: coarse) { .hud-hint { display: none; } }
```

- [ ] **Step 7: Ligar em `src/game/Game.tsx`**

Importar `Hud` e `ZonePanel` (`import { Hud } from '../ui/Hud'` e `import { ZonePanel } from '../ui/ZonePanel'`) e, no fragmento, depois do `</Canvas>` e antes de `<Loader />`, adicionar `<Hud />` e `<ZonePanel />`.

- [ ] **Step 8: Verificar**

Run: `npx vitest run && npm run build` → tudo passa.

Run: `npm run dev`, Start. Teste manual: minimapa mostra zonas coloridas e o carrinho girando; a seta guia aponta para a zona não visitada mais próxima e mostra a distância; ao entrar numa zona aparece o botão "pressione E ou toque"; `E` abre o painel, `Esc` e o X fecham; o carrinho para enquanto o painel está aberto; a zona visitada fica mais fraca no minimapa e no chão; ao visitar todas, a guia diz "Tudo explorado!". No DevTools em modo celular (pointer: coarse), o joystick aparece e dirige.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add HUD with minimap, guide arrow and touch joystick"
```

---

### Task 15: Partículas de derrapagem e verificação final

**Files:**
- Create: `src/vehicle/DriftSparks.tsx`
- Modify: `src/game/Game.tsx`

- [ ] **Step 1: Criar `src/vehicle/DriftSparks.tsx`**

```tsx
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { InstancedMesh, Object3D, Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'
import { NeonMaterial } from '../world/NeonMaterial'
import { QUALITY_SETTINGS } from '../world/quality'
import { vehicleState } from './vehicleState'

const COUNT = 40
const LIFE = 0.6

interface Spark {
  life: number
  pos: Vector3
  vel: Vector3
}

export function DriftSparks() {
  const enabled = QUALITY_SETTINGS[useGameStore((s) => s.quality)].sparks
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const sparks = useRef<Spark[]>(
    Array.from({ length: COUNT }, () => ({ life: 0, pos: new Vector3(), vel: new Vector3() })),
  )
  const cursor = useRef(0)

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return
    const { position, heading, lateral } = vehicleState

    if (Math.abs(lateral) > 3) {
      for (let n = 0; n < 2; n++) {
        const s = sparks.current[cursor.current++ % COUNT]
        s.life = LIFE
        s.pos.set(
          position.x + Math.sin(heading) * 1.4 + (Math.random() - 0.5),
          0.15,
          position.z + Math.cos(heading) * 1.4 + (Math.random() - 0.5),
        )
        s.vel.set((Math.random() - 0.5) * 3, 2 + Math.random() * 2, (Math.random() - 0.5) * 3)
      }
    }

    sparks.current.forEach((s, i) => {
      if (s.life > 0) {
        s.life -= delta
        s.pos.addScaledVector(s.vel, delta)
        s.vel.y -= 9 * delta
      }
      dummy.position.copy(s.pos)
      dummy.scale.setScalar(Math.max(s.life, 0) * 0.35)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })

  if (!enabled) return null
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry />
      <NeonMaterial color="#ffb000" intensity={3} />
    </instancedMesh>
  )
}
```

- [ ] **Step 2: Ligar em `src/game/Game.tsx`**

Importar `import { DriftSparks } from '../vehicle/DriftSparks'` e adicionar `<DriftSparks />` logo depois de `</Physics>` (dentro do `Suspense`, antes de `<Skyline />`).

- [ ] **Step 3: Rodar a suíte completa e o build**

Run: `npx vitest run`
Expected: todos os testes passam, 0 falhas.

Run: `npm run build`
Expected: `tsc` sem erros; `vite build` conclui. Confirme que o chunk do jogo é separado do inicial (a saída lista um arquivo `Game-*.js` à parte do `index-*.js`).

- [ ] **Step 4: Checklist manual no navegador**

Run: `npm run dev` e confira, anotando qualquer falha:
1. Menu → Start carrega o 3D com barra de loading; sem erros no console.
2. Dirigir: aceleração, direção só em movimento, ré, freio de mão com derrapagem e faíscas, colisões com paredes/prédios.
3. Empurrar cubos de skill funciona e não abre a zona de Skills por causa deles.
4. Cada uma das 7 zonas (Sobre, 4 projetos, Skills, Contato) abre o painel certo com `E`, fecha com `Esc`.
5. `R` reinicia; cair do mapa não é possível, mas o reset manual funciona.
6. "Versão rápida" no HUD e no menu leva ao 2D com todos os dados; "Entrar no mundo 3D" volta ao menu.
7. DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", recarregue: abre direto o 2D com o aviso.
8. DevTools → modo celular: joystick aparece e dirige; painel abre ao tocar no botão de prompt.
9. Para forçar qualidade baixa, edite temporariamente `quality: 'high'` para `'low'` em `initialGameState` (`src/store/gameStore.ts`) e confirme: sem bloom, sem rastro, sem faíscas, menos prédios. Reverta depois.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add drift sparks and finish v1"
```

---

## Self-Review

**Cobertura do spec:**
- Mundo 3D, carrinho com física (impulso, torque Y, amortecimento lateral, freio de mão): Tasks 8 e 12.
- Entrada unificada teclado/joystick com `{ throttle, steer, brake }`: Task 7 (`getControls`) e Task 14 (joystick).
- Reset ao último ponto seguro (R e queda): Task 12. Desvio documentado: carrinho não vira.
- Faróis, rastro, partículas de derrapagem: Tasks 12 e 15.
- Câmera com lerp, FOV por velocidade e enquadramento de zona: Task 12.
- Zonas com sensor, prompt, painel HTML acessível (foco, Esc): Tasks 9, 13 e 14.
- Quiosque, prédios por projeto, muro de skills empurráveis, portal: Task 13.
- Minimapa e seta guia para zonas não visitadas: Tasks 8 (matemática testada) e 14.
- Conteúdo de exemplo e `content/` como fonte única: Task 2, reutilizado pelo 2D via `sections.tsx` (Tasks 9 e 10).
- Versão 2D com aviso, botão e carregamento automático (sem WebGL / movimento reduzido): Tasks 5 e 10.
- ErrorBoundary, loading e lazy loading do código 3D: Tasks 10 e 11. Falha do WASM do Rapier propaga para o boundary e leva ao 2D, com botão para voltar ao 3D.
- Qualidade em 3 níveis com PerformanceMonitor e DPR limitado; Instances para prédios; sem modelos externos: Tasks 4 e 11.
- Testes (Vitest para lógica, RTL para painéis e 2D) e validação manual do feeling: todas as tasks.

**Placeholders:** nenhum "TBD/TODO". Os textos "Seu Nome", "Projeto Exemplo N" são o conteúdo de exemplo pedido, não lacunas do plano. A Task 15 passo 4 item 9 foi escrito de modo que o teste de qualidade baixa seja feito editando `initialGameState.quality` e revertendo.

**Consistência de tipos/nomes:** `ZoneDef` (`id, kind, label, position:[x,z], color, projectId?`), `getZone`, `zones`, `spawnPoint [x,y,z]`, `ARENA_HALF`, `Controls`, `getControls`, `inputState`, `vehicleState {position, heading, speed, lateral}`, `QUALITY_SETTINGS` com `dpr/bloom/buildings/trails/sparks`, ações do store (`enterZone`, `leaveZone`, `openPanel`, `closePanel`, `setMode`, `setQuality`, `lowerQuality`, `raiseQuality`) são usados com os mesmos nomes em todas as tasks. Convenção de sinais: `steer > 0` é esquerda e `heading` é a rotação em Y com 0 olhando para −z, em `physics.ts`, `guide.ts`, `Vehicle.tsx`, `CameraRig.tsx`, `DriftSparks.tsx` e `Minimap.tsx`.

**Riscos conhecidos a validar na execução:** a API exata de `Instance color` e do `Trail` no drei, e o tipo de `rigidBodyObject` nos payloads do Rapier, dependem das versões instaladas; o `tsc` na Task 11/12/13 acusa qualquer divergência e as notas das tasks dizem como ajustar.
