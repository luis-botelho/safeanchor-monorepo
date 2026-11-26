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
