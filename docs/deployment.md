# SafeAnchor Deployment

Guia de deploy para o MVP do SafeAnchor.

> Estado atual: este documento ainda NÃO define uma plataforma específica.
> Frontend e backend ainda não estão em produção.

## Arquitetura sugerida

| Camada          | Tecnologia                                      |
| --------------- | ----------------------------------------------- |
| Frontend        | React + Vite (build estático)                   |
| Backend         | Node.js + Express                               |
| Banco de dados  | PostgreSQL hospedado no Supabase                |

Recomendado para o MVP:

- **Frontend**: servir os arquivos estáticos de `apps/frontend/dist` via CDN/reverse proxy.
- **Backend**: processo Node/Express com os secrets injetados pelo provedor.
- **Banco**: Supabase PostgreSQL já utilizado em desenvolvimento.

## Requisitos

### Frontend

- Node.js LTS (>= 20).
- A API base deve ser informada no build via `VITE_API_URL`.
- Sem fallback de `localhost` no bundle de produção (o fallback existe apenas em
  modo desenvolvimento).

### Backend

- Node.js LTS (>= 20).
- Acesso ao PostgreSQL Supabase (pooler para runtime, conexão direta para CLI).
- `JWT_SECRET` forte e exclusivo do ambiente.

## Variáveis de ambiente

### Backend (`apps/backend/.env`)

| Variable       | Obrigatória | Descrição                                                                |
| -------------- | ----------- | ------------------------------------------------------------------------ |
| `DATABASE_URL` | sim         | Conexão de runtime (Supabase pooler, ex.: `?pgbouncer=true`).            |
| `DIRECT_URL`   | sim*        | Conexão direta usada pelo Prisma CLI (migrations e generate/validate).   |
| `JWT_SECRET`   | sim         | Assinatura dos tokens JWT. Use valor aleatório longo.                    |
| `PORT`         | não         | Porta do servidor. Padrão `3001`.                                        |

*`DIRECT_URL` é obrigatória para comandos do Prisma CLI; em runtime o backend
usa apenas `DATABASE_URL`.

### Frontend (`apps/frontend/.env`)

| Variable         | Obrigatória | Descrição                                        |
| ---------------- | ----------- | ------------------------------------------------ |
| `VITE_API_URL`   | sim (prod)  | URL pública da API. Ex.: `https://api.example.com` |

## Build e start

### Backend

```bash
cd apps/backend
npm ci                 # instala dependências e roda prisma generate
npm run prisma:validate
npm test               # testes de CI (não tocam no Supabase)

npm start              # roda em process.env.PORT ou 3001
```

### Frontend

```bash
cd apps/frontend
npm ci
VITE_API_URL="https://api.example.com" npm run build   # gera apps/frontend/dist
```

Servir o conteúdo de `apps/frontend/dist` como site estático.

## Health check

O backend expõe um endpoint público de saúde:

```bash
curl https://BACKEND_URL/health
```

Resposta com banco disponível:

```json
{
  "status": "ok",
  "database": "up",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "uptime": 42
}
```

Resposta com banco indisponível (HTTP 503):

```json
{
  "status": "degraded",
  "database": "down",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Notas

- Migrations do Prisma devem ser aplicadas fora do CI (comando manual ou etapa
  de release) — nunca durante o pipeline de pull request.
- Logs são estruturados (JSON via pino); em produção redirecione stdout para o
  coletor de logs da plataforma escolhida.