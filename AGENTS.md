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
  `gestao@marinacostaazul.com`/`demo123` (`MARINA`), todos com role `USER`;
  conta legada `demo@safeanchor.test`/`demo123456`. **Nao ha credencial publica
  de diretoria** — a conta `DIRECTOR` e provisionada fora do repositorio e nao
  aparece na UI. As contas sao reais, criadas via API; persona e so navegacao —
  autorizacao por role e isolamento por Party.
- Area da diretoria em `/director`, `/director/responses`, `/director/users` e
  `/director/audit`: guard por `roleKey` no frontend e
  `authorizeRoles("DIRECTOR","ADMIN")` no backend. A diretoria filtra respostas
  da pesquisa por status/perfil/cidade, registra decisao/status, altera
  papel/persona e consulta auditoria minima (ator, alvo, acao, antes/depois e
  data; nunca senha ou token).
- API real: auth, vessels, maintenances, documents, inspections, preventiva,
  checklists, research com consentimento explicito e os endpoints `/director/*`.
  Marinas, prestadores, jobs, eventos, viagens, locacoes, marketplace,
  comunidade, academy e IA sao mock; feed e "prontidao" tambem.
- A pesquisa comeca por "Aceitar captura" ou "Recusar captura"
  (`safeanchor.researchConsent`, versao `2026-11-26`). Com aceite, respostas,
  perfil e contato opcional sao gravados em `ResearchResponse` e enviados por
  Resend; com recusa, nada vai ao servidor, o resumo fica no navegador e pode
  ser compartilhado manualmente por WhatsApp/e-mail. A escolha pode ser
  alterada/revogada em `/privacidade`. `safeanchor.cookieConsent` registra so a
  leitura do aviso: nao ha cookies de rastreamento, analytics ou publicidade.
  WhatsApp continua sendo link manual `wa.me`, sem envio automatico.
- SEO sem SSR: prerender estatico de `/`, `/pesquisa/` e `/privacidade/`,
  `noindex` nas rotas privadas, `robots.txt`, `sitemap.xml`, JSON-LD, Open
  Graph, canonical, favicon SVG/ICO/PNG, manifest e og-image. Fonte unica:
  `apps/frontend/src/seo/pageMeta.js`. Ver `docs/seo.md`.
- CORS so aceita `https://luis-botelho.github.io`; deep links no Pages respondem
  `404` com o HTML da SPA (esperado); JWT dura 15 min, com `jti`, `iss`/`aud`,
  fica apenas na memoria da aba e nao ha refresh — ao recarregar, faca login.
  `POST /auth/logout` revoga o token por `jti`; para revogacao global, rotacione
  `JWT_SECRET` (minimo 32 caracteres).
- A pesquisa usa nonce assinado pelo servidor (`GET /research/nonce`, validade
  de 10 min) no `POST /research`; IP, user-agent e timestamp do aceite ficam em
  `DirectorAction`. Links wa.me/mailto omitem contato por padrao. Rascunho e
  copia local expiram em 24h.
- Backend aplica `helmet`, esconde `X-Powered-By`, limita auth/research por IP e
  e-mail, recebe relatórios em `/api/csp-report` e valida payloads com `400`.
  Frontend tem headers no `vercel.json` e `public/_headers`, com CSP em
  `Report-Only` e `report-uri` para o backend. Detalhes em
  `docs/security-hardening.md`.
- `npm test` no backend passa (37 testes, 3 integrações puladas),
  incluindo `test/research-consent.test.js`, logout, headers, CSP e validacao. As migrations
  `20261127000000_add_director_role` e
  `20261127000100_add_research_consent_and_director` foram aplicadas em
  produção por bootstrap temporário removido no mesmo ciclo.
  `npm.cmd run verify:demo` fecha 157/157 checks.
- Node 22 no backend e no CI. No Windows use `npm.cmd`, `Copy-Item` e
  `$env:VAR=...`.
- Nunca versione `.env`, rode seed/migrations contra producao ou reintroduza
  `/__setup`/`SETUP_TOKEN`.
- Trabalhe em `develop` e promova para `main` por PR, sem merge direto. Roteiro
  autorizado: `docs/demo-apresentacao.md`; validacao:
  `node scripts/verify-demo.mjs`.
