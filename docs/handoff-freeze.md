# Handoff — estado final da demo (2026-11-26)

> **Demo funcional nos dois lugares.** O backend está no Vercel e o frontend no
> GitHub Pages. O desenvolvimento continua na branch **`develop`**; o código de
> produção saiu de **`main`** após os merges dos PRs #175 e #176. A reformulação
> visual descrita abaixo está em `develop`, aguardando promoção por PR.

## Onde está publicado

| Camada | URL | Estado |
|---|---|---|
| Frontend (SPA React/Vite) | https://luis-botelho.github.io/safeanchor-monorepo/ | `200`, bundle apontando para a API de produção |
| Backend (API Express) | https://safeanchor-monorepo.vercel.app | `/health` `200` com `database: "up"` |
| Preview da API | https://safeanchor-monorepo-git-develop-luisbotelhos-projects.vercel.app | `200`, banco temporário Neon |

Login da demo: `demo@safeanchor.test` / `demo123456` (conta `USER`, `persona: OWNER`).

## Branch, PR e deployments

- Branch de trabalho: **`develop`**, sincronizada com `origin/develop`.
- `main`: merge commit `aacaab655d5a88db5361039809811030c64f4c8b`.
- PR #175 (`develop` → `main`): **MERGED** em `2026-11-26T17:14:26Z`.
- CI em `main`: run `45866027746` (success).
- GitHub Pages em `main`: run `45866028405` (success).
- Deploy de produção limpo (sem endpoint temporário):
  `dpl_GqVhLf3QT8EsYqWrCGX1QFFDEt4b` — READY e com alias em
  `safeanchor-monorepo.vercel.app`.

## O que foi concluído nesta rodada

1. O Supabase foi conectado ao projeto da Vercel; `/health` saiu de `503` para `200`.
2. O merge do PR #175 levou as rotas de documentos e inspeções para `main`.
3. Após o merge, a produção passou a falhar com `P2022: The column User.persona
   does not exist`. As três migrations faltantes foram aplicadas no banco de
   produção por um endpoint temporário protegido (`/__setup`), usando
   `DIRECT_URL`/`DATABASE_URL` do runtime. Nenhuma senha foi lida, impressa ou
   versionada.
4. O endpoint temporário foi **removido do código**, a variável `SETUP_TOKEN`
   foi **removida da Vercel** e a produção foi redeployada limpa. Hoje
   `GET /__setup` responde `401` genérico do `requireAuth` — ou seja, a rota não
   existe mais.
5. O usuário demo foi criado em produção por `/auth/register` e os dados de
   demonstração foram semeados pela própria API (não por `prisma db seed`).
6. O PR #176 (`develop` → `main`) levou o botão de WhatsApp, a política de
   privacidade/LGPD e o aviso de armazenamento local para produção.

## Reformulação visual — Maritime Precision (em `develop`)

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
| `LoadingFallback` | `components/LoadingFallback.jsx` | fallback único para 26 telas secundárias e validação de sessão |
| `ErrorState` | `components/ErrorState.jsx` | erro com explicação e ação, no lugar de `<p>` solto |
| `SubmitButton` + `InlineSpinner` | `components/` | 10 formulários com `disabled`, `aria-busy`, spinner e rótulo de largura estável |

- Skeletons estão nas 8 telas principais: dashboard (3 personas), frota, detalhe
  de embarcação, documentos, manutenções e inspeções.
- `MarinasPage` agora tem `isLoading` real e empty state: uma lista vazia não
  fica "carregando" para sempre.
- O pulse do skeleton tem **2 ciclos finitos** e só roda sob
  `prefers-reduced-motion: no-preference`. `transition: all` foi substituído por
  propriedades explícitas; `fade-in`, `survey-in` e `whatsapp-card-in` também são
  opt-in. Com movimento desligado, o estado final continua visível.
- Commits em `develop`: `2b3f1a1`, `ba8533c`, `7440477`, `cef53e6`, `5854bd1`,
  `fd3036d`, `f3c3388`, `214e69a`, `7d33a3b`.

## Dados de demonstração em produção

Semeados via API autenticada, com valores didáticos em português:

| Recurso | Quantidade | Exemplos |
|---|---|---|
| Embarcações | 3 | SafeAnchor Demo, Maré Nova, Vento Sul |
| Manutenções | 5 | Inspeção do motor, Troca de óleo programada, Revisão do casco |
| Documentos | 5 | Seguro obrigatório, Registro de embarcação, Certificado de vistoria |
| Inspeções | 3 | Agendadas para 02/12, 10/12 e 18/12/2026, com checklist aberto |

O seed é idempotente por verificação: se já existir embarcação, ele não duplica.

## Validação ponta a ponta (2026-11-26)

Executada com `Origin: https://luis-botelho.github.io` para exercitar o CORS real:

| Verificação | Resultado |
|---|---|
| `GET` página no Pages | `200` |
| Bundle do frontend contém a URL da API de produção | sim |
| `POST /auth/login` | `200` + token JWT |
| `GET /vessels` | `200`, 3 itens |
| `GET /maintenances` | `200`, 5 itens |
| `GET /maintenances/dashboard` | `200`, `total=5`, `pending=2`, `completed=2` |
| `GET /documents` | `200`, 5 itens |
| `GET /inspections` | `200`, 3 itens |
| `Access-Control-Allow-Origin` nas respostas | `https://luis-botelho.github.io` |
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
  `JWT_SECRET`, `FRONTEND_ORIGIN=https://luis-botelho.github.io` e as variáveis
  sincronizadas pela integração Supabase (`POSTGRES_*`, `SUPABASE_*`). Nenhum
  valor está versionado.
- GitHub Actions (variáveis do repositório): `VITE_API_URL`,
  `VITE_RESEARCH_WHATSAPP=5524992772357` e, se quiser alterar o link manual de
  e-mail, `VITE_RESEARCH_INBOX`. Nenhuma chave do Resend vai para o frontend.
- Preview (Vercel): `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` e
  `FRONTEND_ORIGIN` próprios, apontando para o Neon temporário
  `wispy-forest-67479829` (branch `br-cold-river-bdl1t5dl`), que expira em
  `2026-11-29T14:19:24Z`. Para manter: `npx neon claim accept
  wispy-forest-67479829` ou substitua por outro Postgres e atualize as variáveis.
- A proteção por login da Vercel (`ssoProtection`) foi desativada para que os
  deploys sejam públicos. Reative em Settings → Deployment Protection se quiser.
- Arquivos temporários locais (não versionados) usados na operação:
  `C:\Users\JLV\AppData\Local\Temp\opencode\{production.env,safeanchor-neon.env,
  verify-production.mjs,seed-production.mjs,validate-demo.mjs}`. Apague quando
  não precisar.

## Como retomar (humano ou agente)

1. **Não use merge direto em `main`.** Trabalhe em `develop` e abra PR.
2. Para mudar dados da demo em produção, use a API com o token do usuário demo;
   não rode `prisma db seed` contra produção.
3. Para aplicar **novas migrations em produção**, a Vercel não devolve segredos
   via CLI. Você precisa de `DIRECT_URL` com acesso ao Supabase (fornecida pelo
   usuário) ou repetir, por breve período, um endpoint protegido como o que foi
   removido aqui — e removê-lo no mesmo dia.
4. Se o login voltar a falhar com `P2022`, rode `npx prisma migrate status` com
   `DIRECT_URL` e aplique as migrations pendentes antes de mexer no frontend.
5. Depois de qualquer alteração em `main`, confirme Pages + Vercel e rode o
   smoke test de `/health`, login e quatro listagens.
6. Leia também [`diagnostico.md`](./diagnostico.md) para entender as tecnologias
   e o fluxo de uso antes de mexer na arquitetura.
7. Antes de mexer em loading, animação ou cor, leia
   [`visual-system.md`](./visual-system.md). Todo indicador novo precisa passar
   pelo checklist de aceite daquele documento (inclusive leitor de tela e
   `prefers-reduced-motion`).
8. Para validar o frontend localmente, rode `npm.cmd run build` **dentro de**
   `apps/frontend` com `VITE_BASE_URL`, `VITE_API_URL` e
   `VITE_RESEARCH_WHATSAPP`. O script `build` não existe na raiz e `npm.ps1`
   pode ser bloqueado pela execution policy do Windows.

## Pendências conhecidas

- Ainda em mock: catálogos (marinas, prestadores, jobs, community, eventos,
  trips, academy, IA), feed de atividades do dashboard e upload de arquivos em
  documentos.
- Falta refresh token, documentação OpenAPI e upload real (Supabase Storage).
- Restam 3 vulnerabilidades high transitivas do Prisma 7 (`effect`); removê-las
  exigiria downgrade breaking.
- O feed de atividades do dashboard e a prontidão ainda são calculados no cliente.
