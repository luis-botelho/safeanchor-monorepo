# Handoff — estado do MVP

> O desenvolvimento foi retomado após o congelamento. Todo o código continua
> sendo versionado na branch **`develop`** e enviado para `origin/develop`.
> **`main` não foi alterada.** O PR `develop` → `main` permanece aberto para
> revisão: https://github.com/luis-botelho/safeanchor-monorepo/pull/175

## Branch e commits

Branch: `develop` · ponta atualizada a cada entrega · sincronizada com `origin/develop`.
`main` continua em `84826e0` (inalterada).

| Commit | Assunto |
|---|---|
| `8d73f4e` | feat(backend): enable real owners and expose persona |
| `edfd88b` | feat(backend): add documents and inspections API |
| `e7b7184` | feat(frontend): connect authentication to the API |
| `4276a74` | feat(frontend): connect fleet and maintenance to the API |
| `4dfd78b` | test(backend): cover documents and inspections routes |
| `5f0e168` | fix(frontend): compute dashboard readiness from API data |
| `3793446` | feat(frontend): connect documents and inspections to the API |
| `3c26011` | chore(deps): apply non-breaking audit fixes |
| `cab1fb7` | docs: update READMEs with live API status and production blocker |
| `8213a26` | docs: note DIRECT_URL requirement on Vercel previews |
| `a43a50b` | fix(db): make initial migration work on plain PostgreSQL |
| `a097e33` | docs: describe preview database setup |
| `2085842` | docs: record validated preview and remaining production blocker |

## O que foi entregue

- Autenticação real (register/login/me, JWT, `persona` no perfil e no token,
  logout em 401). Cadastro no frontend faz register + login automático.
- Frota, manutenção, documentos e inspeções conectados à API, com telas de
  cadastro e detalhe. Dashboard calcula prontidão a partir da API.
- Isolamento de acesso por `partyId`/organização e testes HTTP das rotas de
  documentos e inspeções com banco injetado.
- `0_init` portátil: cria `anon`/`authenticated` de forma idempotente, então as
  migrations funcionam em Supabase e em PostgreSQL puro.
- READMEs e `docs/product/mvp-rebaseline.md` atualizados.

## Validação

- Backend: `prisma generate`, `prisma validate` e `npm test` — 15 testes
  passando, 3 integrações puladas sem banco local.
- Frontend: `npm run build` sem erros.
- Todos os checks do PR #175 verdes (backend, frontend, deploy Vercel).
- Preview da API:
  `https://safeanchor-monorepo-git-develop-luisbotelhos-projects.vercel.app`
  — `/health` `200` com `database: up`; login demo
  (`demo@safeanchor.test` / `demo123456`) e listagens de vessels,
  maintenances, documents e inspections retornando `200` com 1 item do seed.

## Configuração fora do repositório

- Preview da Vercel (projeto `luisbotelhos-projects/safeanchor-monorepo`):
  `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` e `FRONTEND_ORIGIN` configurados
  somente no ambiente de Preview. Nenhum segredo foi versionado.
- Banco do Preview: projeto temporário Neon `wispy-forest-67479829`, branch
  `br-cold-river-bdl1t5dl`, expira em `2026-11-29T14:19:24Z`. Para manter,
  reivindique com `npx neon claim accept wispy-forest-67479829` ou substitua
  por um Postgres/Supabase próprio atualizando as variáveis de Preview.
- A proteção por login da Vercel (`ssoProtection`) foi desativada no projeto
  para que o Preview seja acessível sem autenticação. Reative em
  Settings → Deployment Protection se desejar.
- Credenciais locais temporárias (não versionadas):
  `C:\Users\JLV\AppData\Local\Temp\opencode\safeanchor-neon.env` e
  `neon-claim.log`. Apague quando não precisar.

## Pendências para retomar em casa

1. **Revisar e fazer merge do PR #175**. Nenhum merge foi feito aqui; a produção
   ainda roda o código antigo de `main` (sem `/documents` e `/inspections`).
2. **Produção**: após conectar o Supabase à Vercel,
   `https://safeanchor-monorepo.vercel.app/health` responde `200` com
   `database: up`. O usuário demo foi criado via `/auth/register` para validar
   login e listagens; a lista de embarcações está vazia.
3. **Frontend**: o GitHub Pages usa `VITE_API_URL` apontando para a API de
   produção, que agora está funcional. Se quiser UI no Preview, aponte essa
   variável para a URL do Preview ou crie um deploy de frontend separado.
4. Reivindicar/substituir o banco temporário do Preview antes da expiração.
5. Ainda em mock: catálogos (marinas, prestadores, jobs, community, eventos,
   trips, academy, IA), feed de atividades do dashboard e upload de arquivos
   em documentos.
6. Restam 3 vulnerabilidades high transitivas do Prisma 7 (`effect`); removê-las
   exigiria downgrade breaking.
