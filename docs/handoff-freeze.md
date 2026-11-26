# Handoff — estado final da demo (2026-11-26)

> **Demo funcional e publicada.** Frontend no GitHub Pages, API no Vercel e
> dados reais no Supabase. A produção sai de **`main`** por pull request; o
> desenvolvimento continua em **`develop`**. Os PRs #175 a #181 foram
> mergeados. A validação final fechou **157/157 checks** contra a produção.

## Onde está publicado

| Camada | URL | Estado |
|---|---|---|
| Frontend (SPA React/Vite) | https://luis-botelho.github.io/safeanchor-monorepo/ | `200`, bundle `index-D7Sq3aeM.js` / CSS `index-gaoHXUJm.css`, API de produção e WhatsApp `5524992772357` |
| Backend (API Express) | https://safeanchor-monorepo.vercel.app | `/health` `200` com `database: "up"`; `/director/*` `200` para a diretoria e `403` para `USER` |
| Preview da API | https://safeanchor-monorepo-git-develop-luisbotelhos-projects.vercel.app | `200`, banco temporário Neon — **não usar na apresentação** |

Contas de demonstração (criadas via `/auth/register` na API de produção):

| Perfil | E-mail | Senha | Persona | Papel na API |
|---|---|---|---|---|
| Proprietário | `demo@safeanchor.app` | `demo123` | `OWNER` | `USER` |
| Proprietário legado | `demo@safeanchor.test` | `demo123456` | `OWNER` | `USER` |
| Prestador | `carlos@tecno.boat` | `demo123` | `SERVICE_PROVIDER` | `USER` |
| Marina | `gestao@marinacostaazul.com` | `demo123` | `MARINA` | `USER` |
| Admin da diretoria | `diretoria@safeanchor.app` | `demo123` | `OWNER` | `DIRECTOR` |

Na tela de login, o bloco **“Acessos de demonstração”** preenche as contas com
um clique; o botão **“Admin da diretoria”** abre `/director`. `persona` controla
apenas menus e dashboards — a autorização real é por `role` e o isolamento de
dados é por `Party`. O roteiro completo está em
[`demo-apresentacao.md`](./demo-apresentacao.md).

## Branch, PR e deployments

- Branch de trabalho: **`develop`**, sincronizada com `origin/develop`.
- PR #175 (`develop` → `main`): **MERGED** em `2026-11-26T17:14:26Z`; CI `45866027746`, Pages `45866028405`.
- PR #176 (`develop` → `main`): **MERGED** em `2026-11-26T17:46:46Z`; CI `45870584827`.
- PR #177 (`develop` → `main`): **MERGED** em `2026-11-26T18:32:23Z`; CI `45876739970` e Pages `45876739922`.
- PR #178 (`develop` → `main`): **MERGED** em `2026-11-26T18:41:26Z`; somente documentação (não dispara build do Pages).
- PR #179 (`develop` → `main`): **MERGED** em `2026-11-26T19:03:10Z`; CI `45880688216`, Pages `45880688204`, Vercel `6XuzHMq9x4birnWVH761otQ1eGJQ`.
- PR #180 (`develop` → `main`): **MERGED** em `2026-11-26T19:34:19Z`; merge commit `f45ba74d256eb3ff4cf4a7b5e3164df2f35cf7a3`; CI `45884632862`, Pages `45884632720`. Levou consentimento explícito, área da diretoria, SEO com prerender, bootstrap temporário e verificador com 157 checks.
- PR #181 (`develop` → `main`): **MERGED**; remove o bootstrap temporário, corrige as checagens de SEO publicado e sincroniza a documentação. IDs finais de CI/deploy: a registrar na última atualização deste handoff.
- A promoção foi sempre por PR; nenhum merge direto em `main` e nenhum endpoint temporário permaneceu no código.

## O que foi concluído nesta rodada

1. Supabase conectado à Vercel: `/health` passou de `503` para `200` com `database: "up"`.
2. Reformulação visual **Maritime Precision**, acessos de demonstração e roteiro de apresentação publicados nos PRs #175–#179.
3. Captura da pesquisa passou a exigir aceite explícito e versionado (`2026-11-26`). Com aceite, a resposta é gravada em `ResearchResponse` e enviada por Resend. Com recusa, nada vai ao servidor e o resumo fica só no navegador.
4. Área da diretoria publicada em `/director`, `/director/responses`, `/director/users` e `/director/audit`, com guard por `roleKey` no frontend e `authorizeRoles("DIRECTOR", "ADMIN")` no backend.
5. A conta `diretoria@safeanchor.app` foi criada como `USER` e promovida a `DIRECTOR` no mesmo ciclo.
6. As migrations `20261127000000_add_director_role` e `20261127000100_add_research_consent_and_director` foram aplicadas em produção por um **bootstrap temporário** controlado por `BOOTSTRAP_DIRECTOR_SCHEMA=true`. O código do bootstrap e a variável foram **removidos no mesmo ciclo**; nenhuma credencial foi lida, impressa ou versionada.
7. Uma resposta aceita real foi enviada por `POST /research` (`id cmwxycph5000008jqobyp0fxa`, `emailSent: true`) e aparece na área da diretoria.
8. SEO sem SSR: prerender de `/`, `/pesquisa/` e `/privacidade/`, `noindex` nas rotas privadas, `robots.txt`, `sitemap.xml`, JSON-LD, Open Graph, canonical, favicon SVG/ICO/PNG, manifest e og-image. Fonte única: `apps/frontend/src/seo/pageMeta.js`.
9. O verificador versionado passou a cobrir 157 checks, incluindo consentimento, diretoria, RBAC, CORS e SEO.
10. A validação final contra a produção fechou **157/157 Checks OK**.

## Reformulação visual e identidade publicada

A pasta `stitch_safeanchor_maritime_ux_architecture/`, adicionada pelo usuário,
foi versionada e traduzida para tokens BEM em
`apps/frontend/src/styles/global.css`: Light Mist `#F2F6F5`, Deep Ocean Navy
`#102A43`, Abyss Teal `#123C43`, Sea Teal `#167D83`, bordas de 1 px e raio 4 px.
**Não** foi adicionado Tailwind, lib de UI ou lib de animação. O contrato
completo está em [`visual-system.md`](./visual-system.md).

| Primitive | Onde vive | Uso |
|---|---|---|
| `Skeleton`, `SkeletonText`, `SkeletonRegion` | `components/Skeleton.jsx` | formas com a geometria da tela final, `aria-hidden`, `aria-busy` e `.sr-only` |
| `PageSkeletons` | `components/PageSkeletons.jsx` | dashboard, grid de embarcações, lista, tabela e detalhe |
| `LoadingFallback` | `components/LoadingFallback.jsx` | fallback único para telas secundárias e validação de sessão |
| `ErrorState` | `components/ErrorState.jsx` | erro com explicação e ação, no lugar de `<p>` solto |
| `SubmitButton` + `InlineSpinner` | `components/` | formulários com `disabled`, `aria-busy`, spinner e rótulo de largura estável |
| `.demo-access*` | `styles/global.css` | botões de preenchimento automático das contas demo no login |
| `.consent-gate*` | `styles/global.css` | aceite/recusa explícitos no início da pesquisa |
| `.director-*` | `styles/global.css` | painéis, filtros, barras e tabelas da diretoria |

- Skeletons estão nas telas principais: dashboard (3 personas), frota, detalhe
  de embarcação, documentos, manutenções e inspeções.
- O pulse do skeleton tem **2 ciclos finitos** e só roda sob
  `prefers-reduced-motion: no-preference`. Animações são opt-in; com movimento
  desligado, o estado final continua visível.
- Favicon em SVG/ICO/PNG, `site.webmanifest` e `og-image.png` acompanham o
  prerender das três rotas públicas.

### Validação final (26/11/2026)

Script versionado `scripts/verify-demo.mjs`: **157/157 checks OK** contra a URL
pública. Ele é não destrutivo, não imprime senhas e pode ser repetido a qualquer
momento:

```powershell
node scripts/verify-demo.mjs
# ou, na raiz do repositório:
npm.cmd run verify:demo
```

O verificador cobre:

- Pages `200` com o bundle publicado (`index-D7Sq3aeM.js` / `index-gaoHXUJm.css`).
- Bundle com API de produção, WhatsApp `5524992772357`, `wa.me`, `mailto:`,
  LGPD, `safeanchor.cookieConsent`, `safeanchor.researchConsent`,
  “Aceitar captura”/“Recusar captura”, `/director`, e-mails das cinco contas e
  IDs `prov-carlos` / `marin-costa-azul`. O número antigo do WhatsApp não
  aparece como literal independente.
- CSS com `skeleton-pulse`, `inline-loader__spin`, `btn__label-busy`,
  `alert--error`, tokens Maritime Precision, `.demo-access`, `.consent-gate` e
  `.director-panel`.
- SEO: canonical, `robots` indexável, JSON-LD, og-image, oito ícones,
  `site.webmanifest`, `robots.txt`, `sitemap.xml` e prerender das três rotas
  públicas. Deep links privados respondem `404` com o HTML da SPA — esperado.
- Vercel `/health`: `status: "ok"`, `database: "up"`.
- Login das cinco contas: token JWT recebido, `persona` e `role` corretos,
  `/auth/me` coerente. A diretoria responde `role=DIRECTOR`; um `USER` recebe
  `403` em `/director/responses`.
- `GET /director/insights|responses|users|actions` com CORS para
  `https://luis-botelho.github.io` e pelo menos uma resposta consentida.
- `POST /research` com recusa responde `202` e `captured=false`; consentimento
  desatualizado responde `400`.
- Listagens por conta com CORS, contagens mínimas esperadas e pelo menos uma
  inspeção `COMPLETED` com certificado.
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
`Checklist de segurança — demo` foi criado uma única vez. Os scripts temporários
que semearam os dados são idempotentes por verificação de existência.

## Pesquisa, privacidade e WhatsApp

- `/pesquisa` começa por **“Aceitar captura”** ou **“Recusar captura”**. A
  escolha fica em `safeanchor.researchConsent` com versão `2026-11-26` e data;
  pode ser alterada ou revogada em `/privacidade`.
- Com aceite, respostas, perfil e contato opcional são gravados e encaminhados
  por Resend. A diretoria filtra por status/perfil/cidade, registra decisão e
  status, altera papéis/personas e consulta auditoria mínima (ator, alvo, ação,
  antes/depois e data — nunca senha ou token).
- Com recusa, nada é enviado ao servidor nem gravado: o resumo fica no
  navegador e pode ser compartilhado manualmente.
- `safeanchor.cookieConsent` registra apenas a leitura do aviso. **Não há
  cookies de rastreamento, analytics ou publicidade.**
- O WhatsApp **não é envio automático**: é um link `wa.me` com mensagem
  preenchida. O número `5524992772357` (55 + DDD 24) é injetado no build por
  `VITE_RESEARCH_WHATSAPP`; `wa.me` exige o código do país.
- A rota pública `/privacidade` documenta controlador, dados coletados, bases
  legais, compartilhamento (Supabase, Vercel, Resend, GitHub Pages e WhatsApp),
  retenção, segurança e direitos da LGPD (art. 18).

## Configuração fora do repositório

- Produção (Vercel): `DATABASE_URL` (runtime), `DIRECT_URL` (Prisma CLI),
  `JWT_SECRET`, `FRONTEND_ORIGIN=https://luis-botelho.github.io`,
  `RESEND_API_KEY`, `RESEARCH_FROM_EMAIL`, `RESEARCH_INBOX` e as variáveis
  sincronizadas pela integração Supabase (`POSTGRES_*`, `SUPABASE_*`). Nenhum
  valor está versionado.
- `BOOTSTRAP_DIRECTOR_SCHEMA` existiu apenas durante este ciclo e foi **removida
  da Vercel** junto com o código do bootstrap.
- GitHub Actions (variáveis do repositório): `VITE_API_URL`,
  `VITE_RESEARCH_WHATSAPP=5524992772357` e `VITE_RESEARCH_INBOX`. Nenhuma chave
  do Resend vai para o frontend.
- Preview (Vercel): `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` e
  `FRONTEND_ORIGIN` próprios, apontando para o Neon temporário
  `wispy-forest-67479829` (branch `br-cold-river-bdl1t5dl`), que expira em
  `2026-11-29T14:19:24Z`. Apresente sempre a produção.
- A proteção por login da Vercel (`ssoProtection`) foi desativada para que os
  deploys sejam públicos.
- Arquivos temporários locais (não versionados) usados na operação ficam em
  `C:\Users\JLV\AppData\Local\Temp\opencode\`; nenhum é necessário para apresentar
  ou validar a demo.

## Como retomar (humano ou agente)

1. Trabalhe em `develop` e abra PR para `main`. Não use merge direto em `main`.
2. Para mudar dados da demo em produção, use a API com o token da conta correta;
   não rode `prisma db seed` contra produção.
3. Para futuras migrations em produção, forneça `DIRECT_URL` com acesso ao
   Supabase. Se for necessário um bootstrap temporário, remova código e variável
   no mesmo ciclo e redeploye limpo — como feito aqui.
4. Depois de qualquer alteração em `main`, confirme Pages + Vercel e rode
   `npm.cmd run verify:demo` na raiz. O total atual é 157 checks.
5. Leia [`demo-apresentacao.md`](./demo-apresentacao.md) antes de apresentar e
   [`diagnostico.md`](./diagnostico.md) para entender a arquitetura.
6. Antes de mexer em loading, animação ou cor, leia
   [`visual-system.md`](./visual-system.md). Para SEO, leia
   [`seo.md`](./seo.md); para o panorama de produto,
   [`product/competitive-landscape.md`](./product/competitive-landscape.md).
7. Para validar o frontend localmente, rode `npm.cmd run build` **dentro de**
   `apps/frontend` com `VITE_BASE_URL`, `VITE_API_URL` e
   `VITE_RESEARCH_WHATSAPP`. No Windows use `npm.cmd`.
8. Não aponte um frontend local para a API de produção: o CORS só aceita
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
