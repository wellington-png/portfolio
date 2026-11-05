# Portfólio: galeria de portais 3D — Design

Data: 2026-11-05
Substitui a mecânica do carrinho de `2026-11-05-game-portfolio-design.md` (rejeitada pelo usuário após a Task 14). As decisões de stack, visual neon, versão 2D e degradação continuam valendo.

## Objetivo

Portfólio React em que o visitante, só com o mouse (ou toque), explora um salão 3D neon com portais flutuantes, um por projeto. Clicar num portal atravessa-o e leva a uma sala 3D temática do projeto, com os prints reais em telas flutuantes, animações e um HUD de jogo com descrição, stack e links.

## Decisões

- Navegação: galeria de portais (hub) controlada por mouse; sem personagem nem veículo.
- Dentro do projeto: sala 3D temática (template único, cor por projeto) + galeria de prints + painel de detalhes.
- Portal: `MeshPortalMaterial` do drei, para o efeito real de atravessar a moldura.
- Conteúdo: os 4 projetos reais da Tymos (Barbuz, Occlo, AppBov, Diaê), com 18 prints baixados de `https://tymos.app/shots/` para `public/shots/` (cópias locais, sem dependência do site da Tymos).
- Visual: neon / cyberpunk, bloom, sem modelos 3D externos.
- Stack: Vite + TypeScript + React 19, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `zustand`, Vitest + React Testing Library. `@react-three/rapier` é removido (não há mais física).
- Nome, título e bio reais do usuário ainda são placeholders ("Seu Nome") até ele fornecê-los.

## Experiência

### Tela inicial
Igual à existente: título neon, botão Start e atalho "Versão rápida (2D)".

### Salão (hub)
- Salão escuro neon com 4 portais em arco, cada um uma moldura em arco com anel animado e partículas, na cor do projeto.
- Câmera com parallax suave seguindo o mouse (toque: arrastar).
- Hover num portal: cresce e brilha, cursor vira reticle, aparecem nome e frase curta. Fora de hover cada portal mostra a imagem de capa do projeto; a sala viva só é renderizada para o portal em hover ou em entrada (limite de GPU).
- Clique: a câmera mergulha no portal em ~1,2 s (blend do `MeshPortalMaterial` de 0 a 1) e a sala passa a ser a cena ativa.
- Menu HUD no topo: Sobre mim, Skills, Contato. Abrem os painéis existentes (`ui/sections`) em diálogo acessível.

### Sala do projeto
- Sala 3D com a cor do projeto, grade e luzes neon, mais telas flutuantes com os prints. Prints de celular usam moldura de telefone; os de desktop, moldura de monitor.
- Parallax pelo mouse. Clicar numa tela aproxima nela (foco); setas do teclado, botões na tela ou arrastar trocam de imagem; clicar fora ou `Esc` desfaz o foco.
- HUD sobreposto: título, descrição, chips de stack, botão "Ver site" (URL ao vivo, nova aba com `noopener`) e "Voltar".
- "Voltar" (ou `Esc` sem foco em tela) executa a saída reversa do portal e volta ao salão com o portal visitado marcado.

### Fases
`hub` → `entering` (animação, entradas ignoradas) → `room` → `leaving` (animação) → `hub`. O estado vive no store: `phase`, `activeProject`, `focusedImage`.

## Arquitetura

- `content/`: `types.ts` (Project ganha `tagline`, `liveUrl`, `kind`, `images: { src, kind: 'desktop' | 'mobile', alt }[]`, `cover`), `projects.ts` com os 4 reais, `skills.ts`/`profile.ts`/`contact.ts` mantidos.
- `public/shots/`: 18 arquivos `.webp`.
- `store/gameStore.ts`: adaptado (`phase`, `activeProject`, `focusedImage`, ações de transição); remove `activeZone`/`visited` por zona 3D, mantém `visited` por projeto.
- `world/`: `Hall.tsx` (salão, luzes, grade), `Portal.tsx` (moldura + `MeshPortalMaterial`), `ProjectRoom.tsx` (template da sala), `ImageScreen.tsx` (tela/telefone com textura), `ParallaxRig.tsx` (câmera), `CameraDive.tsx` (animação de entrada/saída), `Effects.tsx`, `quality.ts` mantidos/adaptados. `Skyline` pode ser reaproveitado como fundo.
- `ui/`: `TopMenu.tsx`, `ProjectHud.tsx`, `ZonePanel.tsx` generalizado para painéis de Sobre/Skills/Contato, `sections.tsx` reaproveitado, `StartScreen`, `GameErrorBoundary`.
- `fallback2d/`: reaproveitado; a galeria passa a mostrar os prints reais de cada projeto.
- `lib/`: `capabilities.ts` mantido; `parallax.ts` (mapeamento mouse → deslocamento, puro) e `gallery.ts` (navegação circular de imagens, puro).
- Removidos: `vehicle/`, `zones/` (3D e layout), `ui/Minimap`, `GuideArrow`, `JoystickPad`, `Hud.tsx`, `ui/guide.ts`, dependência `@react-three/rapier`.

## Entradas

- Mouse/toque: hover, clique, arrastar, parallax.
- Teclado: `Esc` volta/fecha; setas esquerda/direita trocam de imagem; `Tab`/`Enter` acessam o menu e botões do HUD (todo controle do HUD é um elemento focável real).

## Erros e degradação

- `ErrorBoundary` no canvas: qualquer erro leva ao 2D com aviso (comportamento atual).
- Textura que falha ao carregar: a tela mostra um placeholder neon com o `alt` do print, sem derrubar a sala.
- Sem WebGL ou `prefers-reduced-motion`: 2D automático (comportamento atual). No modo movimento reduzido, a animação de mergulho é substituída por corte direto.

## Desempenho

- Lazy loading do código 3D (já existe).
- `PerformanceMonitor` + 3 níveis de qualidade: baixa desliga bloom e partículas e troca portais ao vivo por capa estática.
- Texturas `.webp` pequenas (≤ ~120 KB cada); carregamento das imagens da sala só ao entrar no portal.
- DPR limitado como hoje.

## Testes

- Vitest: `parallax.ts`, `gallery.ts`, transições de fase e navegação do store, e integridade dos dados de `content/` (cada imagem referenciada existe em `public/shots/`, URLs válidas).
- React Testing Library: `ProjectHud` (título, stack, links com `rel`, botão Voltar muda a fase), painéis de Sobre/Skills/Contato, `TopMenu` e a galeria 2D.
- Cena 3D, transições e "feeling": validação manual no navegador.

## Fora do escopo (v1)

Som e música, multiplayer, CMS, vídeo dentro das salas, mundos 3D modelados por projeto, captura automática de screenshots dos sites (os prints já vêm da Tymos).
