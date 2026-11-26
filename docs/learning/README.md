# Guia de estudo — estado atual do SafeAnchor

Este resumo ajuda quem está começando a entender o projeto e a escolher uma
primeira tarefa. Para o estado operacional da demo, veja
[`../handoff-freeze.md`](../handoff-freeze.md). Para tecnologias e fluxo de uso,
veja [`../diagnostico.md`](../diagnostico.md).

## Visão geral

O SafeAnchor é um projeto de estudo em monorepo:

- Frontend: React + Vite, SPA hospedada no GitHub Pages.
- Backend: Express 5, hospedado na Vercel.
- Persistência: PostgreSQL (Supabase) com Prisma 7.
- Frontend em MVVM; backend em Route → Controller → Service → Prisma.
- CSS em arquivos `.css` com convenção BEM.

Objetivo: aprender o fluxo completo entre interface, viewmodel, service, API e
banco, sem frameworks extras como Next.js, TypeScript ou Tailwind nesta fase.

## Estrutura principal

```text
apps/
  frontend/
    src/
      views/         # páginas (o que o usuário vê)
      viewmodels/    # estado e ações da tela (hooks use...ViewModel)
      services/      # chamadas HTTP para a API
      components/    # pedaços de UI reutilizáveis
      context/       # autenticação e estado global
      router/        # rotas da SPA
      mock/          # dados falsos para áreas ainda não conectadas
      styles/        # CSS com BEM
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

## O que ainda é mock ou está pendente

- Catálogos: marinas, prestadores, jobs, community, eventos, trips, academy e IA.
- Feed de atividades do dashboard e cálculo de prontidão no cliente.
- Upload de arquivos de documentos (Supabase Storage).
- Refresh token e documentação OpenAPI.

## Tarefas boas para começar

1. **Seguir uma requisição completa:** abra `views/CreateVesselPage.jsx` →
   `viewmodels/useCreateVesselViewModel.js` → `services/vesselService.js` →
   rota `POST /vessels` → `vesselController.js` → `vesselService.js` → Prisma.
   Para uma listagem, comece em `views/FleetPage.jsx` (chama
   `getFleetVessels()` diretamente) → `GET /vessels`.
2. **Rodar local:** configure `.env` apenas no backend (nunca versionado), rode
   `npx prisma migrate dev` e `npm run dev` nos dois apps.
3. **Trocar um mock por API:** escolha um catálogo pequeno em `src/mock/` e crie
   o service, o viewmodel e a rota correspondentes.
4. **Escrever um teste:** use os testes existentes em `apps/backend/test/` como
   modelo para cobrir uma regra de negócio simples.
5. **Melhorar o empty state:** ajuste um dos componentes `EmptyState` sem mudar
   a API.

## Cuidados

- Nunca versione `.env` nem credenciais do Supabase.
- `DATABASE_URL` é usada no runtime; `DIRECT_URL` é usada pelo Prisma CLI.
- Trabalhe em `develop` e promova para `main` somente por pull request.
