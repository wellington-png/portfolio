export interface Quest {
  title: string
  text: string
  icon: string
}

export const quests: Quest[] = [
  { icon: 'map', title: 'Entender', text: 'Converso para entender o problema, o público e o que precisa funcionar primeiro.' },
  { icon: 'pencil', title: 'Desenhar', text: 'Planejo telas e fluxos simples antes de escrever código.' },
  { icon: 'wrench', title: 'Construir', text: 'Entrego em etapas pequenas, com algo novo para testar toda semana.' },
  { icon: 'rocket', title: 'Lançar', text: 'Publico, acompanho o uso e continuo melhorando depois do lançamento.' },
]
