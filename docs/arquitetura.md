# Arquitetura Simples

## Ideia Principal

Vamos separar o projeto em duas partes:

- frontend: aquilo que o usuario ve;
- backend: aquilo que fornece dados.

## Frontend com MVVM

MVVM significa:

- Model: formato dos dados.
- View: tela em JSX.
- ViewModel: estado e regra da tela.

Neste projeto:

```text
Model      -> src/models/moduleModel.js
View       -> src/views/App.jsx
ViewModel  -> src/viewmodels/useHomeViewModel.js
Service    -> src/services/moduleService.js
```

## Backend Simples

No backend, vamos usar:

- Route: define a URL.
- Controller: recebe a requisicao.
- Service: guarda regra/dados.

## Antes de Crescer

So adicione banco de dados depois que voce entender:

- como uma tela renderiza dados;
- como o ViewModel busca dados;
- como o backend responde uma rota;
- como frontend e backend conversam.

