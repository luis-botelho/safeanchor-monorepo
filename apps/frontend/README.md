# Frontend

Frontend feito com React + Vite.

## Arquitetura MVVM

```text
src
├── models       # Formato dos dados
├── services     # Comunicacao com API
├── viewmodels   # Estado e regra da tela
├── views        # JSX que aparece na tela
└── styles       # CSS usando BEM
```

## Como Ler o Codigo

Comece por:

```text
src/views/App.jsx
```

Depois siga para:

```text
src/viewmodels/useHomeViewModel.js
```

Depois:

```text
src/services/moduleService.js
```

## BEM no CSS

Exemplo usado:

```css
.module-card {}
.module-card__title {}
.module-card__description {}
```

Onde:

- `module-card` e o bloco.
- `module-card__title` e um elemento dentro do bloco.
- `module-card__description` e outro elemento do bloco.

## Tarefas Para Voce Codar

- [ ] Criar o arquivo `src/views/ModuleCard.jsx`.
- [ ] Mover o card de `App.jsx` para esse novo componente.
- [ ] Criar a classe `.module-card__difficulty`.
- [ ] Mostrar uma dificuldade em cada card.

