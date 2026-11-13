export type ThemeId = 'rdr' | 'gta' | 'clean'

/** Modos de jogo: só eles servem para o Launcher e a versão rápida. */
export const GAME_THEMES: ThemeId[] = ['rdr', 'gta']

export interface ThemeCopy {
  /** Nome curto do modo, no botão */
  mode: string
  /** Texto grande da transição */
  wipe: string
  badge: string
  scrollCue: string
  announce: string
  announceCta: string
  nav: { overview: string; projects: string; services: string; process: string; featured: string; gallery: string; stack: string; faq: string }
  servicesTitle: string
  servicesText: string
  featuredTitle: string
  faqTitle: string
  faqText: string
  descTitle: string
  projectsTitle: string
  galleryTitle: string
  galleryText: string
  processTitle: string
  processText: string
  stackTitle: string
  stackText: string
  wheelAria: string
  wheelUnit: string
  contactTitle: string
  contactText: string
  posterTag: string
  level: string
  selectTitle: string
  stats: [string, string, string]
}

export interface Theme {
  id: ThemeId
  copy: ThemeCopy
}

export const THEMES: Record<ThemeId, Theme> = {
  rdr: {
    id: 'rdr',
    copy: {
      mode: 'Red Dead',
      wipe: 'Red Dead',
      badge: 'Portfólio',
      scrollCue: 'Role para cavalgar',
      announce: 'Role a página, escolha um projeto e veja o tour guiado.',
      announceCta: 'Jogar',
      nav: { overview: 'Visão geral', projects: 'Projetos', services: 'Serviços', process: 'Missões', featured: 'Destaque', gallery: 'Galeria', stack: 'Stack', faq: 'Perguntas' },
      servicesTitle: 'O que eu faço',
      servicesText: 'Do rascunho ao uso diário: estas são as frentes em que eu atuo.',
      featuredTitle: 'Em destaque',
      faqTitle: 'Perguntas rápidas',
      faqText: 'O que costumam me perguntar antes de começar.',
      descTitle: 'Descrição',
      projectsTitle: 'Últimos projetos',
      galleryTitle: 'Capturas de tela',
      galleryText: 'Um passeio pelas telas reais dos projetos.',
      processTitle: 'Missões',
      processText: 'Como cada projeto avança, do primeiro papo ao lançamento.',
      stackTitle: 'Equipamento',
      stackText: 'Abra uma gaveta da roda para ver as ferramentas que levo em cada travessia.',
      wheelAria: 'Gavetas do equipamento',
      wheelUnit: 'itens',
      contactTitle: 'Continue a aventura',
      contactText: 'Vamos conversar sobre o seu próximo projeto?',
      posterTag: 'Desenvolvedor Full Stack',
      level: 'Capítulo',
      selectTitle: 'Selecione o capítulo',
      stats: ['Capítulos', 'Telas', 'Ferramentas'],
    },
  },
  clean: {
    id: 'clean',
    copy: {
      mode: 'Clean',
      wipe: 'Clean',
      badge: 'Portfólio',
      scrollCue: 'Role para cavalgar',
      announce: 'Role a página, escolha um projeto e veja o tour guiado.',
      announceCta: 'Jogar',
      nav: { overview: 'Visão geral', projects: 'Projetos', services: 'Serviços', process: 'Missões', featured: 'Destaque', gallery: 'Galeria', stack: 'Stack', faq: 'Perguntas' },
      servicesTitle: 'O que eu faço',
      servicesText: 'Do rascunho ao uso diário: estas são as frentes em que eu atuo.',
      featuredTitle: 'Em destaque',
      faqTitle: 'Perguntas rápidas',
      faqText: 'O que costumam me perguntar antes de começar.',
      descTitle: 'Descrição',
      projectsTitle: 'Últimos projetos',
      galleryTitle: 'Capturas de tela',
      galleryText: 'Um passeio pelas telas reais dos projetos.',
      processTitle: 'Missões',
      processText: 'Como cada projeto avança, do primeiro papo ao lançamento.',
      stackTitle: 'Equipamento',
      stackText: 'Abra uma gaveta da roda para ver as ferramentas que levo em cada travessia.',
      wheelAria: 'Gavetas do equipamento',
      wheelUnit: 'itens',
      contactTitle: 'Continue a aventura',
      contactText: 'Vamos conversar sobre o seu próximo projeto?',
      posterTag: 'Desenvolvedor Full Stack',
      level: 'Capítulo',
      selectTitle: 'Selecione o capítulo',
      stats: ['Capítulos', 'Telas', 'Ferramentas'],
    },
  },
  gta: {
    id: 'gta',
    copy: {
      mode: 'GTA 6',
      wipe: 'GTA VI',
      badge: 'Portfólio',
      scrollCue: 'Role para acelerar',
      announce: 'Role a página, escolha um projeto e veja o tour guiado.',
      announceCta: 'Jogar',
      nav: { overview: 'Visão geral', projects: 'Projetos', services: 'Especialidades', process: 'Plano', featured: 'Destaque', gallery: 'Galeria', stack: 'Arsenal', faq: 'Perguntas' },
      servicesTitle: 'Especialidades',
      servicesText: 'As missões que eu mais gosto de aceitar.',
      featuredTitle: 'Missão em destaque',
      faqTitle: 'Antes de aceitar a missão',
      faqText: 'O que costumam me perguntar antes de começar.',
      descTitle: 'Descrição',
      projectsTitle: 'Últimos projetos',
      galleryTitle: 'Capturas de tela',
      galleryText: 'Um passeio pelas telas reais dos projetos.',
      processTitle: 'Plano do golpe',
      processText: 'Como cada projeto avança, do primeiro papo ao lançamento.',
      stackTitle: 'Arsenal',
      stackText: 'Gire a roda de armas e veja o equipamento que levo em cada missão.',
      wheelAria: 'Gavetas do arsenal',
      wheelUnit: 'itens',
      contactTitle: 'Pronto para a próxima missão?',
      contactText: 'Vamos conversar sobre o seu próximo projeto?',
      posterTag: 'Desenvolvedor Full Stack',
      level: 'Missão',
      selectTitle: 'Selecione a missão',
      stats: ['Missões', 'Telas', 'Ferramentas'],
    },
  },
}

export const THEME_IDS = Object.keys(THEMES) as ThemeId[]

/** Para onde o botão de alternar leva quando não se escolhe um modo específico. */
export function otherTheme(id: ThemeId): ThemeId {
  return id === 'rdr' ? 'gta' : 'rdr'
}
