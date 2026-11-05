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
