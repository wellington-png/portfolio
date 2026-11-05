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
