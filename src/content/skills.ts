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
