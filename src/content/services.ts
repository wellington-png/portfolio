export interface Service {
  title: string
  text: string
  icon: string
}

export interface Faq {
  q: string
  a: string
}

export const services: Service[] = [
  { icon: 'layout', title: 'Sistemas de gestão', text: 'Agenda, financeiro, estoque e relatórios sob medida para o seu negócio.' },
  { icon: 'phone', title: 'Aplicativos', text: 'Apps para celular que conversam com o sistema e funcionam no dia a dia.' },
  { icon: 'plug', title: 'Integrações', text: 'WhatsApp, pagamentos, e-mail e outros serviços ligados ao que você já usa.' },
  { icon: 'bolt', title: 'Tempo real e IA', text: 'Videochamadas, notificações e automações para ganhar tempo.' },
]

export const faqs: Faq[] = [
  { q: 'Como começa um projeto?', a: 'Com uma conversa para entender o problema e o que precisa funcionar primeiro. Depois eu desenho as telas e combinamos as etapas.' },
  { q: 'Quanto tempo leva uma primeira versão?', a: 'Depende do tamanho, mas costumo entregar uma primeira versão para testar em poucas semanas e seguir melhorando em etapas curtas.' },
  { q: 'Você cuida do que vem depois do lançamento?', a: 'Sim. Acompanho o uso, corrijo o que aparecer e continuo evoluindo o sistema conforme o negócio muda.' },
  { q: 'Quais tecnologias você usa?', a: 'Python com Django e DRF no back-end, Next.js e React no front-end, Flutter para aplicativos e PostgreSQL como banco de dados.' },
]
