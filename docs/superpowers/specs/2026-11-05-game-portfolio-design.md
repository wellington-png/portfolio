# Portfólio em modo game (React + Three.js) — Design

> **Substituído em parte:** a mecânica do carrinho foi rejeitada. A nova mecânica está em `2026-11-05-portal-gallery-design.md`. Stack, visual neon, versão 2D e degradação continuam valendo.

Data: 2026-11-05

## Objetivo

Portfólio pessoal em React que funciona como um jogo 3D: o visitante dirige um carrinho por uma cidade neon/cyberpunk e chega em "distritos" que apresentam Sobre mim, Projetos, Skills e Contato. Deve ter animações, interatividade e boa impressão visual, sem prejudicar recrutadores com pouco tempo (atalho 2D).

## Decisões

- Mecânica: explorar mundo 3D dirigindo um veículo (estilo Bruno Simon).
- Veículo: carrinho com física (derrapa, empurra objetos).
- Visual: neon / cyberpunk, cidade noturna, bloom.
- Conteúdo: Sobre mim, Projetos, Skills/tecnologias, Contato.
- Acesso: mundo 3D + atalho para versão rápida 2D; joystick virtual no celular.
- Stack: Vite + TypeScript + React, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `@react-three/postprocessing`, `zustand`.
- Alternativas descartadas: R3F com física própria (perde a graça de empurrar objetos); Three.js puro (foge de React, mais trabalho).
- Conteúdo inicial: dados de exemplo (placeholders) em `content/`, trocados depois pelo usuário.

## Arquitetura

Unidades isoladas, cada uma com um propósito:

- `world/`: cena, cidade, iluminação, pós-processamento.
- `vehicle/`: carrinho, controles, câmera de seguimento.
- `zones/`: um componente por zona, com sensores de proximidade.
- `ui/`: HUD, minimapa, painéis de conteúdo (HTML sobre o canvas), joystick virtual, tela inicial e de carregamento.
- `content/`: `profile.ts`, `projects.ts`, `skills.ts`, `contact.ts`. Única fonte de dados, usada pelo 3D e pelo 2D.
- `fallback2d/`: versão rápida em React, mesmo visual neon, lê `content/`.
- `store/`: estado global (zustand): zona ativa, zonas visitadas, painel aberto, nível de qualidade, modo (3D/2D).

## Veículo e controles

- `RigidBody` do Rapier com collider de caixa; quatro rodas apenas visuais.
- Aceleração/freio aplicam impulso no eixo frontal; direção aplica torque em Y proporcional à velocidade; amortecimento lateral ajustável controla a derrapagem; espaço = freio de mão.
- Hook `useControls()` unifica teclado (WASD/setas) e joystick virtual e devolve `{ throttle, steer, brake }`. A física não conhece a origem do input.
- Rotações em X/Z travadas (só gira em Y), então o carrinho não vira.
- Reset ao último ponto seguro (tecla `R` e automático ao cair do mapa).
- Efeitos: faróis neon, rastro de luz, partículas ao derrapar.

## Câmera

- Seguimento suave (lerp), atrás e acima do carrinho; FOV aumenta com a velocidade.
- Ao entrar em uma zona, transição curta para enquadramento do prédio/terminal; ao sair, volta ao seguimento.

## Zonas

- Cada zona tem collider `sensor`. Entrar define `activeZone` no store; o HUD mostra "Pressione E / toque para abrir"; o painel HTML aparece sobre o canvas. Sair fecha o painel.
- Painéis são componentes React acessíveis (foco, `Esc` para fechar), não texto em 3D.
- Distritos: Sobre (quiosque holográfico), Projetos (um prédio por projeto), Skills (muro de ícones empurráveis), Contato (portal/terminal).
- Minimapa e seta guia no HUD apontam para as zonas não visitadas.

## Conteúdo de exemplo

- `profile.ts`: nome, título, bio curta, avatar.
- `projects.ts`: 4 projetos `{ id, title, description, stack[], demoUrl, repoUrl, color }`.
- `skills.ts`: lista agrupada (front-end, back-end, ferramentas) com nome e ícone.
- `contact.ts`: email, GitHub, LinkedIn, WhatsApp.
- Todos placeholders ("Seu Nome", "Projeto Exemplo 1").

## Versão rápida 2D

- Página React leve, rolagem pelas quatro seções, lê `content/`.
- Aberta por botão na tela inicial e no HUD. Carregada automaticamente se não houver WebGL ou se `prefers-reduced-motion` estiver ativo.

## Erros e degradação

- `ErrorBoundary` no canvas: qualquer erro de render leva ao 2D com aviso.
- Falha ao carregar o WASM do Rapier ou assets: mesma saída para o 2D, com botão "tentar de novo".
- Tela de carregamento com progresso (`useProgress`).

## Desempenho

- Lazy loading do código 3D e da física; a tela inicial abre rápido.
- DPR limitado a 1.5–2; três níveis de qualidade (alto/médio/baixo) via `PerformanceMonitor`, reduzindo bloom, sombras e partículas.
- Geometrias instanciadas (`Instances`) para prédios e partículas.
- Sem modelos 3D externos na v1: geometria e materiais no código. Troca por glTF possível depois.

## Testes

- Vitest: mapeamento de input para `{ throttle, steer, brake }`, store de zonas, leitura de `content/`.
- React Testing Library: painéis de conteúdo e fallback 2D.
- Sensação do carrinho e visual: validação manual no navegador, ajustando parâmetros.

## Fora do escopo (v1)

Multiplayer, sons e música, editor de conteúdo, CMS, modelos 3D externos.
