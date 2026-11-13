import { contact } from './contact'
import { profile } from './profile'

/**
 * Textos da versão Clean (a página comercial). Tudo o que aparece nela e não vem dos projetos fica aqui,
 * num lugar só. Os textos são baseados nos 4 projetos reais; ajuste ao seu jeito de falar.
 */

export const WHATSAPP_MESSAGE = 'Olá, José! Vim pelo seu portfólio e quero conversar sobre um projeto.'

/** Link do WhatsApp já com a mensagem pronta. */
export const whatsappLink = `${contact.whatsapp}${contact.whatsapp.includes('?') ? '&' : '?'}text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

export const emailLink = `mailto:${contact.email}?subject=${encodeURIComponent('Projeto: vim pelo seu portfólio')}`

export const pitch = {
  seo: {
    title: `${profile.name} · Desenvolvedor full stack`,
    description: 'Sistemas web e aplicativos sob medida para pequenos negócios: agenda, financeiro e atendimento em um só lugar. Projetos reais no ar.',
  },
  hero: {
    eyebrow: 'Curitiba · atendo todo o Brasil',
    headline: 'Eu desenvolvo o sistema que o seu negócio ainda faz no caderno e na planilha.',
    sub: 'Agenda, cobrança, cadastro, WhatsApp. Eu converso com você, desenho, programo e coloco no ar. Já fiz isso para barbearia, clínica, fazenda e escola.',
    primary: 'Chamar no WhatsApp',
    secondary: 'Ver o que já fiz',
    proof: 'Quatro sistemas no ar, três deles meus e um feito para cliente.',
  },
  benefits: {
    title: 'Como eu trabalho',
    text: '',
    items: [
      { title: 'Começo pela sua rotina', text: 'Antes de abrir o editor, quero ver como o dia funciona hoje: quem anota o quê, onde a informação se perde, o que dá retrabalho.' },
      { title: 'Você vê funcionando cedo', text: 'Em poucas semanas já existe uma versão para você clicar. Dá para corrigir o rumo cedo, quando ainda é barato.' },
      { title: 'Eu mesmo faço tudo', text: 'Telas, banco de dados, servidor e integração com WhatsApp e pagamento. Você fala com quem escreve o código.' },
      { title: 'Depois do ar, continuo por perto', text: 'Sistema de negócio muda. Eu acompanho o uso, conserto o que aparecer e sigo evoluindo.' },
    ],
  },
  cases: {
    title: 'Projetos reais, em uso',
    text: 'Cada sistema nasceu de um problema de rotina. Veja o que foi feito e como ele funciona.',
    byProject: {
      barbuz: {
        segment: 'Barbearias',
        problem: 'Agenda no caderno, comissão na calculadora e cliente que esquece o horário.',
        solution: 'Agenda online com pagamento, comissão por barbeiro, programa de fidelidade e um painel com o dia inteiro.',
      },
      occlo: {
        segment: 'Clínicas odontológicas',
        problem: 'Prontuário em papel, agenda cheia de buracos e paciente sem resposta no WhatsApp.',
        solution: 'Prontuário com odontograma, agenda por dentista, financeiro e atendimento por WhatsApp com inteligência artificial.',
      },
      appbov: {
        segment: 'Pecuaristas',
        problem: 'Dados do rebanho espalhados em planilhas e cadernos, difíceis de consultar no pasto.',
        solution: 'Rebanho, manejo, sanidade, reprodução e financeiro da fazenda em um só lugar, também no celular.',
      },
      diae: {
        segment: 'Escolas de inglês',
        problem: 'Aulas ao vivo, material e cobrança em ferramentas diferentes.',
        solution: 'Plataforma com calendário de aulas ao vivo, cursos por módulos e acompanhamento de cada aluno.',
      },
    } as Record<string, { segment: string; problem: string; solution: string }>,
    labels: { problem: 'O problema', solution: 'O que eu fiz', stack: 'Tecnologias', cta: 'Ver o sistema no ar' },
  },
  process: {
    title: 'Do primeiro contato ao sistema no ar',
    text: '',
    steps: [
      { title: 'Conversa', text: 'Você me conta o que trava hoje. Uns 30 minutos, sem compromisso.' },
      { title: 'Proposta', text: 'Mando escopo, prazo e valor por escrito, para você decidir com tudo na mesa.' },
      { title: 'Construção', text: 'Entrego por partes. Você testa cada uma antes de eu seguir para a próxima.' },
      { title: 'No ar', text: 'Publico, treino quem vai usar e acompanho as primeiras semanas de perto.' },
    ],
  },
  stack: {
    title: 'O que eu uso',
    text: 'Ferramentas comuns e bem documentadas. Se um dia outra pessoa precisar mexer no sistema, ela consegue.',
  },
  faq: {
    title: 'Perguntas que costumam aparecer',
    items: [
      { q: 'Quanto custa um sistema?', a: 'Depende do tamanho e do que precisa existir. Depois da nossa conversa eu envio uma proposta com escopo, prazo e valor fechados, sem surpresa no meio do caminho.' },
      { q: 'Em quanto tempo fica pronta uma primeira versão?', a: 'Costumo entregar uma primeira versão para você testar em poucas semanas. O Barbuz, por exemplo, teve a primeira versão em 2 meses.' },
      { q: 'Você cuida do que vem depois do lançamento?', a: 'Sim. Acompanho o uso, corrijo o que aparecer e sigo evoluindo o sistema conforme o negócio muda.' },
      { q: 'Preciso entender de tecnologia?', a: 'Não. Eu explico tudo em linguagem simples e você só precisa me contar como o seu negócio funciona.' },
      { q: 'Quais tecnologias você usa?', a: 'Python com Django e DRF no back-end, Next.js e React no front-end, Flutter para aplicativos e PostgreSQL como banco de dados.' },
    ],
  },
  about: {
    title: 'Sou o José, e vou ser quem escreve o seu sistema.',
    text: [
      'Trabalho com desenvolvimento há mais de 3 anos. Sou sócio da Tymos, onde faço produtos próprios de ponta a ponta, e antes ajudei a construir uma plataforma de telemedicina com videoconsulta.',
      'Prefiro poucos projetos, bem feitos, a muitos pela metade. Se eu não for a pessoa certa para o que você precisa, te digo na primeira conversa.',
    ],
  },
  cta: {
    title: 'Conta o que você precisa.',
    text: 'Respondo no mesmo dia útil, com perguntas e um caminho possível. Sem proposta genérica.',
    primary: 'Chamar no WhatsApp',
    secondary: 'Mandar um e-mail',
  },
}
