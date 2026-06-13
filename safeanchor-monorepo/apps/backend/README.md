# Backend

Backend simples usando Express.

## Estrutura

```text
src
├── server.js                # Liga o servidor
├── routes/modulesRoutes.js  # Define a URL
├── controllers              # Recebe request e devolve response
└── services                 # Guarda regra e dados por enquanto
```

## Fluxo da Rota

Quando o frontend chama:

```text
GET http://localhost:3001/modules
```

O caminho e:

```text
server.js -> modulesRoutes.js -> modulesController.js -> modulesService.js
```

## Tarefas Para Voce Codar

- [ ] Adicionar um quarto modulo em `modulesService.js`.
- [ ] Criar a rota `GET /health`.
- [ ] Fazer `/health` responder `{ "status": "ok" }`.
- [ ] Criar um controller separado para `health`.

