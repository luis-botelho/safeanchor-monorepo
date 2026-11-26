# Guia de estudo — estado atual do SafeAnchor

Este resumo ajuda quem está começando a entender o projeto e a escolher uma
primeira tarefa. Para apresentar a demo, use o roteiro autorizado em
[`../demo-apresentacao.md`](../demo-apresentacao.md) e, antes de começar, rode
`node scripts/verify-demo.mjs` na raiz (Node 22). Para o estado operacional, veja
[`../handoff-freeze.md`](../handoff-freeze.md). Para tecnologias e fluxo de uso,
veja [`../diagnostico.md`](../diagnostico.md). Para o tema visual e as regras de
loading e animação, veja [`../visual-system.md`](../visual-system.md). Para SEO e
assets públicos, veja [`../seo.md`](../seo.md).

## Visão geral

O SafeAnchor é um projeto de estudo em monorepo:

- Frontend: React + Vite, SPA hospedada no GitHub Pages.
- Backend: Express 5, hospedado na Vercel.
- Persistência: PostgreSQL (Supabase) com Prisma 7.
- Frontend em MVVM; backend em Route → Controller → Service → Prisma.
- CSS em um único arquivo `.css` com convenção BEM e tokens semânticos.

Objetivo: aprender o fluxo completo entre interface, viewmodel, service, API e
banco, sem frameworks extras como Next.js, TypeScript ou Tailwind nesta fase.

## Estrutura principal

```text
apps/
  frontend/
    src/
      views/         # páginas (o que o usuário vê)
      viewmodels/    # estado e ações da tela (hooks use...ViewModel)
      services/      # chamadas HTTP para a API (inclui researchConsent e directorService)
      components/    # pedaços de UI reutilizáveis (inclui DirectorRoute)
      context/       # autenticação e estado global
      router/        # rotas da SPA (inclui /director/*)
      seo/           # pageMeta.js: metadados das rotas públicas
      mock/          # dados falsos para áreas ainda não conectadas
      styles/global.css          # tokens Maritime Precision + BEM
      views/PrivacyPage.jsx      # política LGPD (/privacidade)
      components/CookieNotice.jsx# aviso de armazenamento local
      components/WhatsAppButton.jsx # botão flutuante de contato
      components/Skeleton.jsx    # bloco de skeleton e região com aria-busy
      components/PageSkeletons.jsx # skeletons por contexto de tela
      components/LoadingFallback.jsx # fallback para telas secundárias
      components/ErrorState.jsx  # erro com mensagem e ação
      components/SubmitButton.jsx # submit com spinner e aria-busy
      components/InlineSpinner.jsx # spinner decorativo de ação
  backend/
    src/
      routes/        # definição dos endpoints
      controllers/   # validação do request e resposta
      services/      # regras de negócio e acesso ao Prisma
      middleware/    # autenticação, autorização e CORS
    prisma/
      schema.prisma  # modelos do banco
      migrations/    # histórico de mudanças do schema
      seed.js        # dados locais de desenvolvimento
```

## O que já funciona de verdade

- Cadastro e login com JWT; token enviado no header `Authorization: Bearer`.
- Frota: listar e criar embarcações com dono (`ownerPartyId`); editar/excluir
  existem na API mas ainda não têm tela roteada.
- Manutenções: listar, criar, histórico por embarcação e dashboard de números.
- Documentos: listar e cadastrar com validade e status (válido/próximo/vencido).
- Inspeções: listar, criar, marcar checklist, concluir com certificado e cancelar.
- Isolamento de dados por usuário/organização (`accessScopeService.js`).
- `/health` no backend e smoke tests de produção.
- Formulário `/pesquisa`: rascunho local e envio por e-mail via Resend (validado);
  captura só com aceite explícito e versionado (`2026-11-26`).
- Rota pública `/privacidade` (LGPD), aviso de armazenamento local e botão
  flutuante de WhatsApp (link `wa.me`, não envio automático). A decisão de
  captura pode ser alterada/revogada ali; `safeanchor.researchConsent` guarda
  decisão, versão e data, e `safeanchor.cookieConsent` registra o aviso lido.
- Área da diretoria publicada: `/director`, `/responses`, `/users` e `/audit`,
  com guard por `roleKey` no frontend e `DIRECTOR`/`ADMIN` no backend; respostas,
  decisões, papéis/personas e auditoria mínima (sem senha ou token).
- Prerender estático de `/`, `/pesquisa` e `/privacidade`, com `noindex` nas
  rotas privadas, `robots.txt`, `sitemap.xml`, favicon e metadados em
  `src/seo/pageMeta.js` .
- Carregamento com skeletons contextuais nas telas principais, fallback nas
  secundárias e spinner inline em ações — todos com `aria-busy` e respeitando
  `prefers-reduced-motion`.

## O que ainda é mock ou está pendente

- Catálogos: marinas, prestadores, jobs, community, eventos, trips, academy e IA.
- Feed de atividades do dashboard e cálculo de prontidão no cliente.
- Upload de arquivos de documentos (Supabase Storage).
- Refresh token e documentação OpenAPI.
- Testes automatizados no frontend (não há script de lint).
- Migrations de `DIRECTOR`, `ResearchResponse` e `DirectorAction` aplicadas em
  produção por bootstrap temporário removido no mesmo ciclo; diretoria,
  consentimento e SEO publicados em produção.

## Tarefas boas para começar

1. **Seguir uma requisição completa:** abra `views/CreateVesselPage.jsx` →
   `viewmodels/useCreateVesselViewModel.js` → `services/vesselService.js` →
   rota `POST /vessels` → `vesselController.js` → `vesselService.js` → Prisma.
   Para uma listagem, comece em `views/FleetPage.jsx` (chama
   `getFleetVessels()` diretamente) → `GET /vessels`.
2. **Rodar local:** configure `.env` apenas no backend (nunca versionado) e rode
   `npm run dev` nos dois apps. Use `npx prisma migrate dev` somente em banco
   local, após conferir para onde aponta `DATABASE_URL`; nunca execute esse
   comando contra o Supabase de produção, nem rode seed ou migrations em
   produção.
3. **Trocar um mock por API:** escolha um catálogo pequeno em `src/mock/` e crie
   o service, o viewmodel e a rota correspondentes.
4. **Escrever um teste:** use os testes existentes em `apps/backend/test/` como
   modelo — `research-consent.test.js` mostra como cobrir recusa, aceite e
   auditoria com banco fake (`npm test` no backend).
5. **Seguir a diretoria:** abra `views/DirectorResponsesPage.jsx` →
   `viewmodels/useDirectorViewModel.js` → `services/directorService.js` →
   `GET /director/responses` → `directorController.js` →
   `directorService.js` → Prisma. Compare com `DirectorRoute.jsx` para ver
   `roleKey` no frontend e `authorizeRoles("DIRECTOR","ADMIN")` no backend.
6. **Melhorar um skeleton:** troque o `LoadingFallback` de uma tela secundária
   por uma variante em `PageSkeletons.jsx` que espelhe o layout real. Antes,
   leia o checklist de aceite em `docs/visual-system.md` e rode o build.

## Cuidados

- Nunca versione `.env` nem credenciais do Supabase.
- `DATABASE_URL` é usada no runtime; `DIRECT_URL` é usada pelo Prisma CLI.
- Trabalhe em `develop` e promova para `main` somente por pull request.
- `persona` escolhe a navegação; `role` autoriza. Não tente liberar a diretoria
  trocando apenas a persona no login — use a conta `diretoria@safeanchor.app`.
- Sem aceite versionado na pesquisa, não envie respostas nem grave no banco; o
  resumo recusado fica só no navegador.
- Não use `transition: all`, shimmer agressivo ou animação infinita: o contrato
  de movimento está em `docs/visual-system.md`.
- Para validar o build no Windows, use `npm.cmd run build` dentro de
  `apps/frontend` (o script não existe na raiz), com as variáveis do build:

  ```powershell
  $env:VITE_BASE_URL="/safeanchor-monorepo/"
  $env:VITE_API_URL="https://safeanchor-monorepo.vercel.app"
  $env:VITE_RESEARCH_WHATSAPP="5524992772357"
  npm.cmd run build
  ```
