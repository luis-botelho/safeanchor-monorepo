# SafeAnchor

Projeto de estudo para aprender React, backend simples e organizacao de codigo aos poucos.

Nesta versao, vamos evitar complexidade: sem Next.js, sem TypeScript, sem Prisma e sem monorepo avancado por enquanto. A meta e entender bem o basico antes de crescer.

## Estrutura

```text
safeanchor-monorepo
├── apps
│   ├── frontend   # React com Vite, MVVM e CSS BEM
│   └── backend    # Express simples com rotas, controllers e services
└── docs           # Roteiro de aprendizado
```

## Como Instalar

Na raiz do projeto:

```bash
npm run install:all
```

## Como Rodar

Em um terminal, rode o backend:

```bash
npm run dev:backend
```

Em outro terminal, rode o frontend:

```bash
npm run dev:frontend
```

Enderecos:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3001
API:      http://localhost:3001/modules
```

## O Que Estudar Primeiro

1. Abra `apps/frontend/src/views/App.jsx`.
2. Veja como a View usa o ViewModel.
3. Abra `apps/frontend/src/viewmodels/useHomeViewModel.js`.
4. Veja como o ViewModel busca dados no Service.
5. Abra `apps/frontend/src/services/moduleService.js`.
6. Veja como o Service chama o backend.
7. Abra `apps/backend/src/server.js`.
8. Siga o caminho da rota `/modules`.

## Tarefas Pequenas

- [ ] Trocar o texto do titulo no ViewModel.
- [ ] Alterar uma cor no CSS BEM.
- [ ] Adicionar um novo modulo no backend.
- [ ] Criar um novo campo chamado `difficulty`.
- [ ] Mostrar esse campo no card do frontend.

