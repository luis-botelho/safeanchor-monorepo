# Changelog

## v0.1.0 - Fleet Management Foundation

### Added

- CRUD completo de embarcações
- Listagem de embarcações
- Cadastro de embarcações
- Detalhes da embarcação
- Edição de embarcação
- Exclusão de embarcação
- Arquitetura MVVM no Frontend
- Arquitetura Controller → Service no Backend
- Integração Frontend ↔ Backend
- Navegação com React Router

### Fixed

- Correção da atualização automática da lista
- Correção do fluxo de edição
- Correção do endpoint DELETE
- Melhorias na reutilização do VesselForm

### Notes

Primeira versão funcional do módulo Fleet Management.

## Publicado após a v0.1.0

Registro do trabalho posterior à v0.1.0; ainda sem número de release, PR ou
deploy confirmados.

### Added

- Área da diretoria em `/director`, sem conta pública: credencial `DIRECTOR`
  provisionada fora do repositório.
- Área da diretoria em `/director`, `/director/responses`, `/director/users` e
  `/director/audit`, com guard por `roleKey` no frontend e
  `authorizeRoles("DIRECTOR", "ADMIN")` no backend.
- Endpoints `GET /director/responses`, `/insights`, `/users`, `/actions` e
  `PATCH /director/users/:id`, `/responses/:id`; filtros por status/perfil/cidade,
  decisão/status e auditoria mínima (sem senha ou token).
- Consentimento explícito e versionado (`2026-11-26`) na pesquisa: aceite grava
  `ResearchResponse` e envia por Resend; recusa mantém o resumo só no navegador.
- Testes de backend para consentimento e decisões da diretoria
  (`apps/backend/test/research-consent.test.js`).
- Prerender estático de `/`, `/pesquisa/` e `/privacidade/`, `robots.txt`,
  `sitemap.xml`, JSON-LD, Open Graph, canonical, favicon/manifest e og-image;
  metadados centralizados em `apps/frontend/src/seo/pageMeta.js`.

### Changed

- `/privacidade` permite alterar ou revogar a escolha de captura;
  `safeanchor.researchConsent` guarda decisão, versão e data e
  `safeanchor.cookieConsent` registra apenas o aviso lido.
- Login e documentação passam a distinguir persona (navegação) de role
  (autorização real).

### Notes

`npm test` no backend passa. As migrations de role `DIRECTOR`, respostas de
pesquisa e auditoria precisam ser aplicadas em produção com `DIRECT_URL`
fornecida pelo usuário; nenhum segredo é versionado. O total de checks do
verificador versionado está no handoff.