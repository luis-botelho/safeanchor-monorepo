# Endurecimento de segurança — SafeAnchor

Este documento registra as correções aplicadas após a auditoria estática de
26/11/2026 e as ações que **não** podem ser feitas somente por código.

## SA-01 — credencial pública de diretoria (P0)

A credencial de administrador que estava em README, documentação, mock de login,
migração e bundle foi removida de todos os arquivos versionados. O verificador
`scripts/verify-demo.mjs` passou a checar explicitamente que o bundle publicado
não contém essa credencial e exercita somente contas com `role: USER`.

O que ainda exige ação do mantenedor (fora do repositório):

1. **Rotacionar a senha** da conta antiga de diretoria na API de produção.
2. **Invalidar sessões ativas**: com a rotação implementada neste ciclo,
   `POST /auth/logout` revoga o token atual; tokens emitidos antes da mudança
   precisam ser invalidados pela rotação do `JWT_SECRET` ou aguardar o expiração
   natural (15 minutos).
3. **Remover ou rebaixar a conta antiga** se ela não for mais necessária.
4. **Limpar o histórico do Git**: a credencial foi versionada no passado. Não
   houve reescrita de histórico sem autorização explícita.
5. **Rotacionar segredos do Vercel e do GitHub Actions** se houver suspeita de
   exposição (`JWT_SECRET`, `RESEND_API_KEY`, `DATABASE_URL`, `DIRECT_URL`).

A área `/director` continua no produto, mas não tem credencial pública: a conta
`DIRECTOR` deve ser criada e promovida em ambiente controlado, com MFA,
preferencialmente com e-mail não previsível. O papel nunca é concedido por
migration nem por campo enviado no cadastro.

## Resumo das correções deste ciclo

| ID | Correção |
|---|---|
| SA-02 | Rate limit por IP e por e-mail em `/auth/login` e `/auth/register`; limite por IP em `/research` e no nonce; honeypot `response.website` rejeitado com `202` e `captured:false`. |
| SA-03 | JWT com `jti`, `iss`, `aud`, algoritmo HS256 explícito e validade de 15 minutos; revogação em memória por `jti` via `POST /auth/logout`; `requireAuth` reconsulta `role` no banco. Tokens antigos deixam de ser aceitos após o deploy. |
| SA-04 | Token de acesso e perfil ficam apenas na memória da aba; não há `localStorage` para sessão. Logout chama `/auth/logout`, e um `401` dispara limpeza local. |
| SA-05 | `GET /research/nonce` emite nonce assinado pelo servidor, com validade de 10 minutos; `POST /research` valida nonce, versão e aceite. IP, user-agent e timestamp do servidor são gravados em `DirectorAction` (auditoria mínima), sem migration nova. |
| SA-07 | `helmet()` e `app.disable("x-powered-by")` no backend; headers de segurança no `vercel.json` e em `public/_headers`; CSP em `Content-Security-Policy-Report-Only` com `report-uri` para `/api/csp-report`, que registra violações de forma saneada e limitada por IP. |
| SA-06/SA-11 | Validação simples de tipos e tamanhos em register/login e em vessels, documents, inspections e maintenances, retornando `400` em vez de `500`. |
| SA-08 | Links `wa.me` e `mailto:` usam resumo sem contato por padrão; checkbox explícita permite incluir nome/contato. WhatsApp continua manual, sem envio automático. |
| SA-09 | Rascunho local expira em 24 horas e é saneado; o envio limpa o rascunho; `safeanchor.researchResponses` guarda só o último envio, sem contato, também com expiração de 24 horas. |
| SA-10/SA-12/SA-13/SA-14 | Resolvidos indiretamente por SA-03/SA-04: sem sessão em storage, `jwt.verify` com opções explícitas, segredo com tamanho mínimo validado e `x-request-id` sempre gerado no servidor. |
| SA-15 | `console.error` removido de `ChecklistTemplatesPage.jsx`; falha de carregamento exibe mensagem genérica. |
| SA-16 | `effect` transitivo do `@prisma/config` fixado em `3.22.5` via `overrides`, sem downgrade do Prisma 7. `npm audit` do backend passou de 3 `high` para 0 vulnerabilidades. |

## Validação local

- Backend: `npm test` — 37 testes passaram, 3 integrações puladas, 0 falhas.
- Frontend: `npm run build` concluído (inclui prerender estático).
- Bundle local sem `diretoria@safeanchor.app`, `safeanchor:session` ou
  `localStorage.getItem("token")`.
- `vercel.json` válido e `dist/_headers` presente.
- `npm run verify:local` — 18 verificações offline dos artefatos (sem rede).
- `npm audit` no backend — 0 vulnerabilidades após o override do `effect`.
- Nenhuma requisição foi feita contra a API de produção; nenhum login ou teste
  de IDOR ao vivo foi executado.

## Pendências que exigem ação do mantenedor

- Rotacionar a senha da conta antiga de diretoria e remover/rebaixar a conta.
- Rotacionar `JWT_SECRET` para invalidar globalmente tokens emitidos com a
  credencial vazada; a revogação em memória vale apenas por instância.
- Decidir sobre a limpeza do histórico Git onde a credencial foi versionada.
- Rotacionar segredos do Vercel/GitHub Actions se houver suspeita de exposição.
- CSP permanece em modo `Report-Only`: as violações agora são enviadas ao
  backend, mas ainda não bloqueiam a demo. Antes de trocar para bloqueio,
  acompanhe os logs e ajuste as diretivas necessárias.
