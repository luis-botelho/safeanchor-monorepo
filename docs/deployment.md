# SafeAnchor Deployment

Guia de deploy para o MVP do SafeAnchor — estado publicado em 26/11/2026.

> Frontend e backend **já estão em produção**. Apresente sempre a produção: o
> Preview da Vercel usa um Neon temporário que expira em
> `2026-11-29T14:19:24Z`.

## Arquitetura publicada

| Camada         | Plataforma                                    | URL |
| -------------- | --------------------------------------------- | --- |
| Frontend       | GitHub Pages (build Vite + fallback `404.html`) | https://luis-botelho.github.io/safeanchor-monorepo/ |
| Backend        | Vercel (Express 5)                             | https://safeanchor-monorepo.vercel.app |
| Banco de dados | PostgreSQL no Supabase (pooler no runtime)     | — |

O CI (`.github/workflows/ci.yml`) valida o backend (generate + validate + test) e
o frontend (build). O deploy do frontend (`.github/workflows/deploy-frontend.yml`)
roda no branch `main`, gera `apps/frontend/dist` e copia `index.html` para
`404.html` para o roteamento SPA em subpath.

## Requisitos

### Frontend

- Node.js 22 (exigido também pelo CI).
- React 19 + Vite 7; a API base é informada no build via `VITE_API_URL` e o
  subpath via `VITE_BASE_URL=/safeanchor-monorepo/`.
- Sem fallback de `localhost` no bundle de produção (o fallback existe apenas em
  modo desenvolvimento).

### Backend

- Node.js 22 (`engines.node >= 22` no `package.json` e `node-version: 22` no CI).
- Express 5 + Prisma 7; acesso ao PostgreSQL Supabase (pooler no runtime,
  conexão direta apenas para o Prisma CLI).
- `JWT_SECRET` forte e exclusivo do ambiente.

## Variáveis de ambiente

### Backend (`apps/backend/.env`)

| Variable       | Obrigatória | Descrição                                                                |
| -------------- | ----------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`       | sim         | Conexão de runtime (Supabase pooler, ex.: `?pgbouncer=true`).          |
| `DIRECT_URL`         | sim*        | Conexão direta usada pelo Prisma CLI (migrations e generate/validate). |
| `JWT_SECRET`         | sim         | Assinatura dos tokens JWT. Use valor aleatório longo.                  |
| `PORT`               | não         | Porta do servidor. Padrão `3001`.                                      |
| `FRONTEND_ORIGIN`    | sim (prod)  | Origem liberada no CORS: `https://luis-botelho.github.io`.             |
| `RESEND_API_KEY`     | sim         | Chave da API Resend usada por `POST /research` (nunca é `VITE_*`).      |
| `RESEARCH_FROM_EMAIL`| sim         | Remetente verificado no Resend.                                        |
| `RESEARCH_INBOX`     | não         | Destinatário das respostas; padrão `pesquisa@safeanchor.app`.           |

*`DIRECT_URL` é obrigatória para comandos do Prisma CLI; em runtime o backend
usa apenas `DATABASE_URL`. Não execute migrations nem `prisma db seed` contra a
produção como operação rotineira (sem `DIRECT_URL` operacional). Não reintroduza
o endpoint temporário `/__setup` nem a variável `SETUP_TOKEN`.

### Frontend (variáveis de build do GitHub Actions)

| Variable                | Obrigatória | Descrição                                                        |
| ----------------------- | ----------- | ---------------------------------------------------------------- |
| `VITE_API_URL`          | sim (prod)  | `https://safeanchor-monorepo.vercel.app`.                         |
| `VITE_BASE_URL`         | sim (Pages) | `/safeanchor-monorepo/`.                                          |
| `VITE_RESEARCH_WHATSAPP`| não         | `5524992772357` (55 + DDD + número) no bundle publicado.          |
| `VITE_RESEARCH_INBOX`   | não         | Destino do link manual de e-mail na confirmação da pesquisa.       |

Nenhum valor secreto é versionado: variáveis do frontend ficam no GitHub
Actions e segredos do backend na Vercel. Nunca versione `.env`.

## Build e start

### Backend

```bash
cd apps/backend
npm ci                 # instala dependências e roda prisma generate
npm run prisma:validate
npm test               # testes de CI (não tocam no Supabase)

npm start              # roda em process.env.PORT ou 3001
```

### Frontend

```bash
cd apps/frontend
npm ci
VITE_API_URL="https://safeanchor-monorepo.vercel.app" \
VITE_BASE_URL="/safeanchor-monorepo/" \
VITE_RESEARCH_WHATSAPP="5524992772357" npm run build   # gera apps/frontend/dist
```

No Windows (PowerShell), use `npm.cmd`, `Copy-Item` e `$env:NOME="valor"`. Build
local validado dentro de `apps/frontend`:

```powershell
$env:VITE_BASE_URL="/safeanchor-monorepo/"
$env:VITE_API_URL="https://safeanchor-monorepo.vercel.app"
$env:VITE_RESEARCH_WHATSAPP="5524992772357"
npm.cmd run build
```

O conteúdo de `apps/frontend/dist` é servido como site estático no Pages, com
`404.html` como fallback da SPA.

## Health check

O backend expõe um endpoint público de saúde:

```bash
curl https://safeanchor-monorepo.vercel.app/health
```

Resposta com banco disponível:

```json
{
  "status": "ok",
  "database": "up",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "uptime": 42
}
```

Resposta com banco indisponível (HTTP 503):

```json
{
  "status": "degraded",
  "database": "down",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## CORS, sessão e deep links

- O CORS de produção aceita somente a origem `https://luis-botelho.github.io`.
  Um frontend local apontando para a API pública recebe bloqueio de CORS: use a
  URL publicada na apresentação.
- O JWT dura 1 hora e não há refresh; se a sessão expirar, faça login novamente.
- Deep links no Pages (`/login`, `/pesquisa`, `/privacidade`) respondem `404`
  com o HTML da SPA (`404.html`), que o Router renderiza no navegador. Isso é o
  comportamento esperado do fallback; para começar, entre pela raiz `/`.
- O Preview da Vercel (`...-git-develop-...`) usa banco temporário com expiração
  em `2026-11-29T14:19:24Z`; não o use na apresentação.

## Contas de demonstração

As contas foram criadas via `/auth/register` na API de produção (não por
`prisma db seed`). A tela de login exibe **“Acessos de demonstração”**, que
preenche e-mail e senha das três principais:

| E-mail | Senha | Persona |
| --- | --- | --- |
| `demo@safeanchor.app` | `demo123` | `OWNER` |
| `carlos@tecno.boat` | `demo123` | `SERVICE_PROVIDER` |
| `gestao@marinacostaazul.com` | `demo123` | `MARINA` |

A conta legada `demo@safeanchor.test` / `demo123456` (`OWNER`) também existe,
mas não tem botão. Todas são `USER`: `persona` é metadado de navegação; a
autorização é por `role` e o isolamento por `Party`.

## Validação antes de apresentar

- Roteiro autorizado: [`demo-apresentacao.md`](./demo-apresentacao.md).
- No Windows, com Node 22, rode `node scripts/verify-demo.mjs` na raiz: o script
  checa Pages, bundle, rotas da SPA, `/health`, login das quatro contas,
  listagens, CORS, contagens e isolamento por `Party`, sem modificar dados.

## Notas

- Migrations do Prisma devem ser aplicadas fora do CI (comando manual ou etapa
  de release) — nunca durante o pipeline de pull request, e nunca contra a
  produção como operação rotineira.
- Logs são estruturados (JSON via pino); em produção redirecione stdout para o
  coletor de logs da plataforma escolhida.