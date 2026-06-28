# Estado atual do projeto SafeAnchor

Este documento resume o que já existe no projeto para ajudar na organização do backlog e na continuidade do estudo.

## Visão geral

O SafeAnchor é um projeto de estudo em formato monorepo com:

- Frontend em React + Vite
- Backend em Express
- Arquitetura simples no frontend com padrão MVVM
- Objetivo de aprender fluxo completo entre interface, viewmodel, service e API

## O que já existe

### Frontend

- Tela inicial com navegação entre listagem e cadastro de embarcações
- Página de embarcações com listagem de dados
- Formulário para cadastrar uma nova embarcação
- ViewModels para controlar estado das telas
- Serviços para comunicação com a API
- Fallback local para quando o backend não estiver disponível

### Backend

- Servidor Express rodando na porta 3001
- Rota para listar módulos
- Rotas para listar, criar e buscar embarcações
- Separação em controllers, services e models

## Estrutura principal

```text
apps/
  frontend/
    src/
      views/         # páginas e componentes de tela
      viewmodels/    # lógica da tela
      services/      # comunicação com API
      models/        # estrutura dos dados
  backend/
    src/
      routes/        # rotas da API
      controllers/   # tratamento de requests
      services/      # regras e dados do sistema
      models/        # modelos de dados
```

## Funcionalidades já implementadas

- Listagem de embarcações
- Cadastro de embarcações
- Validação básica de formulário
- Resposta simples da API
- Exibição de status de conexão com o backend

## Pontos que ainda podem entrar no backlog

- Persistência real em banco de dados
- Edição de embarcações
- Exclusão de embarcações
- Melhorias na validação de dados
- Busca e filtros na listagem
- Melhorias na interface visual
- CRUD completo de módulos
- Autenticação de usuários
- Testes automatizados

## Sugestão de próximos passos

1. Completar o CRUD de embarcações
2. Conectar o projeto a um banco real
3. Melhorar a experiência visual do frontend
4. Adicionar testes básicos no backend e no frontend

Este resumo pode ser usado como base para criar tarefas mais claras no backlog.