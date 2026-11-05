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
