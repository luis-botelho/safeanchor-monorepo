# Diagnóstico técnico — SafeAnchor

**Data:** 2026-11-26 · **Branch:** `develop` · **Demo:** publicada e validada

> Este documento responde a duas perguntas: **quais tecnologias o projeto usa e
> por quê**, e **qual é o fluxo real de uso da aplicação**. Ele também registra
> o estado da demo e os pontos que ainda precisam de trabalho. Para o passo a
> passo operacional de deploy/migrations, veja
> [`handoff-freeze.md`](./handoff-freeze.md).

---

## 1. Resumo executivo

O SafeAnchor é uma SPA (Single Page Application) de estudo para gestão de
embarcações, organizada em monorepo com duas aplicações independentes:

- **Frontend:** React + Vite, publicado no **GitHub Pages**.
- **Backend:** Express 5 + Prisma 7 + PostgreSQL (Supabase), publicado na
  **Vercel**.

Não há workspaces npm na raiz: cada app tem `package-lock.json` próprio e os
scripts do `package.json` raiz apenas delegam (`install:all`, `dev:frontend`,
`dev:backend`, `start:backend`). Isso mantém o projeto fácil de ler, mas exige
instalar dependências duas vezes.

A jornada principal — **login → dashboard → frota → embarcação → manutenção /
documentos / inspeções → prontidão operacional** — está implementada com dados
reais e autenticação JWT. A demonstração de hoje está no ar nos dois lugares,
com `/health` `200`, schema atualizado, usuário demo e dados semeados pela API.

O projeto segue uma regra explícita de simplicidade (`AGENTS.md`): sem Next.js,
TypeScript ou Tailwind nesta fase; arquivos pequenos e didáticos; uma versão
simples antes de qualquer abstração.

---

## 2. Arquitetura de implantação

| Camada | Plataforma | URL | Papel |
|---|---|---|---|
| Interface | GitHub Pages (Actions) | https://luis-botelho.github.io/safeanchor-monorepo/ | Serve os arquivos estáticos gerados pelo Vite |
| API | Vercel (serverless Node) | https://safeanchor-monorepo.vercel.app | Express com rotas REST e Prisma |
| Banco | Supabase (PostgreSQL) | projeto `dwfxcrmsaliaxfbnwdci` | Persistência das entidades |
| Preview da API | Vercel + Neon temporário | `...-git-develop-...vercel.app` | Validação de PRs |

O frontend e o backend são **projetos de deploy separados**. O Pages não executa
Node: ele apenas hospeda HTML/CSS/JS. A comunicação acontece por HTTP, com
`VITE_API_URL` (injeta no build via GitHub Actions) apontando para a API de
produção e CORS liberado apenas para a origem
`https://luis-botelho.github.io`.

Detalhes do build do frontend que importam para rotas diretas:

- `VITE_BASE_URL=/safeanchor-monorepo/` define o `base` do Vite
  (`apps/frontend/vite.config.js`).
- `BrowserRouter` usa `basename = import.meta.env.BASE_URL` sem a barra final
  (`src/main.jsx`).
- O build (`vite build` + `scripts/prerender.mjs`) gera HTML estático para `/`,
  `/pesquisa` e `/privacidade`, além de `robots.txt`, `sitemap.xml` e
  `404.html` com `noindex`; links como `/fleet/abc` abertos diretamente
  funcionam no Pages pelo fallback da SPA. Metadados em `src/seo/pageMeta.js`
  (detalhes em [`seo.md`](./seo.md)).
- O deploy do Pages dispara somente quando mudam `apps/frontend/**` ou o próprio
  workflow; mudanças apenas em `docs/**` não publicam nada.
- Não existe workflow versionado de deploy do backend: a Vercel publica via
  integração com o repositório.

**Ponto crítico de configuração:** `DATABASE_URL` é usada em runtime (queries da
API, via adapter `pg`/pooler) e `DIRECT_URL` é usada pelo Prisma CLI
(`prisma.config.ts` → `datasource.url`). O `schema.prisma` não declara `url` no
bloco `datasource` porque a v7 usa `engineType = "client"` e adapter. Inverter
as URLs causa erros de lock/prepared statement em ambientes com pooler — foi o
tipo de problema enfrentado na subida da demo.

---

## 3. Pesquisa das tecnologias usadas

As versões **declaradas** vêm dos `package.json`; entre parênteses estão as
versões **resolvidas** nos `package-lock.json`. As afirmações sobre comportamento
foram conferidas na documentação oficial em 2026-11-26.

### 3.1 Frontend

| Tecnologia | Versão | O que é / por que usar | Uso no SafeAnchor | Referência |
|---|---|---|---|---|
| **React** | `^19.0.0` (19.2.7) | Biblioteca de UI baseada em componentes. A documentação oficial recomenda um framework, mas aceita explicitamente montar uma SPA "do zero" com um build tool quando se quer aprender ou há restrições — é o caso aqui. | `createRoot` e `StrictMode` em `src/main.jsx`; componentes em `views/` e `components/`. | [react.dev — Build a React App from Scratch](https://react.dev/learn/build-a-react-app-from-scratch) |
| **Vite** | `^7.0.0` (7.3.8) | Build tool com dev server rápido e bundling estático, ideal para Pages. | `vite.config.js` com `@vitejs/plugin-react` 5.2.0 e `base` configurável; `scripts/prerender.mjs` roda depois do build. | [react.dev — Vite](https://react.dev/learn/build-a-react-app-from-scratch#vite) |
| **React Router** | `^7.18.1` (7.18.7) | Navegação declarative da SPA, com rotas protegidas e `basename`. | `src/router/AppRouter.jsx` e `components/ProtectedRoute.jsx`. | [react.dev — Routing](https://react.dev/learn/build-a-react-app-from-scratch#routing) |
| **MVVM** | padrão (sem lib) | Separa View (UI), ViewModel (estado/lógica) e Model (dados/API). Revisão de literatura aponta desacoplamento/testabilidade como benefícios e ViewModel sobrecarregado/boilerplate como riscos. | 19 hooks `use*ViewModel`; services em `src/services/`; views em `src/views/`. | [MVVM Revisited (arXiv, 2025)](https://arxiv.org/html/2504.18191v1) |
| **BEM** | convenção CSS | Block / Element / Modifier: classes previsíveis, sem selects de tag/ID, reduzindo colisões do cascade. | Classes como `app-shell__link--active` no único arquivo CSS do projeto, `src/styles/global.css`. | [getbem.com — Introduction](https://getbem.com/introduction/) |

> **Por que não Next.js?** A documentação do React lembra que uma SPA exige
> implementar roteamento, data fetching e code splitting por conta própria, e
> que um framework integrado seria a escolha habitual. Aqui a escolha é
> didática: separar backend/frontend deixa o contrato REST explícito e fácil de
> inspecionar. A adesão ao MVVM, porém, é **parcial**: fluxos de criação e
> inspeções seguem o padrão, mas várias listagens ainda fazem `useEffect` +
> `fetch` direto na View. Existem também views e viewmodels órfãos (ver §8).

### 3.1.1 Sistema visual e estados de carregamento

A reformulação visual em produção (PR #177, 26/11/2026) segue o tema
**Maritime Precision**, vindo da pasta de referência
`stitch_safeanchor_maritime_ux_architecture/`. Ele foi traduzido para
tokens semânticos em `src/styles/global.css` (Light Mist, Deep Ocean Navy,
Abyss Teal e Sea Teal; bordas hairline e raio 4 px), mantendo BEM e sem Tailwind.
O contrato e as fontes consultadas estão em
[`visual-system.md`](./visual-system.md).

Antes da reformulação não existia nenhum skeleton: o carregamento era sempre
`<p>Carregando...</p>` e uma animação `fade-in` estava declarada sem `@keyframes`.
Agora há quatro primitivas — `Skeleton`/`SkeletonRegion`, `PageSkeletons`,
`LoadingFallback`, `ErrorState` — e `SubmitButton`/`InlineSpinner` para ações.
Skeleton é para layout conhecido (1–10 s); ação usa spinner inline; erro e vazio
têm explicação e saída. Tudo respeita `prefers-reduced-motion`.

### 3.2 Backend

| Tecnologia | Versão | O que é / por que usar | Uso no SafeAnchor | Referência |
|---|---|---|---|---|
| **Node.js** | `>=22` | Runtime local e da função serverless. | `src/server.js`: escuta na porta 3001 fora da Vercel; na Vercel apenas exporta o app. | [expressjs.com — Migrating 5](https://expressjs.com/guide/migrating-5) |
| **Express** | `^5.0.0` (5.2.1) | Framework HTTP minimalista. A v5 encaminha promises rejeitadas em handlers async para o error handler. | Rotas, middleware de auth/CORS e handler global em `src/app.js`. | [Introducing Express v5](https://expressjs.com/2024/10/15/v5-release) |
| **jsonwebtoken** | `^9.0.3` (9.0.3) | Emissão/verificação de JWT e do nonce de consentimento. | `POST /auth/login` devolve token com `userId`, `partyId`, `role` (`USER`/`MANAGER`/`ADMIN`/`DIRECTOR`), `persona`, `jti`, `iss` e `aud`, validade de **15 minutos**; `requireAuth` valida o `Bearer` em HS256 e reconsulta o papel. | [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519) |
| **bcrypt** | `^6.0.0` (6.0.0) | Hash de senha com salt. | Custo 12 no cadastro, 10 no seed local. | OWASP Password Storage Cheat Sheet |
| **CORS** | `^2.8.6` (2.8.6) | Controle de origens permitidas. | `FRONTEND_ORIGIN` + localhost em dev; requisições sem `Origin` passam (health/curl); origem não autorizada → 403. | [MDN — CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) |
| **dotenv** | `^17.4.2` | Carrega `.env` apenas fora da Vercel. | `prisma.config.ts` e `src/lib/prisma.js`. | [dotenv](https://github.com/motdotla/dotenv) |
| **pino / pino-http** | `^10.3.1` / `^11.0.0` | Logs JSON estruturados com request id e redaction de segredos. | `src/app.js` redacta `authorization`, `cookie`, `password`, `passwordHash`. | [getpino.io](https://getpino.io/) |
| **Resend** | `^6.32.0` (6.32.0) | E-mail transacional. | `POST /research` envia o resumo da pesquisa. | [resend.com/docs](https://resend.com/docs) |

### 3.3 Dados

| Tecnologia | Versão | O que é / por que usar | Uso no SafeAnchor | Referência |
|---|---|---|---|---|
| **Prisma ORM** | `^7.9.1` (client 7.9.1, CLI 7.10.1) | Schema declarativo, migrations e client gerado. A v7 exige driver adapters para todas as conexões. | `prisma/schema.prisma`, `prisma.config.ts` com `DIRECT_URL`, client em `src/lib/prisma.js`. | [Prisma 7 — PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql) |
| **@prisma/adapter-pg + pg** | `^7.9.1` / `^8.22.0` | Adapter que executa queries geradas pelo Prisma via driver `pg` sobre TCP. | `new PrismaPg({ connectionString: DATABASE_URL })`. | [Prisma 7 — Database drivers](https://www.prisma.io/docs/orm/core-concepts/supported-databases/database-drivers) |
| **PostgreSQL / Supabase** | — | Banco relacional gerenciado; Supabase fornece pooler (Supavisor) e injeta variáveis na Vercel via Marketplace. | Tabelas `User`, `Party`, `Organization`, `Membership`, `Vessel`, `Maintenance`, `Document`, `Inspection`, checklists, `ResearchResponse` e `DirectorAction` (aplicadas em produção por bootstrap temporário removido). | [Supabase — Connect to Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres) e [Vercel Marketplace](https://supabase.com/docs/guides/integrations/vercel-marketplace) |
| **Neon (preview)** | — | Postgres efêmero com branches, usado só no Preview. | Projeto temporário `wispy-forest-67479829`, expira em 29/11/2026. | [Prisma 7 — PostgreSQL (Neon)](https://www.prisma.io/docs/orm/overview/databases/postgresql) |

> **Lição aprendida na demo:** a integração Supabase/Vercel cria `POSTGRES_*` e
> `SUPABASE_*`, mas o código lê `DATABASE_URL`/`DIRECT_URL`. Além disso, a CLI da
> Vercel não devolve secrets — por isso as três migrations precisaram ser
> aplicadas por um caminho temporário dentro do próprio runtime. O detalhe
> operacional está no handoff.

### 3.4 Infraestrutura e entrega

| Tecnologia | Função | Referência |
|---|---|---|
| **Vercel** | Deploy serverless do Express, aliases de produção/preview, variáveis de ambiente e integração com Supabase. | [Vercel](https://vercel.com/docs) |
| **GitHub Actions** | CI (Node 22, `npm ci`, `prisma generate/validate`, testes e build) e deploy do frontend. Não há workflow de deploy do backend. | [GitHub Pages com Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) |
| **GitHub Pages** | Hosting estático da SPA; workflow gera `404.html` para fallback de rotas client-side. | [Deploying your website automatically](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically) |

---

## 4. Como o código está organizado

### 4.1 Frontend — MVVM em três camadas

```text
View (src/views/*.jsx)            → o que o usuário vê; quase sem lógica
ViewModel (src/viewmodels/*.js)   → useState/useEffect, validação e ações
Service (src/services/*.js)       → apiFetch + endpoints da API (ou mocks)
Context (src/context/AuthContext) → sessão, login, logout, perfil
```

Exemplos concretos:

- `CreateVesselPage.jsx` → `useCreateVesselViewModel` → `vesselService.createVessel` → `POST /vessels`.
- `CreateDocumentPage.jsx` → `useCreateDocumentViewModel` → `documentService.createDocument` → `POST /documents`.
- `InspectionDetailPage.jsx` → `useInspectionDetailViewModel` → `PATCH /inspections/:id/checklist/:itemIndex`, `POST /inspections/:id/complete` e `/cancel`.
- `CreateMaintenancePage.jsx` → `useCreateMaintenanceViewModel` → `maintenanceService.createMaintenance` → `POST /maintenances`.
- `ResearchPage.jsx` → `useResearchViewModel` → `researchConsent.js` (decisão
  versionada) + `researchService.js` → `POST /research`; sem aceite não há
  chamada HTTP.
- `DirectorResponsesPage.jsx`/`DirectorUsersPage.jsx` → `useDirectorViewModel` →
  `directorService.js` → `GET/PATCH /director/*` publicados.

`src/services/api.js` mantém o token apenas em memória, envia
`Authorization: Bearer ...`, trata `204` e dispara `auth:unauthorized` em `401`.
`AuthContext` mantém o perfil em memória e chama `POST /auth/logout` ao sair.
Não há `localStorage` para sessão: ao recarregar, o usuário entra de novo. O
token expira em 15 min e **não há refresh**.

Os services são adaptadores: normalizam status e datas para as views. Alguns
importam metadados de `src/mock/` (por exemplo `vesselStatusMeta` e categorias
de documento), mas os dados em si vêm da API nos fluxos core.

### 4.2 Backend — Route → Controller → Service → Prisma

```text
src/routes/*.js         → método + path + middleware (ex.: authorizeRoles)
src/controllers/*.js    → valida body, chama service, escolhe status HTTP
src/services/*.js       → regras de negócio e escopo; chama Prisma
src/middleware/*.js     → requireAuth, authorizeRoles, CORS, logs
src/lib/prisma.js       → PrismaClient com PrismaPg(DATABASE_URL)
```

`accessScopeService.js` é o coração do isolamento: para usuários comuns monta
`partyIds = [partyId do usuário, partyIds das organizações]`; os filtros
`buildVesselScopeFilter` e `buildVesselLinkedScopeFilter` reaplicam o escopo em
embarcações e entidades ligadas. ADMIN vê tudo. A autorização de escrita usa
**role** (`USER`, `MANAGER`, `ADMIN`); a área da diretoria usa `DIRECTOR`/`ADMIN`
com `authorizeRoles("DIRECTOR","ADMIN")` e, no frontend, `DirectorRoute` exige
`roleKey` equivalente. A `persona` (`OWNER`, `SERVICE_PROVIDER`, `MARINA`)
aparece no perfil/token, mas no backend ela não decide permissão — no frontend
ela só escolhe o menu/painel. Não existe conta pública de `DIRECTOR`: a
diretoria é provisionada fora do repositório.

Endpoints principais (os protegidos vêm depois de `requireAuth` em `app.js`):

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/`, `/health` | Identidade da API e checagem real de banco (`SELECT 1`) |
| POST | `/auth/register`, `/auth/login`, `/auth/logout` | Cadastro, login e revogação do token |
| GET | `/auth/me` | Perfil do token |
| GET | `/research/nonce` | Nonce assinado (10 min) para o aceite da pesquisa |
| POST | `/research` | Pesquisa: só grava `ResearchResponse` e envia pelo Resend com nonce válido e aceite versionado (`2026-11-26`) |
| GET | `/modules` | Módulos fixos do produto |
| GET/POST/PUT/DELETE | `/vessels`, `/vessels/:id` | CRUD da frota |
| GET | `/vessels/:id/maintenances`, `/vessels/:id/inspections` | Histórico por embarcação |
| GET/POST | `/maintenances`, `/maintenances/dashboard` | Manutenções e indicadores |
| GET/POST | `/preventive-maintenances` | Manutenção preventiva |
| GET/POST | `/checklist-templates`, `/checklist-executions` | Templates e execuções |
| GET/POST | `/documents`, `/documents/vessel/:vesselId` | Documentos |
| GET/POST | `/inspections`, `/inspections/vessel/:vesselId` | Inspeções |
| PATCH/POST | `/inspections/:id/checklist/:itemIndex`, `/complete`, `/cancel` | Checklist e ciclo de vida |
| GET | `/director/responses`, `/insights`, `/users`, `/actions` | Leitura da diretoria: respostas, resumo, usuários e auditoria (publicado) |
| PATCH | `/director/users/:id`, `/responses/:id` | Alteração de papel/persona e de decisão/status, com auditoria (publicado) |

> A pasta `src/models/` do backend existe, mas nenhum arquivo a importa: no
> fluxo real o modelo é o `schema.prisma`.

---

## 5. Fluxo de uso da aplicação

### 5.1 Mapa de rotas da SPA

Públicas: `/` (introdução), `/pesquisa`, `/login`, `/register` e `/privacidade`
(política LGPD). O aviso de armazenamento local (`CookieNotice`) e o botão
flutuante de WhatsApp aparecem em todas as páginas quando configurados.

Protegidas: `/dashboard`, `/fleet`, `/fleet/:id`, `/fleet/new`, `/maintenance`,
`/maintenance/new`, `/documents`, `/documents/new`, `/inspections`,
`/inspections/new`, `/inspections/:id`, `/profile`, além das rotas de marinas,
prestadores, solicitações, viagens, aluguel, eventos, community, marketplace,
jobs e IA. Em `develop`, há também as rotas da diretoria: `/director`,
`/director/responses`, `/director/users` e `/director/audit`. Qualquer rota
desconhecida redireciona para `/`.

`ProtectedRoute` só verifica se há usuário; sem token ele redireciona para
`/login`. `DirectorRoute` acrescenta a checagem de `roleKey` (`DIRECTOR`/`ADMIN`)
e devolve os demais para `/dashboard`. As rotas diretas funcionam no Pages por
causa do `404.html`; as públicas têm HTML prerenderizado e as privadas são
`noindex`.

### 5.2 Jornada principal, passo a passo

1. **Entrar** — a tela inicial tem dois cards: "Responder a pesquisa" e "Ver a
   demonstração". O texto "Não precisa criar conta" vale para a pesquisa; a área
   autenticada exige credenciais reais. Em `/login`, use os botões **"Acessos de
   demonstração"** (proprietário, prestador e marina) ou a conta legada
   `demo@safeanchor.test` / `demo123456`. Não há botão de diretoria; ela exige
   conta `DIRECTOR` privada. Os demais perfis abrem `/dashboard`.
2. **Pesquisa (opcional)** — `/pesquisa` começa com **"Aceitar captura"** ou
   **"Recusar captura"** (versão `2026-11-26`, registrada em
   `safeanchor.researchConsent` com decisão e data). Com aceite, o rascunho em
   `safeanchor.research.draft` é enviado por `POST /research`, as respostas ficam
   em `safeanchor.researchResponses` e no banco (`ResearchResponse`), e o e-mail
   sai **automaticamente** pelo Resend para `RESEARCH_INBOX` (envio validado em
   26/11/2026, com recebimento confirmado). Com recusa, nada vai ao servidor nem
   ao banco: o resumo fica só no navegador. Em ambos os casos há alternativas
   manuais na própria página: link `mailto:` e link `wa.me` com o resumo
   preenchido — o WhatsApp é clique do usuário, nunca envio automático. A escolha
   pode ser alterada/revogada em `/privacidade`, onde
   `safeanchor.cookieConsent` registra apenas a leitura do aviso. Não há cookies
   de rastreamento, analytics ou publicidade. O botão flutuante
   `WhatsAppButton` usa o mesmo número quando `VITE_RESEARCH_WHATSAPP` está
   definido no build.
3. **Autenticar** — `LoginPage` → `AuthContext.login` → `POST /auth/login`. Token
   e perfil ficam apenas em memória; `/auth/logout` revoga o `jti`. `/register`
   envia `POST /auth/register` (nome, e-mail, senha mínima de 12 caracteres e
   persona) e faz login automático. Em `401`, a sessão é limpa.
4. **Dashboard** (`/dashboard`) — `PersonaDashboardPage` escolhe o painel conforme
   `persona`. `DashboardPage` faz **4 chamadas em paralelo**
   (`GET /vessels`, `/maintenances`, `/documents`, `/inspections`) e calcula
   prontidão no cliente. O feed "Atividade recente" vem de mock e a própria tela
   avisa "Sugestões geradas localmente".
5. **Frota** (`/fleet`) — `GET /vessels` lista embarcações do escopo do usuário;
   capas vêm de `picsum.photos`. `/fleet/new` cria via `POST /vessels` (nome,
   tipo e status obrigatórios; categoria, comprimento, ano, motor, registro,
   localização, missão e `imageSeed` opcionais). `/fleet/:id` busca
   `GET /vessels/:id`, `GET /maintenances` e `GET /documents/vessel/:id`.
   **A edição/exclusão existe na API, mas não há tela roteada para ela.**
6. **Manutenção** (`/maintenance`) — deriva de `GET /maintenances` + `GET /vessels`;
   separação entre abertas/concluídas e filtros são feitos no navegador.
   `/maintenance/new` envia `vesselId`, título, descrição, tipo, data e status
   como texto livre. O endpoint `GET /maintenances/dashboard` existe e responde
   `total`, preventivas, corretivas, pendentes e concluídas, **mas a página
   `MaintenanceDashboardPage` não está registrada no roteador**.
7. **Documentos** (`/documents`) — `GET /documents` ordenado por vencimento;
   resumo válido/expirando/vencido é calculado no cliente (≤30 dias = "próximo").
   `/documents/new` cadastra metadados (com as categorias Seguro, Vistoria,
   Registro, Certificado, Inspeção e Habilitação). **Não há input de arquivo.**
8. **Inspeções** (`/inspections`) — lista agrupada em andamento/agendadas/
   concluídas. `/inspections/new` converte data + hora para ISO e envia checklist
   padrão de 5 itens. `/inspections/:id` permite marcar itens
   (`PATCH .../checklist/:itemIndex`, que muda o status para `IN_PROGRESS`),
   concluir (certificado com 6 meses de validade se não houver falha) ou
   cancelar. As telas de templates/execuções de checklist e histórico existem no
   código, mas **não estão roteadas**.
9. **Prontidão** — heurística do cliente no dashboard. No detalhe da embarcação,
   `toVessel` devolve `readiness: null`, então o medidor não usa o mesmo cálculo:
   há inconsistência visual entre as duas telas.
10. **Diretoria (publicado)** — `/director` resume as capturas;
   `/director/responses` filtra por `status`, `profile` e `city` e registra
   decisão/status; `/director/users` altera papel/persona; `/director/audit`
   mostra ator, alvo, ação, antes/depois e data. Backend exige
   `DIRECTOR`/`ADMIN` e frontend exige `roleKey` equivalente; a auditoria nunca
   guarda senha ou token.

### 5.3 Áreas ainda em mock ou inalcançáveis pela UI

- **Mock (não persistem):** marinas, prestadores, solicitações de serviço, jobs,
  community, eventos, marketplace, viagens, aluguel de barcos, academy, IA,
  reservas, equipe, ocupação e feed de atividades do dashboard. `/profile`
  mistura dados reais e mock.
- **Órfãs (código existe, rota não):** 16 views não são importadas pelo
  `AppRouter`, incluindo `MaintenanceDashboardPage`, `MaintenanceHistoryPage`,
  `PreventiveMaintenancesPage`, `CreatePreventiveMaintenancePage`,
  `ChecklistTemplatesPage`, `ChecklistExecutionsPage`, `InspectionHistoryPage`,
  `EditVesselPage`, `VesselsPage` e `VesselDetailsPage`. Os links antigos que
  caíam no redirecionamento para `/` foram removidos do `AppShell`; ainda assim,
  as APIs de preventivas e checklists não são alcançáveis pela interface.

---

## 6. Estado da demo validada em 2026-11-26

| Verificação | Resultado |
|---|---|
| Página no GitHub Pages | `200` |
| Bundle contém a URL da API de produção | sim |
| `POST /auth/login` (contas demo publicadas) | `200` + JWT para cada uma |
| `GET /vessels` | `200` · 3 itens no proprietário (2 no prestador e na marina) |
| `GET /maintenances` | `200` · 5 itens no proprietário (2 no prestador e na marina) |
| `GET /maintenances/dashboard` | `200` · `total=5` no proprietário, `total=2` no prestador e na marina |
| `GET /documents` | `200` · 5 itens no proprietário (2 no prestador e na marina) |
| `GET /inspections` | `200` · 4 itens no proprietário (1 no prestador e na marina), com certificado |
| CORS com `Origin: https://luis-botelho.github.io` | `Access-Control-Allow-Origin` correto em todas |
| `/health` em produção | `200`, `database: "up"` |
| Endpoint temporário `/__setup` | removido (retorna `401` do `requireAuth`) |
| `POST /research` (formulário de feedback) | `202` + id do Resend; e-mail recebido e confirmado |
| Rota pública `/privacidade` | política LGPD com controlador, bases legais, compartilhamento, retenção e direitos |
| `VITE_RESEARCH_WHATSAPP` no bundle | número `5524992772357` (55 + DDD) no build corrente; `wa.me` gerado com mensagem inicial |
| Aviso de armazenamento local | `CookieNotice` com aceite em `safeanchor.cookieConsent` |
| Skeletons contextuais | 8 telas principais + `LoadingFallback` nas secundárias; `aria-busy` e pulse finito |
| Submit assíncrono | 10 formulários com spinner inline, `disabled` e rótulo de largura estável |
| SEO (`docs/seo.md`) | prerender das três rotas públicas, `noindex` nas privadas, `robots.txt`, `sitemap.xml`, favicon e og-image (publicado) |
| Consentimento da pesquisa | aceite/recusa versionados; `npm test` cobre recusa sem gravação e aceite com `ResearchResponse` (publicado) |
| Área da diretoria | rotas `/director/*` com `roleKey` no frontend e `authorizeRoles("DIRECTOR","ADMIN")` no backend (publicado) |

> As três últimas linhas estão publicadas e validadas em produção. A validação
> final do verificador versionado fechou 157/157 checks; o detalhamento está no
> handoff.

> **Nota para a apresentação:** o dashboard e as listagens core mostram dados
> reais; as áreas de catálogo e o feed de atividade são mock. A tela inicial
> sugere que não é preciso criar conta, mas o login com a conta demo é necessário.

---

## 7. Pontos fortes

- **Contrato explícito entre camadas.** REST + MVVM + Route/Controller/Service
  facilitam seguir uma requisição do clique até o SQL — ótimo para estudo.
- **Isolamento de acesso real**, aplicado de forma consistente em vessels,
  manutenções, documentos, inspeções e execuções de checklist.
- **Prisma 7 moderno**, com driver adapter e separação correta entre
  `DATABASE_URL` (runtime/pooler) e `DIRECT_URL` (CLI/migrations).
- **Deploy duplo bem definido**: estático no Pages, serverless na Vercel, sem
  acoplamento além de HTTP + CORS; fallback `404.html` para rotas diretas.
- **Observabilidade**: pino estruturado, request id, redaction de segredos e
  `/health` com checagem real de banco.
- **Segurança reforçada após auditoria**: bcrypt, JWT curto com `jti`, logout com
  revogação, sessão apenas em memória, nonce de consentimento, rate limit e
  headers/CSP em Report-Only. Veja `security-hardening.md`.
- **Seed protegido e idempotente** (`ALLOW_DATABASE_SEED=true`), documentado no
  handoff.
- **Documentação operacional**: handoff, rebaseline, guia de estudo e este
  diagnóstico descrevem o "por quê" e o "como retomar".

## 8. Riscos e limitações

| Item | Impacto | Situação |
|---|---|---|
| Migrations em produção dependem de segredo não lido pela CLI | Bloqueia evolução do schema | As duas migrations novas (`DIRECTOR` e consentimento) foram aplicadas por
bootstrap temporário removido no mesmo ciclo |
| Banco do Preview é temporário (expira 29/11) | Preview pode quebrar | Reivindicar ou substituir |
| JWT de 15 min sem refresh, apenas em memória | Ao recarregar exige novo login; protege contra roubo via XSS persistido | Aceitável no MVP; refresh no roadmap |
| Persona é só navegação; `ProtectedRoute` checa presença, não `role` | Menu por persona não autoriza | `DirectorRoute` já exige `roleKey` `DIRECTOR`/`ADMIN`; estender às demais rotas |
| 16 views não roteadas (links órfãos antigos já removidos) | APIs prontas parecem inexistentes | Corrigir `AppRouter` para preventivas e checklists |
| Captura da pesquisa depende de aceite explícito, nonce do servidor e versão `2026-11-26` | Respostas recusadas ou sem nonce não entram na diretoria | Comportamento desejado; recusa mantém o resumo só no navegador |
| WhatsApp é link manual (`wa.me`), não envio automático | Depende de clique do usuário; sem disparo server-side | Aceito na demo; automatizar exige API business/Twilio |
| Upload de documentos ausente | Documentos são só metadados | Pendente (Supabase Storage) |
| Prontidão calculada no cliente; detalhe devolve `readiness: null` | Métricas inconsistentes | Levar regra para o backend |
| Status/tipo em texto livre nos formulários | Valores como "Ativa" vs "OPERACIONAL" | Usar enums/selects |
| RLS habilitado sem policies; escopo real está no backend | Falsa sensação de segurança | Documentar policies ou reforçar defesa em profundidade |
| Templates de checklist globais e execução sem validar template | Escopo pode ser burlado via API | Aplicar `accessScopeService` também ali |
| Muitos catálogos em mock + texto "dados sincronizados com a API" | Demo mistura real/falso | Ajustar textos ou conectar dados |
| Divergência de doc/config | Node 22 e CSS BEM global precisavam de alinhamento | Resolvido: READMEs atualizados para Node 22 e `global.css` com tokens |
| 3 vulnerabilidades high transitivas do Prisma 7 (`effect`) | Alerta no audit | Resolvido com override para `effect@3.22.5`; Prisma 7 mantido e `npm audit` 0 |
| Sem lint, testes de componente, OpenAPI ou scanner no CI | Dívida de engenharia | Rate limiting e validação já implementados; priorizar o restante |

---

## 9. Recomendações priorizadas

1. **Manter a demo publicada congelada** após o merge do PR #179 (acessos de
   demonstração, correção de perfil e verificação versionada — o total exato de
   checks está no handoff); a diretoria, o consentimento e o SEO seguem em
   `develop` via PR, sem merge direto em `main`.
2. **Corrigir as rotas órfãs e os links quebrados** do `AppShell`, pelo menos para
   `/maintenances`, `/preventive-maintenances`, `/checklist-templates` e
   `/checklist-executions` — hoje parecem features faltando quando estão prontas.
3. **Substituir o Neon do Preview** por um banco estável antes de 29/11/2026.
4. **Guardar `DIRECT_URL` de produção** em local seguro (fora do repo) para a
   próxima migration; não depender de endpoint temporário.
5. **Implementar upload de documentos** com Supabase Storage, mantendo os
   metadados atuais.
6. **Levar a prontidão para o backend** (`readiness` calculado em service) e
   alinhar o detalhe da embarcação.
7. **Adicionar refresh token rotacionado** e autorização por persona onde fizer
   sentido; validação leve de request e rate limit já estão implementados.
8. **Reduzir mocks visíveis** na apresentação e corrigir o texto da tela inicial.
9. **Manter a área da diretoria e o consentimento** em produção; após qualquer
   mudança, valide com os 157 checks do verificador versionado.
10. **Concluir as ações externas da auditoria** (rotação de senha/`JWT_SECRET`,
    remoção da conta antiga e decisão sobre limpeza de histórico), conforme
    `security-hardening.md`.

---

## 10. Fontes consultadas

- React: [Creating a React App](https://react.dev/learn/creating-a-react-app),
  [Build a React App from Scratch](https://react.dev/learn/build-a-react-app-from-scratch),
  [Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app).
- Express: [Introducing Express v5](https://expressjs.com/2024/10/15/v5-release),
  [Migrating 5](https://expressjs.com/guide/migrating-5),
  [Writing middleware](https://expressjs.com/en/5x/guide/writing-middleware).
- Prisma: [PostgreSQL (v7)](https://www.prisma.io/docs/orm/overview/databases/postgresql),
  [Database drivers](https://www.prisma.io/docs/orm/core-concepts/supported-databases/database-drivers),
  [Database connections](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections),
  [Upgrade to Prisma ORM 7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7).
- Supabase: [Connect to Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres),
  [Serverless drivers](https://supabase.com/docs/guides/database/connecting-to-postgres/serverless-drivers),
  [Vercel Marketplace](https://supabase.com/docs/guides/integrations/vercel-marketplace).
- GitHub: [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site),
  [Deploying your website automatically](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).
- Padrões: [MVVM Revisited — revisão de literatura (2025)](https://arxiv.org/html/2504.18191v1),
  [BEM — Introduction](https://getbem.com/introduction/).
- Código do projeto: `apps/frontend/src/**`, `apps/backend/src/**`,
  `apps/backend/prisma/schema.prisma`, `.github/workflows/`, `AGENTS.md`.
