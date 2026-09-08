# SafeAnchor MVP Rebaseline 2026 - Operational Readiness

## North Star

> O usuário deve entrar no SafeAnchor e entender rapidamente se sua embarcação está pronta para operar, o que exige atenção e qual é o próximo risco.

## Jornada Principal

```
Login → Dashboard → Minha Frota → Embarcação → Manutenção / Checklists / Documentos → Prontidão Operacional
```

O produto é organizado em torno dessa jornada. Cada feature do rebaseline contribui para uma etapa dela, do acesso (Login) até a decisão de prontidão operacional.

## Features do Rebaseline

### FEATURE 031 - Ownership & Access Scope

- Ownership explícito de Vessel.
- Isolamento real de dados entre usuários/organizações.
- Queries respeitam o escopo do usuário autenticado.
- ADMIN mantém acesso administrativo.
- Organization/Membership somente no mínimo necessário para operar.

### FEATURE 032 - Product Shell & Main Dashboard

- Layout autenticado consistente (sidebar/header).
- Navegação principal (frota, manutenção, inspeções, documentos).
- Dashboard com: resumo da frota, manutenções pendentes/próximas, inspeções recentes e documentos próximos do vencimento.
- Estados de loading / empty / error.

### FEATURE 033 - Vessel Operational Profile

- Dados e status da Vessel.
- Manutenção recente e próxima.
- Última inspeção realizada.
- Documentos e vencimentos.
- Ações e históricos centralizados.

### FEATURE 034 - Documents Core

- Entidade Document no Prisma.
- Associação com Vessel.
- Upload de documentos.
- Supabase Storage.
- Metadata e `expirationDate`.
- Listagem e download seguro.

### FEATURE 035 - Expiration & Compliance

- Documentos válidos.
- Documentos próximos do vencimento.
- Documentos vencidos.
- Indicadores no dashboard.
- Pendências por Vessel e por frota.

### FEATURE 036 - Safety Completion & Mobile Polish

- Melhorar execução mobile de checklists.
- Histórico legível.
- Resumo básico de falhas/conformidade.
- Revalidar QR Code e Safety Reports existentes.
- QR Code (novo) somente se couber no escopo.

### FEATURE 037 - MVP UX Polish

- Identidade visual consistente.
- Sidebar/header padronizados.
- Formulários com feedback.
- Estados de loading / empty / error.
- Responsividade básica.
- Remover artifacts/fallbacks de desenvolvimento visíveis.

### FEATURE 038 - CI/CD & Production Deploy

- GitHub Actions.
- Backend publicado.
- Frontend publicado.
- Variáveis de produção.
- Supabase (production).
- Health check.
- Smoke test.
- Documentação de deploy.

## Definição de Pronto (DoD)

- O usuário consegue percorrer a jornada completa (Login → Prontidão) sem erros.
- Dados de um usuário não vazam para outro (ownership/isolamento).
- Dashboard reflete frota, manutenção, inspeções e documentos com dados reais.
- Documentos podem ser listados, baixados e vencimentos são visíveis.
- Indicadores de compliance aparecem no dashboard e por embarcação.
- Execução mobile de checklist e histórico é funcional.
- UI consistente, sem artifacts de desenvolvimento visíveis.
- Backend e frontend publicados em produção com health check e smoke test.

## Itens Pós-MVP

- Maritime Academy (Features 021–025 do backlog original).
- QR Code avançado (caso não caiba na Feature 036).
- Expansões de marketplace, IoT e mobile nativo mantidas no roadmap.

## Relação com Backlog Histórico

Este rebaseline reorganiza o backlog do MVP anterior:

- **Features 016–020**: escopo relevante absorvido pelas Features 034 e 035.
- **Features 021–025**: movidas para pós-MVP; a Maritime Academy permanece no roadmap.
- **QR Code / Safety Reports (029 e 030)**: revalidados funcionalmente durante a Feature 036.
- **Feature 030 CI/CD (#152)**: trabalho preparado permanece válido; o deploy real será concluído na Feature 038.

Nenhuma issue antiga foi fechada ou deletada; apenas comentários de replanejamento foram adicionados para preservar o histórico.
