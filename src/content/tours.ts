import { imageKind } from './images'
import type { Project, ProjectImage } from './types'

/** Região de uma tela a destacar no tour: posição e tamanho em % da imagem. */
export interface Focus {
  x: number
  y: number
  w: number
  h: number
  title: string
  text: string
}

export interface TourStep {
  image: ProjectImage
  focuses: Focus[]
}

const f = (x: number, y: number, w: number, h: number, title: string, text: string): Focus => ({ x, y, w, h, title, text })

/** O que mostrar em cada tela (chave: nome do arquivo sem extensão). Feito olhando as capturas reais. */
export const focuses: Record<string, Focus[]> = {
  'barbuz-agenda': [
    f(18.6, 25.5, 79, 7.5, 'Resumo do dia', 'Total, confirmados, em andamento, concluídos e a receita prevista, num só olhar.'),
    f(18.6, 35, 71, 8.5, 'Busca e filtros', 'Procure por cliente, telefone, e-mail ou barbeiro e exporte para CSV.'),
    f(18.6, 52.7, 19, 40, 'Calendário do mês', 'Os dias com agendamento ficam marcados; um clique leva ao dia.'),
    f(38.6, 52.7, 59, 47, 'Agenda da semana', 'Cada barbeiro com seus horários, em cores por situação.'),
  ],
  'barbuz-inicio': [
    f(18.6, 13, 79, 28, 'Resumo do dia', 'Quem está agendado, quanto foi faturado e quantos estão na cadeira.'),
    f(18.6, 43.5, 79, 29, 'Para olhar agora', 'Alertas que pedem ação: produtos parados, liquidações pendentes e assinaturas a vencer.'),
    f(18.6, 76.8, 79, 23, 'Números do mês', 'Faturamento, agenda e clientes ativos, sem abrir relatório.'),
  ],
  'barber-agenda-cliente': [
    f(27, 11, 45, 14, 'Agenda do cliente', 'O cliente vê os próprios cortes, com próximos e histórico.'),
    f(27, 28.5, 45, 9.5, 'Horário confirmado', 'Dia, hora, profissional e unidade, com a situação ao lado.'),
    f(65.5, 13.5, 8, 6, 'Agendar em um toque', 'O cliente marca um novo horário sozinho, a qualquer hora.'),
  ],
  'occlo-agenda': [
    f(14.8, 10.8, 85, 22, 'Filtros e visões', 'Dia ou semana, por dentista ou cadeira, com filtro de status.'),
    f(18.3, 24.3, 80, 7.5, 'Uma coluna por dentista', 'Cada profissional com sua agenda lado a lado.'),
    f(18.3, 41, 80, 30, 'Status em cores', 'Concluída, em atendimento, confirmada, pendente ou faltou: dá para ver de longe.'),
    f(27, 17.3, 9.5, 5.8, 'Nova consulta', 'Marcar uma consulta leva poucos cliques.'),
  ],
  'occlo-prontuario': [
    f(16.7, 2.7, 66.5, 18, 'Ficha do paciente', 'Contato, anamnese, saldo em aberto e atalhos para consulta e orçamento.'),
    f(16.7, 23.8, 66.5, 6, 'Abas do prontuário', 'Cadastro, anamnese, odontograma, periograma, evolução e orçamentos.'),
    f(18, 32, 43, 38, 'Odontograma interativo', 'Cada dente com seu estado: existente, a tratar, a fazer e realizado.'),
    f(16.7, 75.6, 45, 14, 'Legenda e atalhos', 'Cores e siglas para registrar cárie, canal, coroa e implante rapidamente.'),
  ],
  'occlo-financeiro': [
    f(0, 4.3, 100, 26, 'Caixa em quatro números', 'Saldo atual, entradas, saídas e o saldo previsto para 30 dias.'),
    f(0, 33.5, 100, 63, 'Saldo dia a dia', 'Linha cheia é o que aconteceu; tracejada é a previsão do que vem.'),
  ],
  'occlo-whatsapp': [
    f(15.5, 3, 19.5, 95, 'Conversas', 'Lista com quem a IA atende, quem precisa de humano e quem está pausado.'),
    f(34.8, 3, 29, 40, 'IA que responde', 'A IA conversa com o paciente e a recepção assume quando quiser.'),
    f(64, 3, 20, 85, 'Triagem automática', 'O que a IA coletou vira ficha: motivo, urgência, origem e melhor período.'),
  ],
  'appbov-dashboard': [
    f(27.7, 17.9, 60.7, 11.7, 'Rebanho em números', 'Animais, lotes, áreas e lotação da fazenda hoje.'),
    f(27.7, 32.3, 30, 20.5, 'Atalhos rápidos', 'Cadastrar animal, registrar manejo, agendar sanidade e lançar no financeiro.'),
    f(58.5, 32.3, 30, 20.5, 'Precisa de atenção', 'Eventos sanitários que vencem nos próximos 7 dias.'),
    f(27.7, 55.4, 60.8, 43, 'Financeiro do mês', 'Entradas, saídas e saldo, com o gráfico dos últimos meses.'),
  ],
  'appbov-animais': [
    f(27.7, 19.9, 60.8, 11.4, 'Rebanho em números', 'Cabeças, fêmeas, machos e peso médio sempre atualizados.'),
    f(27.7, 34.2, 60.8, 19, 'Busca e filtros', 'Por sexo, categoria e status, com filtro avançado e exportação.'),
    f(27.7, 56.3, 60.8, 43.7, 'Ficha de cada animal', 'Identificação, categoria, peso e status em uma lista fácil de varrer.'),
  ],
  'appbov-calendario': [
    f(27.7, 19.1, 60.8, 11.7, 'Situação sanitária', 'Agendados, atrasados, próximos 7 dias e realizados.'),
    f(27.7, 33, 60.8, 66.9, 'Calendário sanitário', 'Vacinas, pesagens e diagnósticos no dia certo, com cores por tipo.'),
  ],
  'appbov-reproducao': [
    f(27.7, 20.9, 60.8, 30.6, 'Indicadores de reprodução', 'Taxa de prenhez, inseminações, diagnósticos e partos.'),
    f(27.7, 48.7, 60.8, 40.6, 'Diagnósticos e inseminações', 'Resultado dos diagnósticos e a evolução por mês.'),
  ],
  'izzi-dashboard': [
    f(18.5, 8.6, 25.5, 37, 'Boas-vindas', 'O aluno entra e já vê a próxima aula.'),
    f(71.7, 8.6, 25.5, 37, 'Acesso rápido', 'Curso, registro de aulas, faturas e perfil a um clique.'),
    f(45.1, 50, 25.5, 28.5, 'Progresso no curso', 'Quanto do curso já foi concluído, num círculo fácil de entender.'),
  ],
  'izzi-calendario': [
    f(18.5, 19.4, 78.5, 9.8, 'Turmas e aulas do mês', 'Turmas ativas, aulas de hoje, próxima aula e aulas no mês.'),
    f(18.5, 39.2, 51.5, 52, 'Horário semanal', 'A grade da semana com as aulas ao vivo da turma.'),
    f(71.2, 39.2, 25.8, 25, 'Minhas aulas', 'Próximas e recentes, para entrar ou rever.'),
  ],
  'izzi-curso': [
    f(18.5, 8.6, 45, 9.5, 'Curso por módulos', 'Uma jornada de aprendizado organizada em módulos.'),
    f(18.5, 21, 78.5, 76, 'Módulos e aulas', 'Cada módulo mostra quantas aulas tem e abre a lista.'),
  ],
}

const FALLBACK: Focus[] = [f(10, 10, 80, 80, 'Visão geral', 'A tela inteira, do jeito que o cliente usa.')]

/** Nome do arquivo sem pasta e sem extensão. */
export const baseName = (src: string) => src.split('/').pop()!.replace(/\.\w+$/, '')

export function focusesOf(image: ProjectImage): Focus[] {
  return focuses[baseName(image.src)] ?? FALLBACK
}

/** Passos do tour de um projeto: as telas de computador, cada uma com suas regiões. */
export function stepsOf(project: Project): TourStep[] {
  return project.images.filter((i) => imageKind(i) === 'desktop').map((image) => ({ image, focuses: focusesOf(image) }))
}

/** A primeira tela de celular do projeto, se houver. */
export function phoneOf(project: Project): ProjectImage | undefined {
  return project.images.find((i) => imageKind(i) === 'mobile')
}

/**
 * Transformação que leva a região ao centro do palco, com zoom.
 * Devolve escala e deslocamento em % do tamanho do palco (origem no canto superior esquerdo).
 */
export function focusTransform(focus: Focus, fit = 0.82, maxScale = 3.2): { scale: number; tx: number; ty: number } {
  const scale = Math.min(Math.max(Math.min(100 / focus.w, 100 / focus.h) * fit, 1), maxScale)
  const cx = focus.x + focus.w / 2
  const cy = focus.y + focus.h / 2
  const clamp = (v: number) => Math.min(Math.max(v, 100 - 100 * scale), 0)
  return { scale, tx: clamp(50 - cx * scale), ty: clamp(50 - cy * scale) }
}
