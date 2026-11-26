# Roteiro de apresentação — demo funcional (2026-11-26)

Este é o **runbook do apresentador**. Ele responde: quais contas usar, em que ordem
clicar, o que aparecer em cada tela, o que é dado real da API e o que é catálogo
de demonstração. Para estado operacional e histórico de deploys, veja
[`handoff-freeze.md`](./handoff-freeze.md). Para arquitetura, veja
[`diagnostico.md`](./diagnostico.md). Para regras visuais e de carregamento, veja
[`visual-system.md`](./visual-system.md).

## 1. Onde apresentar

| Camada | URL |
|---|---|
| Aplicação (SPA) | https://luis-botelho.github.io/safeanchor-monorepo/ |
| API de produção | https://safeanchor-monorepo.vercel.app |
| Saúde da API | https://safeanchor-monorepo.vercel.app/health |

Use **sempre** a URL de produção. O Preview da Vercel usa um banco Neon temporário
que expira em `2026-11-29T14:19:24Z` — se ele morrer no meio da apresentação,
não afeta a produção.

## 2. Contas de demonstração

Na tela de login há um bloco **“Acessos de demonstração”**: um clique preenche
e-mail e senha. As quatro contas abaixo existem de verdade na API (foram criadas
por `/auth/register`, com `persona` correspondente) e têm dados próprios; três
delas têm botão na tela de login.

| Perfil | E-mail | Senha | Persona no token | O que mostrar |
|---|---|---|---|---|
| Proprietário | `demo@safeanchor.app` | `demo123` | `OWNER` | Jornada completa: frota → embarcação → manutenção → documentos → inspeção com certificado |
| Proprietário (legado) | `demo@safeanchor.test` | `demo123456` | `OWNER` | Conta usada nos smoke tests; mesma base de dados da conta acima |
| Prestador | `carlos@tecno.boat` | `demo123` | `SERVICE_PROVIDER` | Dashboard do prestador, perfil público, jobs, solicitações de serviço |
| Marina | `gestao@marinacostaazul.com` | `demo123` | `MARINA` | Dashboard da marina, frota, equipe, serviços, reservas e plano |

> **Atenção para não prometer demais:** `persona` é metadado de navegação. O
> backend autoriza por `role` (todas estas contas são `USER`) e isola dados por
> `Party`. Trocar a persona no login muda os menus, **não** concede permissões
> diferentes. Cada conta vê somente a própria frota.

## 3. Roteiro principal (20–25 minutos)

### Passo 1 — Entrada e pesquisa (2 min)

1. Abra `/` e mostre a introdução (proposta, personas, chamada para ação).
2. Clique em **Participar da pesquisa** → `/pesquisa`.
3. Percorra algumas perguntas; mostre que o rascunho fica no `localStorage` e que
   os botões de WhatsApp (`wa.me`) e e-mail aparecem na tela de confirmação.
4. **Não** é preciso concluir o envio ao vivo — o e-mail já foi validado em
   26/11/2026 (`202` com id do Resend). Se quiser mostrar o envio, saiba que uma
   falha do Resend mantém o usuário no formulário com erro.

### Passo 2 — Login do proprietário (1 min)

1. Vá para `/login`.
2. Clique em **Proprietário** no bloco “Acessos de demonstração”.
3. Clique em **Entrar**. O botão mostra spinner e rótulo “Entrando...” enquanto a
   API responde; depois abre `/dashboard`.

### Passo 3 — Dashboard do proprietário (3 min)

Mostre os cartões de frota, manutenções e documentos. Números esperados:

| Indicador | Valor |
|---|---|
| Embarcações | 3 |
| Manutenções | 5 (3 preventivas, 2 corretivas) |
| Manutenções pendentes | 2 |
| Manutenções concluídas | 2 |
| Documentos | 5 (2 próximos do vencimento: `12/12` e `05/12`) |
| Inspeções | 4 (3 agendadas, 1 concluída com certificado) |

> O card “prontidão” e o feed de atividades são calculados no cliente e usam
> dados de exemplo. Diga “indicador de prontidão em elaboração” — a API ainda não
> expõe `readiness`.

### Passo 4 — Frota e perfil da embarcação (5 min)

1. **Frota** (`/fleet`): três embarcações — `SafeAnchor Demo`, `Maré Nova`,
   `Vento Sul` (em manutenção).
2. Clique em `SafeAnchor Demo` (`/fleet/:id`): mostre dados técnicos,
   manutenções recentes, documentos e última inspeção.
3. Volte e clique em **Nova embarcação** (`/fleet/new`) apenas para mostrar o
   formulário; não precisa salvar.

### Passo 5 — Manutenção e documentos (4 min)

1. **Manutenção** (`/maintenance`): mostre a lista com statuses variados e o
   dashboard de números.
2. **Documentos** (`/documents`): mostre os selos de validade — `Seguro
   obrigatório` válido até `01/2027`, `Registro de embarcação` próximo do
   vencimento em `15/12/2026`.
3. **Novo documento** (`/documents/new`): mostre o formulário com validação e
   spinner de envio.

### Passo 6 — Inspeção e certificado (5 min) — o fechamento da jornada

1. **Inspeções** (`/inspections`): quatro registros; um **CONCLUÍDO**.
2. Abra o registro concluído (`/inspections/:id`): mostre o checklist aprovado e
   o **certificado** (`Certificado de Segurança`, validade de 6 meses).
3. Para demonstrar o ciclo ao vivo, crie uma inspeção em `/inspections/new`,
   marque os itens como aprovados na tela de detalhe e clique em **Concluir**.
   O certificado aparece somente se **nenhum** item estiver reprovado.
4. Se um item for marcado como falha, a inspeção conclui **sem** certificado —
   use isso para explicar a regra de conformidade.

### Passo 7 — Troca de persona (4 min)

1. Volte a `/login` (menu **Sair**).
2. Clique em **Prestador** → entrar. Mostre o dashboard com perfil `TecnoMar`,
   solicitações, avaliações e o link para `/jobs`.
3. Saia e clique em **Marina** → entrar. Mostre dashboard da `Marina Costa
   Azul`, equipe, serviços e reservas.
4. Explique: os catálogos (marinas, prestadores, eventos, comunidade, viagens,
   locações, marketplace, academy e IA) são **dados de demonstração no
   frontend**; frota, manutenção, documentos e inspeções vêm da API real.

## 4. Dados esperados por conta (conferência rápida)

| Conta | Embarcações | Manutenções | Documentos | Inspeções | Preventivas | Execuções de checklist |
|---|---:|---:|---:|---:|---:|---:|
| `demo@safeanchor.app` | 3 | 5 | 5 | 4 (1 concluída) | 1 | 1 |
| `demo@safeanchor.test` | 3 | 5 | 5 | 4 (1 concluída) | 1 | 1 |
| `carlos@tecno.boat` | 2 | 2 | 2 | 1 (concluída) | 1 | 1 |
| `gestao@marinacostaazul.com` | 2 | 2 | 2 | 1 (concluída) | 1 | 1 |

Clientes fictícios que aparecem nos catálogos e relatórios: Paulo Andrade,
Fernanda Luz, Rafael Souza, Marina Guedes, Tomás Pires, Julia Ramos, Marcos
Vieira e Pedro Lima. Inspetora de exemplo: Ana Ribeiro. Prestadores: Carlos
Mendes (TecnoMar), Felipe Rocha (NautiTech Elétrica) e Cláudia Nunes (casco e
pintura). Marina: Renata Almeida (Marina Costa Azul).

## 5. O que é API real e o que é mock

| Real (HTTP, banco Postgres/Supabase) | Mock (dados versionados no frontend) |
|---|---|
| Login, cadastro, `/auth/me` | Marinas e detalhe de marina |
| Frota (`/vessels`) e criação | Prestadores e perf públicos |
| Manutenção e dashboard (`/maintenances`) | Solicitações de serviço e jobs |
| Documentos (`/documents`) | Eventos, comunidade, marketplace |
| Inspeções, checklist e certificado | Viagens, locações de barco, Academy, IA |
| Manutenção preventiva, templates e execuções de checklist | Feed de atividades e “prontidão” do dashboard |

A distinção está nos services: `apps/frontend/src/services/` contém tanto
`api.js` (chamadas HTTP) quanto módulos que importam `src/mock/`. Isso está
detalhado em [`diagnostico.md`](./diagnostico.md#3-arquitetura-e-tecnologias).

## 6. Armadilhas e como contornar

- **Deep links respondem `404`.** O GitHub Pages devolve o HTML da SPA com status
  `404` para `/privacidade`, `/pesquisa`, `/login` etc.; o Router renderiza a
  rota no navegador. Não é erro da aplicação. Para começar, entre sempre pela
  raiz `/`.
- **Token dura 1 hora e não há refresh.** Se a sessão expirar durante a
  apresentação, faça login novamente (o frontend limpa o armazenamento e volta
  para `/login`).
- **Não aponte um frontend local para a API de produção.** O CORS só aceita a
  origem `https://luis-botelho.github.io`. Use a URL publicada.
- **Não use rotas órfãs na apresentação.** Não existem
  `/maintenances`, `/preventive-maintenances`, `/checklist-templates`,
  `/checklist-executions`, `/maintenance/dashboard` nem edição/exclusão de
  embarcação na UI. Elas caem na página inicial.
- **Carregamento:** skeleton aparece nas telas principais enquanto a API responde;
  o pulse é curto e some com `prefers-reduced-motion`. Botões usam spinner inline
  e ficam desabilitados durante o envio. Não é “travamento”.
- **Erro/vazio:** lista sem dados mostra explicação e ação, não um “Carregando...”
  infinito. Se aparecer erro, use **Tentar novamente**.
- **Privacy/LGPD:** `/privacidade` é pública; o aviso de armazenamento local
  registra o aceite em `safeanchor.cookieConsent`. Não há cookies de rastreamento.

## 7. Verificação rápida antes de apresentar

No Windows, em qualquer diretório com Node 22:

```powershell
node scripts/verify-demo.mjs
# ou, na raiz do repositório:
npm.cmd run verify:demo
```

O script checa Pages, bundle, rotas da SPA, `/health`, login das quatro contas,
listagens, CORS, contagens de dados e isolamento por `Party`. Ele não imprime
senhas e não modifica dados. Se algum check falhar, veja
[`handoff-freeze.md`](./handoff-freeze.md) antes de seguir.

## 8. Se algo der errado

1. `/health` fora do ar → problema na Vercel/Supabase; use o Preview apenas para
   mostrar a UI (e avise que os dados podem ser outros).
2. Login `401` → confira e-mail/senha da tabela; as contas foram criadas via API.
3. Lista vazia → a conta está isolada por `Party`; entre com a conta correta da
   tabela, não com um e-mail novo.
4. Certificado ausente → a inspeção teve item reprovado; crie outra inspeção com
   todos os itens aprovados.
5. Layout “estranho” → limpe o `localStorage` (`safeanchor.cookieConsent` e o
   rascunho da pesquisa) e recarregue.
