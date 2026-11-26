## Indice da documentacao

Este indice separa o que descreve a demo em producao (current), o registro da
versao inicial (historico) e as propostas ainda nao adotadas (target). Estado
operacional de referencia: 26/11/2026; area da diretoria, consentimento da
pesquisa e SEO publicados em produção.

### Current — demo funcional (26/11/2026)

- [Roteiro de apresentacao](./demo-apresentacao.md) — contas demo (inclui a
  diretoria), ordem de cliques, consentimento da pesquisa, o que e real x mock
  e `node scripts/verify-demo.mjs`.
- [Handoff operacional](./handoff-freeze.md) — PRs #175 a #181,
  deploys, contas demo e validacao com `node scripts/verify-demo.mjs`.
- [Deploy](./deployment.md) — GitHub Pages + Vercel, variaveis, CORS, migrations
  aplicadas e Preview com Neon temporario que expira em `2026-11-29T14:19:24Z`.
- [Rebaseline 2026](./product/mvp-rebaseline.md) — Features 031-038; 037 e 038
  concluidas, com #177 a #181 registrados, e trabalho adicional publicado.
- [Fluxo do usuario](./user-flow.mmd) — login com "Acessos de demonstracao" e
  jornada real da API.
- [Fluxo de dados](./data-flow.mmd) — services entre API real e catalogos mock.
- [Sistema visual](./visual-system.md) — Maritime Precision em producao,
  contratos de skeleton, movimento e novos blocos `.consent-gate*` e `.director-*`.
- [SEO e identidade visual](./seo.md) — prerender de rotas publicas, metadados,
  favicon, manifest e og-image; fonte unica em `src/seo/pageMeta.js`.
- [Cenarios competitivos](./product/competitive-landscape.md) — referencias de
  mercado usadas para priorizar a demo.
- [Diagnostico](./diagnostico.md) — stack, area da diretoria e fluxo de uso.
- [Banco de dados](./architecture/database.md) — RLS, seed local e contas demo
  criadas via API.
- [Guia de estudo](./learning/README.md) — primeiras tarefas e comandos Windows.

### Historico — v0.1.0 e sprints (nao e o estado atual)

- **v0.1.0 - Fleet Management Foundation:**
  [release](./releases/v0.1.0.md),
  [sprint review](./sprints/sprint-review-v0.1.0.md),
  [retrospectiva](./retrospectives/003-sprint-retrospective.md),
  [learning/001](./learning/001-fleet-management.md) e
  [learning/002](./learning/002-maintenance-management.md).
- [MVP original](./product/mvp.md), [roadmap do produto](./product/roadmap.md),
  [regras de negocio](./product/business-rules.md),
  [03-roadmap](./03-roadmap.md) e [12-changelog](./12-changelog.md).

### Target — propostas, nao implementadas no app atual

- [Arquitetura frontend target](./architecture/frontend.md) — Next.js,
  TypeScript e Redux Toolkit: referencia de escala, **nao** a stack atual
  (React 19 + Vite 7 + BEM + MVVM).
- [Arquitetura backend target](./architecture/backend.md) — NestJS e
  TypeScript: referencia de escala, **nao** o backend atual (Express 5 + Prisma 7).
- [Modelo de dominio conceitual](./architecture/domain-model.md) — amplia o
  schema com visoes futuras; identidade e propriedade ja existem no banco.
- [Arquitetura simples](./learning/arquitetura-simples.md),
  [produto simples](./learning/produto-simples.md) e
  [roadmap de aprendizado](./learning/roadmap-aprendizado.md) — material didatico.

> Se um documento historico ou target contradizer o estado atual, prevalecem os
> documentos **Current** e o codigo publicado.