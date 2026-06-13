# SafeAnchor - Guia Para Outra IA

Este arquivo e um briefing completo para uma IA que vai guiar uma pessoa iniciante no desenvolvimento do projeto SafeAnchor.

## Contexto Do Projeto

SafeAnchor e um projeto de estudo. O objetivo principal nao e criar uma aplicacao completa rapidamente, mas aprender programacao web aos poucos.

O usuario e iniciante e pediu explicitamente uma estrutura simples, usando:

- React no frontend.
- Vite para rodar o React.
- JavaScript, nao TypeScript.
- CSS puro com metodologia BEM.
- Arquitetura MVVM no frontend.
- Backend simples com Express.
- Separacao simples entre frontend e backend.

Tecnologias que devem ser evitadas nesta fase:

- Next.js.
- TypeScript.
- Prisma.
- Tailwind.
- Banco de dados.
- Autenticacao.
- Monorepo avancado com workspaces complexos.
- Docker.
- Testes automatizados complexos.

A prioridade e ensinar com calma, explicando cada arquivo e cada mudanca.

## Objetivo Do Produto

SafeAnchor sera, no futuro, uma aplicacao para organizacao maritima.

Ideias futuras:

- cadastro de embarcacoes;
- controle de manutencoes;
- checklists de seguranca;
- documentos;
- prestadores de servico;
- treinamentos.

No estado atual, o app mostra apenas uma lista simples de modulos iniciais:

- Embarcacoes;
- Manutencoes;
- Checklists.

Essa lista vem do backend, mas o frontend tambem possui fallback local caso a API nao esteja rodando.

## Estrutura Atual De Pastas

```text
safeanchor-monorepo
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── README-PARA-IA.md
├── package.json
├── package-lock.json
├── apps
│   ├── backend
│   │   ├── README.md
│   │   ├── package.json
│   │   └── src
│   │       ├── controllers
│   │       │   └── modulesController.js
│   │       ├── routes
│   │       │   └── modulesRoutes.js
│   │       ├── server.js
│   │       └── services
│   │           └── modulesService.js
│   └── frontend
│       ├── README.md
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── src
│           ├── main.jsx
│           ├── models
│           │   └── moduleModel.js
│           ├── services
│           │   └── moduleService.js
│           ├── styles
│           │   └── global.css
│           ├── viewmodels
│           │   └── useHomeViewModel.js
│           └── views
│               └── App.jsx
├── docs
│   ├── README.md
│   ├── arquitetura.md
│   ├── produto.md
│   └── roadmap-aprendizado.md
└── packages
    └── shared
        └── README.md
```

## Comandos Do Projeto

Os comandos principais ficam no `package.json` da raiz.

Instalar dependencias do frontend e backend:

```bash
npm run install:all
```

Rodar backend:

```bash
npm run dev:backend
```

Rodar frontend:

```bash
npm run dev:frontend
```

URLs esperadas:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3001
API:      http://localhost:3001/modules
```

## Package.json Da Raiz

O `package.json` da raiz serve apenas como atalho para comandos.

Scripts atuais:

```json
{
  "install:all": "npm install --prefix apps/frontend && npm install --prefix apps/backend",
  "dev:frontend": "npm run dev --prefix apps/frontend",
  "dev:backend": "npm run dev --prefix apps/backend",
  "start:backend": "npm run start --prefix apps/backend"
}
```

## Frontend

Local:

```text
apps/frontend
```

Stack:

- React;
- Vite;
- JavaScript;
- CSS puro;
- BEM;
- MVVM.

### Estrutura Do Frontend

```text
apps/frontend/src
├── main.jsx
├── models
│   └── moduleModel.js
├── services
│   └── moduleService.js
├── styles
│   └── global.css
├── viewmodels
│   └── useHomeViewModel.js
└── views
    └── App.jsx
```

### Papel De Cada Pasta No Frontend

`models`

Define o formato dos dados. No momento, existe `createModule`, uma funcao simples que cria um objeto de modulo.

`services`

Cuida da comunicacao com a API. A View nao deve chamar `fetch` diretamente.

`viewmodels`

Cuida do estado e da regra de tela. No React, este projeto usa hooks como ViewModels.

`views`

Contem JSX e renderizacao. A View deve ser o mais simples possivel.

`styles`

Contem CSS puro usando BEM.

### Fluxo MVVM Atual

O fluxo da tela inicial e:

```text
App.jsx
  usa useHomeViewModel()

useHomeViewModel.js
  chama getModules()
  guarda modules e isLoading
  devolve dados para a View

moduleService.js
  tenta buscar http://localhost:3001/modules
  se falhar, devolve fallbackModules

moduleModel.js
  cria objetos no formato esperado pela tela
```

### Arquivo `moduleModel.js`

Local:

```text
apps/frontend/src/models/moduleModel.js
```

Responsabilidade:

- definir o formato de um modulo;
- deixar claro quais campos existem.

Estado atual:

```js
export function createModule({ id, name, description, status }) {
  return {
    id,
    name,
    description,
    status,
  };
}
```

### Arquivo `moduleService.js`

Local:

```text
apps/frontend/src/services/moduleService.js
```

Responsabilidade:

- buscar dados na API;
- ter dados fallback caso o backend nao esteja rodando;
- esconder o `fetch` da View.

Endpoint usado:

```text
GET http://localhost:3001/modules
```

Variavel de ambiente opcional:

```text
VITE_API_URL
```

Se `VITE_API_URL` nao existir, usa:

```text
http://localhost:3001
```

### Arquivo `useHomeViewModel.js`

Local:

```text
apps/frontend/src/viewmodels/useHomeViewModel.js
```

Responsabilidade:

- guardar estado da tela;
- carregar os modulos;
- expor dados prontos para a View;
- controlar `isLoading`.

Estado atual exposto para a View:

```js
{
  appName: "SafeAnchor",
  subtitle: "Laboratorio simples com React, MVVM e BEM.",
  modules,
  isLoading,
}
```

### Arquivo `App.jsx`

Local:

```text
apps/frontend/src/views/App.jsx
```

Responsabilidade:

- renderizar a tela;
- usar dados do ViewModel;
- nao conter regra de negocio pesada;
- nao chamar API diretamente.

Atualmente renderiza:

- titulo do app;
- subtitulo;
- loading;
- lista de cards de modulos.

### CSS Com BEM

Arquivo:

```text
apps/frontend/src/styles/global.css
```

Padrao usado:

```css
.home {}
.home__intro {}
.home__title {}

.module-list {}
.module-list__loading {}

.module-card {}
.module-card__status {}
.module-card__title {}
.module-card__description {}
```

Explicacao BEM:

- `home` e um bloco.
- `home__title` e um elemento dentro do bloco `home`.
- `module-card` e outro bloco.
- `module-card__description` e um elemento dentro de `module-card`.

Evitar nesta fase:

- CSS-in-JS;
- Tailwind;
- Sass;
- styled-components;
- bibliotecas de UI.

## Backend

Local:

```text
apps/backend
```

Stack:

- Node.js;
- Express;
- CORS.

### Estrutura Do Backend

```text
apps/backend/src
├── server.js
├── controllers
│   └── modulesController.js
├── routes
│   └── modulesRoutes.js
└── services
    └── modulesService.js
```

### Papel De Cada Pasta No Backend

`server.js`

Cria o app Express, configura middlewares, registra rotas e liga o servidor.

`routes`

Define as URLs. Exemplo: `GET /modules`.

`controllers`

Recebe `request` e `response`. Chama services e devolve JSON.

`services`

Guarda os dados e regras simples. Nesta fase, nao existe banco de dados.

### Fluxo Da API

Quando o navegador chama:

```text
GET http://localhost:3001/modules
```

O caminho e:

```text
server.js
  app.use("/modules", modulesRouter)

modulesRoutes.js
  modulesRouter.get("/", listModules)

modulesController.js
  listModules chama getModules()

modulesService.js
  getModules retorna array de modulos
```

### Rotas Atuais

Rota raiz:

```text
GET /
```

Resposta esperada:

```json
{
  "name": "SafeAnchor API",
  "status": "online"
}
```

Rota de modulos:

```text
GET /modules
```

Resposta esperada:

```json
[
  {
    "id": 1,
    "name": "Embarcacoes",
    "description": "Cadastro inicial das embarcacoes do cliente.",
    "status": "Para aprender"
  },
  {
    "id": 2,
    "name": "Manutencoes",
    "description": "Controle simples de servicos preventivos e corretivos.",
    "status": "Proximo passo"
  },
  {
    "id": 3,
    "name": "Checklists",
    "description": "Lista basica de seguranca antes de sair para navegar.",
    "status": "Futuro"
  }
]
```

## Documentacao Existente

Arquivos em `docs`:

```text
docs/README.md
docs/arquitetura.md
docs/produto.md
docs/roadmap-aprendizado.md
```

Finalidade:

- `docs/README.md`: ordem de leitura.
- `docs/arquitetura.md`: explicacao simples da arquitetura.
- `docs/produto.md`: contexto do produto.
- `docs/roadmap-aprendizado.md`: roteiro de tarefas para estudar.

## Estado Atual Do Projeto

O projeto ja possui:

- estrutura raiz limpa, sem pasta duplicada `safeanchor-monorepo/safeanchor-monorepo`;
- frontend React com Vite;
- backend Express;
- primeira rota `GET /modules`;
- tela inicial que lista modulos;
- fallback no frontend se a API nao estiver ligada;
- CSS com BEM;
- documentacao inicial.

O projeto ainda nao possui:

- banco de dados;
- cadastro real;
- formulario;
- autenticacao;
- testes;
- deploy;
- CRUD completo;
- validacao de dados;
- tratamento visual de erro.

## Regras Para A IA Que Vai Guiar O Usuario

1. Ensinar devagar.
2. Fazer uma mudanca pequena por vez.
3. Explicar o motivo da mudanca.
4. Nao transformar o projeto em algo avancado cedo demais.
5. Nao adicionar TypeScript agora.
6. Nao adicionar banco de dados agora.
7. Nao adicionar framework de CSS.
8. Nao reintroduzir Next.js.
9. Preservar MVVM no frontend.
10. Preservar BEM no CSS.
11. Preferir JavaScript simples e legivel.
12. Antes de codar uma feature grande, criar uma versao pequena com dados fixos.
13. Atualizar README quando criar uma pasta ou conceito novo.
14. Propor exercicios para o usuario praticar, em vez de fazer tudo automaticamente.

## Ordem Recomendada De Aprendizado

### Etapa 1: Rodar O Projeto

Objetivo: ver frontend e backend funcionando.

Tarefas:

- rodar `npm run install:all`;
- rodar `npm run dev:backend`;
- abrir `http://localhost:3001/modules`;
- rodar `npm run dev:frontend`;
- abrir `http://localhost:5173`.

### Etapa 2: Entender A Tela

Objetivo: entender o que aparece no navegador.

Arquivos:

- `apps/frontend/src/views/App.jsx`;
- `apps/frontend/src/styles/global.css`.

Tarefas:

- alterar o texto "Projeto de estudo";
- alterar a cor de `.home__eyebrow`;
- alterar o texto de loading;
- observar o resultado no navegador.

### Etapa 3: Entender O ViewModel

Objetivo: entender estado no React.

Arquivo:

- `apps/frontend/src/viewmodels/useHomeViewModel.js`.

Tarefas:

- trocar `appName`;
- trocar `subtitle`;
- criar um novo valor chamado `footerText`;
- mostrar `footerText` na View.

### Etapa 4: Entender O Service

Objetivo: entender comunicacao com API.

Arquivo:

- `apps/frontend/src/services/moduleService.js`.

Tarefas:

- mudar temporariamente a URL da API para ver o fallback funcionar;
- adicionar um modulo no fallback;
- observar que o frontend ainda funciona sem backend.

### Etapa 5: Entender O Backend

Objetivo: entender rota, controller e service.

Arquivos:

- `apps/backend/src/server.js`;
- `apps/backend/src/routes/modulesRoutes.js`;
- `apps/backend/src/controllers/modulesController.js`;
- `apps/backend/src/services/modulesService.js`.

Tarefas:

- adicionar um quarto modulo no backend;
- abrir `http://localhost:3001/modules`;
- conferir o JSON;
- atualizar a tela.

### Etapa 6: Primeiro Refactor Pequeno

Objetivo: criar um componente sem mudar arquitetura.

Tarefa:

- criar `apps/frontend/src/views/ModuleCard.jsx`;
- mover o card de `App.jsx` para esse componente;
- manter classes BEM existentes.

### Etapa 7: Primeiro Campo Novo

Objetivo: aprender como uma mudanca atravessa backend e frontend.

Campo sugerido:

```text
difficulty
```

Passos:

1. Adicionar `difficulty` nos objetos de `modulesService.js`.
2. Adicionar `difficulty` no fallback de `moduleService.js`.
3. Atualizar `createModule` em `moduleModel.js`.
4. Mostrar `difficulty` em `App.jsx` ou `ModuleCard.jsx`.
5. Criar classe BEM `.module-card__difficulty`.

## Sugestao De Proxima Feature Pequena

Criar uma pagina/tela de estudo para embarcacoes ainda sem banco.

Versao minima:

- adicionar um array fixo de embarcacoes no backend;
- criar rota `GET /vessels`;
- criar service `vesselService.js` no frontend;
- criar ViewModel `useVesselsViewModel.js`;
- renderizar uma lista simples.

Nao criar formulario ainda.
Nao criar banco ainda.
Nao criar autenticacao ainda.

## Prompt Pronto Para Colar Em Outra IA

Use o texto abaixo se quiser pedir orientacao para outra IA:

```text
Estou criando o projeto SafeAnchor como laboratorio de aprendizado. Sou iniciante e quero construir devagar.

Quero usar React com Vite no frontend, JavaScript simples, CSS puro com BEM, arquitetura MVVM no frontend e backend simples com Express.

Nao quero usar Next.js, TypeScript, Prisma, Tailwind, banco de dados, Docker ou autenticacao por enquanto.

Minha estrutura atual esta documentada no arquivo README-PARA-IA.md. Antes de sugerir qualquer mudanca, leia esse contexto e me guie passo a passo.

Seu papel:
- ensinar com calma;
- fazer uma tarefa pequena por vez;
- explicar os arquivos envolvidos;
- preservar MVVM e BEM;
- atualizar documentacao quando necessario;
- nao criar a aplicacao inteira de uma vez.

Primeiro me ajude a entender a estrutura atual e depois me passe uma tarefa pequena para eu codar.
```

