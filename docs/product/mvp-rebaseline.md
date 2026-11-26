# SafeAnchor MVP Rebaseline 2026 - Operational Readiness

## North Star

> O usuário deve entrar no SafeAnchor e entender rapidamente se sua embarcação está pronta para operar, o que exige atenção e qual é o próximo risco.

## Jornada Principal

```
Login → Dashboard → Minha Frota → Embarcação → Manutenção / Checklists / Documentos → Prontidão Operacional
```

O produto é organizado em torno dessa jornada. Cada feature do rebaseline contribui para uma etapa dela, do acesso (Login) até a decisão de prontidão operacional.

## Features do Rebaseline

### FEATURE 031 - Ownership & Access Scope

- Ownership explícito de Vessel.
- Isolamento real de dados entre usuários/organizações.
- Queries respeitam o escopo do usuário autenticado.
- ADMIN mantém acesso administrativo.
- Organization/Membership somente no mínimo necessário para operar.

### FEATURE 032 - Product Shell & Main Dashboard

- Layout autenticado consistente (sidebar/header).
- Navegação principal (frota, manutenção, inspeções, documentos).
- Dashboard com: resumo da frota, manutenções pendentes/próximas, inspeções recentes e documentos próximos do vencimento.
- Estados de loading / empty / error.

### FEATURE 033 - Vessel Operational Profile

- Dados e status da Vessel.
- Manutenção recente e próxima.
- Última inspeção realizada.
- Documentos e vencimentos.
- Ações e históricos centralizados.

### FEATURE 034 - Documents Core

- Entidade Document no Prisma.
- Associação com Vessel.
- Upload de documentos.
- Supabase Storage.
- Metadata e `expirationDate`.
- Listagem e download seguro.

### FEATURE 035 - Expiration & Compliance

- Documentos válidos.
- Documentos próximos do vencimento.
- Documentos vencidos.
- Indicadores no dashboard.
- Pendências por Vessel e por frota.

### FEATURE 036 - Safety Completion & Mobile Polish

- Melhorar execução mobile de checklists.
- Histórico legível.
- Resumo básico de falhas/conformidade.
- Revalidar QR Code e Safety Reports existentes.
- QR Code (novo) somente se couber no escopo.

### FEATURE 037 - MVP UX Polish

- Identidade visual consistente.
- Sidebar/header padronizados.
- Formulários com feedback.
- Estados de loading / empty / error.
- Responsividade básica.
- Remover artifacts/fallbacks de desenvolvimento visíveis.

### FEATURE 038 - CI/CD & Production Deploy

- GitHub Actions.
- Backend publicado.
- Frontend publicado.
- Variáveis de produção.
- Supabase (production).
- Health check.
- Smoke test.
- Documentação de deploy.

## Status de implementação (branch `develop`)

| Feature | Situação | Observação |
| --- | --- | --- |
| 031 | ✅ | Roles + ownership aplicados a vessels, manutenções, documentos e inspeções. |
| 032 | 🔶 | Shell e dashboard consomem a API; feed de atividades ainda mock. |
| 033 | 🔶 | Perfil com dados reais; prontidão calculada no cliente (a API não expõe `readiness`). |
| 034 | 🔶 | Modelo `Document`, API e cadastro/listagem na UI prontos; faltam upload e Supabase Storage. |
| 035 | ✅ | Status por validade (válido/próximo/vencido) e indicadores no dashboard. |
| 036 | 🔶 | Inspeções via API com checklist e certificado; falta mobile/offline e revalidação de QR Code. |
| 037 | ✅ | Concluída: tema Maritime Precision, skeletons contextuais, estados vazios/erro e spinner de submit no PR #177; demais catálogos seguem mock. |
| 038 | ✅ | Concluída: Pages e Vercel no ar, `/health` 200 com banco up; PRs #175, #177, #178 e #179 mergeados em `main`. |

### Trabalho adicional publicado

Fora das Features 031–038, sem novo número de feature definido:

- **Diretoria:** conta `diretoria@safeanchor.app` / `demo123` (persona `OWNER`,
  role `DIRECTOR`), botão "Admin da diretoria" no login com destino `/director`,
  e rotas `/director`, `/responses`, `/users` e `/audit`. Frontend protege por
  `roleKey`; backend usa `authorizeRoles("DIRECTOR","ADMIN")`. A diretoria
  filtra respostas por status/perfil/cidade, registra decisão/status, altera
  papel/persona e consulta auditoria mínima (ator, alvo, ação, antes/depois e
  data; nunca senha ou token).
- **Consentimento da pesquisa:** versão `2026-11-26`; aceite grava
  `ResearchResponse`, envia por Resend e permite análise; recusa não envia nem
  grava, mantendo o resumo no navegador para compartilhamento manual. A escolha
  pode ser alterada/revogada em `/privacidade`. Chaves locais:
  `safeanchor.researchConsent` (decisão, versão e data) e
  `safeanchor.cookieConsent` (aviso lido). Sem rastreamento, analytics ou
  publicidade; WhatsApp segue link manual `wa.me`.
- **SEO/favicon:** prerender estático de `/`, `/pesquisa/` e `/privacidade/`,
  `noindex` nas privadas, `robots.txt`, `sitemap.xml`, JSON-LD, Open Graph,
  canonical, favicon SVG/ICO/PNG, manifest e og-image. Fonte única:
  `apps/frontend/src/seo/pageMeta.js` (ver [`../seo.md`](../seo.md)).
- **Backend/testes:** endpoints `GET /director/responses`, `/insights`, `/users`,
  `/actions` e `PATCH /director/users/:id`, `/responses/:id`, com JWT e
  `DIRECTOR`/`ADMIN`; `npm test` passa, incluindo
  `apps/backend/test/research-consent.test.js`.

Promovido para `main` nos PRs #180 e #181, com deploy de produção concluído.
As duas migrations foram aplicadas em produção por bootstrap temporário
removido no mesmo ciclo, sem expor segredos.

O PR #175 levou as rotas de documentos e inspeções para `main`; o #177 levou a
reformulação visual, o #178 a documentação da demo e o #179 os acessos de
demonstração, a correção de perfil e a verificação versionada. `main` estava em
`a870351` antes da promoção do #179, que publicou os botões de **“Acessos de
demonstração”** no login. A produção responde `200` em `/health`
após a conexão do Supabase à Vercel, com as migrations aplicadas e deploy limpo
(sem `/__setup` ou `SETUP_TOKEN` — não reintroduzir).

As contas demo foram criadas em produção por `/auth/register` (não por
`prisma db seed`): `demo@safeanchor.app`/`demo123` (`OWNER`),
`carlos@tecno.boat`/`demo123` (`SERVICE_PROVIDER`),
`gestao@marinacostaazul.com`/`demo123` (`MARINA`) e a conta legada
`demo@safeanchor.test`/`demo123456` (`OWNER`). Os três primeiros são
preenchidos automaticamente pelos botões do login. Todas são `USER`: `persona`
é metadado de navegação; a autorização é por `role` e o isolamento por `Party`.
Em `develop` surge a quinta conta, `diretoria@safeanchor.app`/`demo123` (botão
"Admin da diretoria"): persona `OWNER`, mas role real `DIRECTOR` na API, com
acesso a `/director`.

Os dados de demonstração foram semeados pela própria API: `demo@safeanchor.app`
e `demo@safeanchor.test` têm 3 embarcações, 5 manutenções, 5 documentos,
4 inspeções (1 concluída com certificado), 1 preventiva e 1 execução de
checklist; `carlos@tecno.boat` e `gestao@marinacostaazul.com` têm 2 embarcações,
2 manutenções, 2 documentos, 1 inspeção concluída, 1 preventiva e 1 execução.
Existe um template global “Checklist de segurança — demo”. Login, listagens,
dashboard e CORS com a origem do GitHub Pages foram validados em produção.

O Preview usa um Postgres temporário (Neon) que expira em
`2026-11-29T14:19:24Z`: apresente sempre a produção. Restam como limites
conhecidos os catálogos mock/localStorage (marinas, prestadores, jobs, eventos,
viagens, locações, marketplace, comunidade, academy e IA), o feed de atividades
e a “prontidão” calculada no cliente (a API não expõe `readiness`), o CORS
restrito a `https://luis-botelho.github.io`, deep links com `404` HTML da SPA e
o JWT de 1h sem refresh. Mudanças futuras em `develop` são promovidas a `main`
por pull request; o roteiro em [`../demo-apresentacao.md`](../demo-apresentacao.md)
é a referência autorizada, com verificação via `node scripts/verify-demo.mjs`.

## Definição de Pronto (DoD)

- O usuário consegue percorrer a jornada completa (Login → Prontidão) sem erros.
- Dados de um usuário não vazam para outro (ownership/isolamento).
- Dashboard reflete frota, manutenção, inspeções e documentos com dados reais.
- Documentos podem ser listados e cadastrados, com vencimentos visíveis (sem upload de arquivos).
- Indicadores de compliance aparecem no dashboard e por embarcação.
- Execução de checklist via API e histórico são funcionais (desktop; mobile/offline segue pendente).
- UI consistente, sem artifacts de desenvolvimento visíveis.
- Backend e frontend publicados em produção com health check e verificação da demo.

## Itens Pós-MVP

- Maritime Academy (Features 021–025 do backlog original).
- QR Code avançado (caso não caiba na Feature 036).
- Expansões de marketplace, IoT e mobile nativo mantidas no roadmap.

## Relação com Backlog Histórico

Este rebaseline reorganiza o backlog do MVP anterior:

- **Features 016–020**: escopo relevante absorvido pelas Features 034 e 035.
- **Features 021–025**: movidas para pós-MVP; a Maritime Academy permanece no roadmap.
- **QR Code / Safety Reports (029 e 030)**: revalidados funcionalmente durante a Feature 036.
- **Feature 030 CI/CD (#152)**: trabalho preparado permanece válido; o deploy real foi concluído na Feature 038 (#175, #177, #178 e #179).

Nenhuma issue antiga foi fechada ou deletada; apenas comentários de replanejamento foram adicionados para preservar o histórico.
