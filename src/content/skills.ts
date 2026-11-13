import type { SkillGroup } from './types'

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Front-end',
    skills: [
      { name: 'Next.js', icon: 'triangle' },
      { name: 'React', icon: 'atom' },
      { name: 'TypeScript', icon: 'braces' },
      { name: 'Flutter', icon: 'phone' },
    ],
  },
  {
    id: 'backend',
    label: 'Back-end',
    skills: [
      { name: 'Python', icon: 'terminal' },
      { name: 'Django', icon: 'server' },
      { name: 'DRF', icon: 'plug' },
      { name: 'PostgreSQL', icon: 'database' },
      { name: 'Celery', icon: 'list' },
      { name: 'Redis', icon: 'bolt' },
    ],
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    skills: [
      { name: 'Docker', icon: 'box' },
      { name: 'Git', icon: 'branch' },
      { name: 'Firebase Auth', icon: 'flame' },
      { name: 'LiveKit', icon: 'video' },
    ],
  },
]
