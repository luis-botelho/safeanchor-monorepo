# SafeAnchor Agent Notes

Este projeto agora e uma base simples para estudo.

## Stack Atual

- Frontend: React com Vite.
- Backend: Express.
- Persistencia: PostgreSQL no Supabase com Prisma 7.
- CSS: BEM em arquivos `.css`.
- Arquitetura do frontend: MVVM.
- Arquitetura do backend: Route -> Controller -> Service -> Prisma.

## Cuidados

- Evite adicionar Next.js, TypeScript ou Tailwind nesta fase.
- Preserve o Prisma e o PostgreSQL ja adotados no backend.
- Nunca versione `.env` ou credenciais do Supabase.
- Use `DATABASE_URL` no runtime e `DIRECT_URL` nos comandos do Prisma CLI.
- Prefira arquivos pequenos e didaticos.
- Antes de criar uma abstracao, escreva uma versao simples.
- Mantenha os READMEs atualizados com tarefas para iniciantes.

## Operacao da demo

- Producao: SPA em `https://luis-botelho.github.io/safeanchor-monorepo/` e API
  em `https://safeanchor-monorepo.vercel.app` (`/health`). Apresente sempre a
  producao; o Preview expira em `2026-11-29T14:19:24Z`.
- O login tem botoes "Acessos de demonstracao" para `demo@safeanchor.app`/`demo123`
  (`OWNER`), `carlos@tecno.boat`/`demo123` (`SERVICE_PROVIDER`) e
  `gestao@marinacostaazul.com`/`demo123` (`MARINA`); conta legada
  `demo@safeanchor.test`/`demo123456`. As contas sao reais, criadas via API;
  persona e so navegacao — autorizacao por role e isolamento por Party.
- API real: auth, vessels, maintenances, documents, inspections, preventiva,
  checklists e research. Marinas, prestadores, jobs, eventos, viagens, locacoes,
  marketplace, comunidade, academy e IA sao mock; feed e "prontidao" tambem.
- CORS so aceita `https://luis-botelho.github.io`; deep links no Pages respondem
  `404` com o HTML da SPA (esperado); JWT dura 1h sem refresh.
- Node 22 no backend e no CI. No Windows use `npm.cmd`, `Copy-Item` e
  `$env:VAR=...`.
- Nunca versione `.env`, rode seed/migrations contra producao ou reintroduza
  `/__setup`/`SETUP_TOKEN`.
- Trabalhe em `develop` e promova para `main` por PR, sem merge direto. Roteiro
  autorizado: `docs/demo-apresentacao.md`; validacao:
  `node scripts/verify-demo.mjs`.
