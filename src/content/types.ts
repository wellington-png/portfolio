export interface Profile {
  name: string
  title: string
  /** Frase curta que apresenta você no topo do site */
  pitch: string
  bio: string
  /** Caminho em /public. Troque pela sua foto (ex.: /eu.jpg). */
  photo: string
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
  /** Nome de um ícone de ui/Icon */
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
