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
