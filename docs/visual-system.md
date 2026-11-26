# Sistema visual e contrato de carregamento — SafeAnchor

**Data:** 2026-11-26 · **Status:** contrato aceito para a reformulação visual da demo.

> Objetivo: fazer a interface parecer produto de equipe sênior — densa, calma,
> confiável e acessível — sem trocar a stack. Continua sendo React + Vite, CSS
> BEM em arquivos pequenos, sem Tailwind, sem TypeScript e sem Next.js
> (`AGENTS.md`).

---

## 1. Referência local

A pasta `stitch_safeanchor_maritime_ux_architecture/`, adicionada pelo usuário,
é a fonte da direção visual: precisão marítima, prontidão operacional e ficha
técnica de embarcação. Ela será mapeada para tokens e componentes existentes;
o HTML/CSS dela é **referência**, não código para copiar e colar.

> Quando esta pasta evoluir, atualize a tabela de mapeamento abaixo e o
> `docs/handoff-freeze.md`. Não versione imagens de terceiros sem origem clara.

| Referência | Tradução no app |
|---|---|
| Superfícies escuras e frias | tokens `--bg`, `--surface`, `--surface-2`, `--border` |
| Um único acento de ação | `--primary` para CTA, nav ativa e foco |
| Cor reservada a estado | `--success`, `--warning`, `--danger`, `--info` — nunca decoração |
| Ficha técnica / tabelas densas | linhas compactas, números monoespaçados, hierarquia por tipografia |
| Cartões de prontidão | KPI com número grande, rótulo curto e fonte/período explícitos |

---

## 2. Princípios de design system

1. **Token-first.** Nenhuma cor, raio, sombra ou duração "solta" nos componentes.
   Se precisar de um valor novo, crie um token semântico em `:root`.
2. **BEM primeiro.** Um bloco por responsabilidade (`app-shell`, `page-header`,
   `data-card`, `skeleton`, `state-view`). Modificadores descrevem estado, não
   aparência (`--active`, `--loading`, `--compact`).
3. **Uma hierarquia, não muitas.** No máximo três tamanhos de fonte e dois pesos
   por tela. O número de um KPI fica entre 24 e 32 px, sem semibold/fino extremo.
4. **Densidade com respiro.** Fontes e linhas compactas; espaçamento entre
   seções faz o trabalho que border pesado fazia. Prefira 1 px de borda a sombra
   grande.
5. **Ação é única.** Um acento para "o que o usuário pode fazer agora". Verde/
   âmbar/vermelho só para status (saudável, atenção, falha).
6. **Respeito à preferência de movimento.** Animação é opt-in sob
   `@media (prefers-reduced-motion: no-preference)`. Estado final sempre visível
   quando o movimento é desligado; transições de cor permanecem.

---

## 3. Contrato de carregamento

### 3.1 Qual indicador usar

| Situação | Indicador | Motivo |
|---|---|---|
| Carregamento inicial de página, lista, tabela ou dashboard (aprox. 1–10 s, layout conhecido) | **Skeleton** com a mesma geometria do conteúdo final | Mostra a estrutura e reduz o salto visual |
| Clique em botão, submit, salvar, excluir | **Inline loading** com spinner pequeno e texto ("Salvando…") | É uma ação, não uma página tomando forma |
| App inteiro bloqueado (ex.: validando token antes de liberar rota) | **Overlay/estado de sessão**, não skeleton completo | Evita "frame vazio" enganoso |
| Upload, download, exportação, processo longo | **Progress bar** com etapas/percentual | Skeleton não informa progresso de processo |
| Erro, vazio, sem permissão | **State view** com ícone, título, explicação e ação | Não é loading; precisa saída clara |

**Nunca** use skeleton para botão isolado, input, modal inteiro, toast, dropdown
ou loader. Não use "frame display" (só header/footer e área vazia): não ensina
nada sobre o que vem.

### 3.2 Regras dos skeletons

- O placeholder **them a mesma altura/largura** do elemento real para evitar
  *layout shift*. Variações de largura de linha (`--w`) simulam texto; não use
  barras todas iguais.
- Use `role="status"` + `aria-busy="true"` no contêiner e um texto
  `.sr-only` dizendo "Carregando …". As formas recebem `aria-hidden="true"` e
  não são focáveis. Ao terminar, `aria-busy` vira `false` e o foco não é
  reposicionado.
- Animação padrão: **pulse sutil**, não shimmer agressivo. Declare dentro de
  `prefers-reduced-motion: no-preference` e com número finito de ciclos
  (`2s ease-in-out 2`), para não violar WCAG 2.2.2 quando o carregamento demora.
- Se a resposta costuma chegar em < 1 s, **não mostre skeleton**: o piscar é mais
  ruidoso que a espera. Aplicar atraso curto antes de exibir também é válido se
  o projeto passar a ter esse caso.
- Carregamentos simultâneos devem pulsar **em sincronia**; não use delays por
  item.

### 3.3 Microinterações

- Hover/foco: `140–220ms ease-out`, animando apenas `opacity` e `transform`.
- Entrada de tela/card: `240–320ms ease-out`, uma única vez, com `translateY(8px)`
  + fade. Sem `zoom` composto, sem parallax e sem "efeito mágico".
- Foco visível obrigatório: `outline: 2px solid var(--primary)` com offset.
- Durante submit: desabilitar botão, `aria-busy`, texto de estado e spinner;
  manter largura do botão para não dançar o layout.
- `prefers-reduced-motion: reduce` desliga movimento espacial e mantém trocas de
  cor. Nunca usar `animation-duration: 0.01ms` global.

---

## 4. Checklist de aceite para cada tela

1. Carregando: existe skeleton **do mesmo layout** da tela carregada?
2. Carregando: leitor de tela sabe que está ocupado (`aria-busy` + `.sr-only`)?
3. Sucesso: conteúdo entra sem salto e o foco continua onde estava?
4. Vazio/erro: há explicação e próxima ação, não um retângulo cinza?
5. Ação: botão mostra estado de submissão e não pode ser clicado duas vezes?
6. Reduced motion: tudo continua legível e funcional com animação desligada?
7. Contraste: texto e status passam WCAG AA (4.5:1 / 3:1 para grandes)?
8. Build: `npm run build` sem erro e fluxo login → dashboard → listagens segue OK?

---

## 5. Pesquisa breve (consultada em 26/11/2026)

- [Carbon Design System — Loading](https://www.carbondesignsystem.com/building-blocks/core/patterns/loading):
  skeleton só para containers/listas/tabelas/cards; action components usam
  loading indicator; `aria-busy` para avisar leitores de tela.
- [Nielsen Norman Group — Skeleton Screens](https://www.nngroup.com/articles/skeleton-screens/):
  úteis entre ~1 e 10 s; abaixo de 1 s piscar é pior; nunca "frame display".
- [Chrome for Developers — Motion](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/motion):
  animar `opacity`/`transform`, preferir `no-preference` para opt-in, não matar
  transições de cor, não usar `0.01ms` global, manter estado final visível.
- [Fluent 2 — Skeleton usage](https://fluent2.microsoft.design/components/web/react/core/skeleton/usage):
  sincronizar skeletons simultâneos, não representar partes fixas do layout.
- [W3C WCAG 2.2.2 / C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39):
  movimento automático e persistente precisa respeitar preferência do usuário.
- [SaaS dashboard design trends 2026](https://thekitbase.app/blog/saas-dashboard-design-trends-2026):
  dark-first, tokens semânticos, menos chrome, mais densidade; cor para status,
  não decoração.

> Estas fontes orientam **decisão**, não dependência. O projeto continua sem
> novas libs de UI, animação ou ícones.
