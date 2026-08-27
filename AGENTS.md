# SafeAnchor Agent Notes

Este projeto agora e uma base simples para estudo.

## Stack Atual

- Frontend: React com Vite.
- Backend: Express.
- Persistencia: PostgreSQL no Supabase com Prisma 7.
- CSS: BEM em arquivos `.css`.
- Arquitetura do frontend: MVVM.
- Arquitetura do backend: Route -> Controller -> Service -> Prisma.

## Cuidados

- Evite adicionar Next.js, TypeScript ou Tailwind nesta fase.
- Preserve o Prisma e o PostgreSQL ja adotados no backend.
- Nunca versione `.env` ou credenciais do Supabase.
- Use `DATABASE_URL` no runtime e `DIRECT_URL` nos comandos do Prisma CLI.
- Prefira arquivos pequenos e didaticos.
- Antes de criar uma abstracao, escreva uma versao simples.
- Mantenha os READMEs atualizados com tarefas para iniciantes.
