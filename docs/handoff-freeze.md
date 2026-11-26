# Handoff — estado final da demo (2026-11-26)

> **Demo funcional nos dois lugares.** O backend está no Vercel e o frontend no
> GitHub Pages. O desenvolvimento continua na branch **`develop`**; a produção
> sai de **`main`** por PR. Os PRs #175, #176, #177, #178 e #179 foram
> mergeados — a reformulação visual Maritime Precision, os acessos de
> demonstração e a documentação de apresentação estão publicados.

## Onde está publicado

| Camada | URL | Estado |
|---|---|---|
| Frontend (SPA React/Vite) | https://luis-botelho.github.io/safeanchor-monorepo/ | `200`, bundle `index-DRIWQwSE.js` / CSS `index-C7oaZ_ox.css`, API de produção e WhatsApp `5524992772357` |
| Backend (API Express) | https://safeanchor-monorepo.vercel.app | `/health` `200` com `database: "up"` |
| Preview da API | https://safeanchor-monorepo-git-develop-luisbotelhos-projects.vercel.app | `200`, banco temporário Neon — **não usar na apresentação** |

Contas de demonstração (criadas via `/auth/register` na API de produção):

| Perfil | E-mail | Senha | Persona | Papel na API |
|---|---|---|---|---|
| Proprietário | `demo@safeanchor.app` | `demo123` | `OWNER` | `USER` |
| Proprietário legado | `demo@safeanchor.test` | `demo123456` | `OWNER` | `USER` |
| Prestador | `carlos@tecno.boat` | `demo123` | `SERVICE_PROVIDER` | `USER` |
| Marina | `gestao@marinacostaazul.com` | `demo123` | `MARINA` | `USER` |

Na tela de login, o bloco **“Acessos de demonstração”** preenche as três
contas principais com um clique. `persona` controla apenas menus e dashboards;
a autorização real é por `role` e o isolamento de dados é por `Party`. O roteiro
completo está em [`demo-apresentacao.md`](./demo-apresentacao.md).

## Branch, PR e deployments

- Branch de trabalho: **`develop`**, sincronizada com `origin/develop`.
- `main`: merge commit do PR #179 (após `a870351`, merge do PR #178).
- PR #175 (`develop` → `main`): **MERGED** em `2026-11-26T17:14:26Z`; CI `45866027746`, Pages `45866028405`.
- PR #176 (`develop` → `main`): **MERGED** em `2026-11-26T17:46:46Z`; CI `45870584827`.
- PR #177 (`develop` → `main`): **MERGED** em `2026-11-26T18:32:23Z`; CI `45876739970` (success) e Pages `45876739922` (success).
- PR #178 (`develop` → `main`): **MERGED** em `2026-11-26T18:41:26Z`; somente documentação. Um merge docs-only **não** dispara o deploy do Pages.
- PR #179 (`develop` → `main`): **MERGED**; levou os acessos de demonstração, a correção de `providerId`/`marinaId`, o script `scripts/verify-demo.mjs` e a documentação sincronizada.
- Deploy de produção limpo anterior: `dpl_GqVhLf3QT8EsYqWrCGX1QFFDEt4b` — READY com alias em `safeanchor-monorepo.vercel.app`. Nenhum endpoint temporário voltou.

## O que foi concluído nesta rodada

1. O Supabase foi conectado ao projeto da Vercel; `/health` saiu de `503` para `200`.
2. O merge do PR #175 levou as rotas de documentos e inspeções para `main`.
3. Após o merge, a produção passou a falhar com `P2022: The column User.persona does not exist`. As três migrations faltantes foram aplicadas no banco de produção por um endpoint temporário protegido (`/__setup`), usando `DIRECT_URL`/`DATABASE_URL` do runtime. Nenhuma senha foi lida, impressa ou versionada.
4. O endpoint temporário foi **removido do código**, a variável `SETUP_TOKEN` foi **removida da Vercel** e a produção foi redeployada limpa. Hoje `GET /__setup` responde `401` genérico do `requireAuth` — ou seja, a rota não existe mais.
5. As quatro contas demo foram criadas em produção por `/auth/register` e os dados de demonstração foram semeados pela própria API (não por `prisma db seed`).
6. O PR #176 levou o botão de WhatsApp, a política de privacidade/LGPD e o aviso de armazenamento local para produção.
7. O PR #177 levou a reformulação visual para `main`/produção; a validação pós-merge fechou 29/29 checks.
8. O PR #178 sincronizou a documentação com o estado pós-#177.
9. A tela de login ganhou botões de acesso rápido para `OWNER`, `SERVICE_PROVIDER` e `MARINA`.
10. `toProfile()` passou a preservar `providerId`/`marinaId` dos perfis demo, eliminando o dead-end de `JobsPage` e o fallback fixo nos links de perfil público/minha marina.
11. O PR #179 publicou tudo e o script versionado `scripts/verify-demo.mjs` fechou **110/110 checks** contra produção.

## Reformulação visual — Maritime Precision (em produção)

A pasta `stitch_safeanchor_maritime_ux_architecture/`, adicionada pelo usuário,
foi versionada e traduzida para tokens BEM em
`apps/frontend/src/styles/global.css`: Light Mist `#F2F6F5`, Deep Ocean Navy
`#102A43`, Abyss Teal `#123C43`, Sea Teal `#167D83`, bordas de 1 px e raio 4 px.
**Não** foi adicionado Tailwind, lib de UI ou lib de animação — a referência é
fonte de decisão, não código para copiar. O contrato completo está em
[`visual-system.md`](./visual-system.md).

| Primitive | Onde vive | Uso |
|---|---|---|
| `Skeleton`, `SkeletonText`, `SkeletonRegion` | `components/Skeleton.jsx` | formas com a geometria da tela final, `aria-hidden`, `aria-busy` e `.sr-only` |
| `PageSkeletons` | `components/PageSkeletons.jsx` | dashboard, grid de embarcações, lista, tabela e detalhe |
| `LoadingFallback` | `components/LoadingFallback.jsx` | fallback único para telas secundárias e validação de sessão |
| `ErrorState` | `components/ErrorState.jsx` | erro com explicação e ação, no lugar de `<p>` solto |
| `SubmitButton` + `InlineSpinner` | `components/` | formulários com `disabled`, `aria-busy`, spinner e rótulo de largura estável |
| `.demo-access*` | `styles/global.css` | botões de preenchimento automático das contas demo no login |

- Skeletons estão nas telas principais: dashboard (3 personas), frota, detalhe
  de embarcação, documentos, manutenções e inspeções.
- `MarinasPage` tem `isLoading` real e empty state: uma lista vazia não fica
  “carregando” para sempre.
- O pulse do skeleton tem **2 ciclos finitos** e só roda sob
  `prefers-reduced-motion: no-preference`. `transition: all` foi substituído por
  propriedades explícitas; `fade-in`, `survey-in` e `whatsapp-card-in` também são
  opt-in. Com movimento desligado, o estado final continua visível.
- Commits em `develop` desta fase: `2b3f1a1`, `ba8533c`, `7440477`, `cef53e6`,
  `5854bd1`, `fd3036d`, `f3c3388`, `214e69a`, `7d33a3b`, `e830dc9`, `aa62062`,
  `90ec750`, `487bc84`, `1a44095`, `f86e3fc`, `03750d2`, `e8d248b`.

### Validação pós-merge (26/11/2026)

Script versionado `scripts/verify-demo.mjs`: **110/110 checks OK** contra a URL
pública. Ele é não destrutivo, não imprime senhas e pode ser repetido a qualquer
momento:

```powershell
node scripts/verify-demo.mjs
# ou, na raiz do repositório:
npm.cmd run verify:demo
```

- Pages `200` com o bundle novo (`index-DRIWQwSE.js` / `index-C7oaZ_ox.css`).
- Bundle com API de produção, WhatsApp `5524992772357`, `/privacidade`, LGPD,
  `safeanchor.cookieConsent`, `wa.me`, `mailto:`, e-mails das contas demo e IDs
  `prov-carlos` / `marin-costa-azul`. O número antigo não aparece como literal
  independente — a substring só existe dentro do número correto com `55`.
- CSS com `skeleton-pulse`, `inline-loader__spin`, `btn__label-busy`,
  `alert--error`, tokens Maritime Precision e `.demo-access`.
- Deep links `/privacidade`, `/pesquisa`, `/login`, `/dashboard`, `/fleet`,
  `/marinas` e `/jobs`: o Pages responde `404` com o HTML da SPA, que o Router
  renderiza no navegador — comportamento esperado do fallback.
- Vercel `/health`: `status: "ok"`, `database: "up"`.
- Login das quatro contas no ambiente de produção: token JWT recebido,
  `persona` e `role` corretos, `/auth/me` coerente.
- Listagens por conta com CORS para `https://luis-botelho.github.io`, contagens
  mínimas esperadas e pelo menos uma inspeção `COMPLETED` com certificado.
- `GET /vessels/:id` com token do prestador sobre uma embarcação do
  proprietário responde `404` — isolamento por `Party` confirmado.

## Dados de demonstração em produção

Semeados via API autenticada, com valores didáticos em português:

| Conta | Embarcações | Manutenções | Documentos | Inspeções | Preventivas | Execuções de checklist |
|---|---:|---:|---:|---:|---:|---:|
| `demo@safeanchor.app` | 3 | 5 | 5 | 4 (1 concluída) | 1 | 1 |
| `demo@safeanchor.test` | 3 | 5 | 5 | 4 (1 concluída) | 1 | 1 |
| `carlos@tecno.boat` | 2 | 2 | 2 | 1 (concluída) | 1 | 1 |
| `gestao@marinacostaazul.com` | 2 | 2 | 2 | 1 (concluída) | 1 | 1 |

Exemplos do proprietário: `SafeAnchor Demo`, `Maré Nova`, `Vento Sul`,
`Inspeção do motor`, `Troca de óleo programada`, `Seguro obrigatório`,
`Registro de embarcação`, `Certificado de inspeção técnica`. O template global
`Checklist de segurança — demo` foi criado uma única vez.

Os scripts temporários que semearam os dados são idempotentes por verificação
de existência; nenhum deles apaga ou duplica registros ao ser repetido.

## Validação ponta a ponta (2026-11-26)

Executada com `Origin: https://luis-botelho.github.io` para exercitar o CORS real:

| Verificação | Resultado |
|---|---|
| `GET` página no Pages | `200` |
| Bundle do frontend contém a URL da API de produção | sim |
| `POST /auth/login` para as quatro contas | `200` + token JWT |
| `GET /vessels`, `/maintenances`, `/documents`, `/inspections` | `200` para cada persona |
| `GET /maintenances/dashboard` | `200`, `total=5` no proprietário |
| `GET /preventive-maintenances` e `/checklist-executions` | `200`, ao menos 1 item por conta |
| `POST /inspections/:id/complete` | certificado gerado quando nenhum item falha |
| `Access-Control-Allow-Origin` nas respostas | `https://luis-botelho.github.io` |
| Acesso a embarcação de outra Party | `404` |
| `GET /__setup` | `401` (rota inexistente, cai no `requireAuth`) |

## Formulário de feedback, privacidade e WhatsApp

- O formulário público `/pesquisa` salva o rascunho em `localStorage`, envia
  `POST /research` e o backend dispara o e-mail via Resend para `RESEARCH_INBOX`.
  Teste em 26/11/2026: `202` com id do Resend, CORS correto para a origem do
  Pages e **recebimento confirmado pelo usuário**.
- O WhatsApp **não é envio automático**: é um link `wa.me` com mensagem
  preenchida, disponível no botão flutuante do site e na tela de confirmação da
  pesquisa. O número `5524992772357` (55 + DDD 24) é injetado no build por
  `VITE_RESEARCH_WHATSAPP` (variável do GitHub Actions); `wa.me` exige o código
  do país, então não use o número sem o `55`. Envio automático exigiria
  credenciais de WhatsApp Business API/Twilio.
- A rota pública `/privacidade` documenta controlador, dados coletados, bases
  legais, compartilhamento (Supabase, Vercel, Resend, GitHub Pages e WhatsApp),
  retenção, segurança e direitos da LGPD (art. 18).
- O `CookieNotice` explica o armazenamento local e registra o aceite em
  `safeanchor.cookieConsent`. Não existem cookies de rastreamento ou publicidade.
- Links para a política foram adicionados ao rodapé da introdução, ao menu
  autenticado e ao rodapé da pesquisa.

## Configuração fora do repositório

- Produção (Vercel): `DATABASE_URL` (runtime), `DIRECT_URL` (Prisma CLI),
  `JWT_SECRET`, `FRONTEND_ORIGIN=https://luis-botelho.github.io`,
  `RESEND_API_KEY`, `RESEARCH_FROM_EMAIL`, `RESEARCH_INBOX` e as variáveis
  sincronizadas pela integração Supabase (`POSTGRES_*`, `SUPABASE_*`). Nenhum
  valor está versionado.
- GitHub Actions (variáveis do repositório): `VITE_API_URL`,
  `VITE_RESEARCH_WHATSAPP=5524992772357` e `VITE_RESEARCH_INBOX`. Nenhuma chave
  do Resend vai para o frontend.
- Preview (Vercel): `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` e
  `FRONTEND_ORIGIN` próprios, apontando para o Neon temporário
  `wispy-forest-67479829` (branch `br-cold-river-bdl1t5dl`), que expira em
  `2026-11-29T14:19:24Z`. Para manter: `npx neon claim accept
  wispy-forest-67479829` ou substitua por outro Postgres e atualize as variáveis.
- A proteção por login da Vercel (`ssoProtection`) foi desativada para que os
  deploys sejam públicos. Reative em Settings → Deployment Protection se quiser.
- Arquivos temporários locais (não versionados) usados na operação:
  `C:\Users\JLV\AppData\Local\Temp\opencode\{production.env,safeanchor-neon.env,
  verify-production.mjs,seed-production.mjs,seed-demo-clients.mjs,
  seed-owner-demo.mjs,seed-demo-flows.mjs,seed-demo-persona-data.mjs,
  validate-demo.mjs}`. O smoke test agora vive no repositório em
  `scripts/verify-demo.mjs`; apague os temporários quando não precisar.

## Como retomar (humano ou agente)

1. Trabalhe em `develop` e abra PR para `main`. Não use merge direto em `main`.
2. Para mudar dados da demo em produção, use a API com o token da conta correta;
   não rode `prisma db seed` contra produção.
3. Para aplicar **novas migrations em produção**, a Vercel não devolve segredos
   via CLI. Você precisa de `DIRECT_URL` com acesso ao Supabase (fornecida pelo
   usuário) ou repetir, por breve período, um endpoint protegido como o que foi
   removido aqui — e removê-lo no mesmo dia.
4. Se o login voltar a falhar com `P2022`, rode `npx prisma migrate status` com
   `DIRECT_URL` e aplique as migrations pendentes antes de mexer no frontend.
5. Depois de qualquer alteração em `main`, confirme Pages + Vercel e rode
   `node scripts/verify-demo.mjs` (ou `npm.cmd run verify:demo` na raiz). O
   script cobre bundle, rotas SPA, quatro contas, listagens, CORS, certificados
   e isolamento.
6. Leia [`demo-apresentacao.md`](./demo-apresentacao.md) antes de apresentar e
   [`diagnostico.md`](./diagnostico.md) para entender a arquitetura antes de
   mexer nela.
7. Antes de mexer em loading, animação ou cor, leia
   [`visual-system.md`](./visual-system.md). Todo indicador novo precisa passar
   pelo checklist de aceite daquele documento (inclusive leitor de tela e
   `prefers-reduced-motion`).
8. Para validar o frontend localmente, rode `npm.cmd run build` **dentro de**
   `apps/frontend` com `VITE_BASE_URL`, `VITE_API_URL` e
   `VITE_RESEARCH_WHATSAPP`. O script `build` não existe na raiz e `npm.ps1`
   pode ser bloqueado pela execution policy do Windows.
9. Não aponte um frontend local para a API de produção: o CORS só aceita
   `https://luis-botelho.github.io`. Use sempre a URL publicada.

## Pendências conhecidas

- Ainda em mock: catálogos (marinas, prestadores, jobs, community, eventos,
  trips, academy, IA), feed de atividades do dashboard e upload de arquivos em
  documentos.
- Falta refresh token (JWT expira em 1 hora), documentação OpenAPI e upload real
  (Supabase Storage).
- Restam 3 vulnerabilidades high transitivas do Prisma 7 (`effect`); removê-las
  exigiria downgrade breaking.
- O feed de atividades do dashboard e a prontidão ainda são calculados no cliente.
