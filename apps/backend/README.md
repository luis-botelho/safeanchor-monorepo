# Backend

API simples em JavaScript ESM com Express 5, Prisma 7 e PostgreSQL hospedado
no Supabase.

## Estrutura

```text
src
├── server.js       # Configura e inicia a API na porta 3001
├── routes          # Define os endpoints
├── controllers     # Recebe requests e monta responses
├── services        # Regras e consultas com Prisma
└── lib/prisma.js   # Instancia central do Prisma Client
```

O fluxo continua simples:

```text
Route -> Controller -> Service -> Prisma -> PostgreSQL
```

## Configuracao

Crie o arquivo local de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

- `DATABASE_URL`: conexao usada pela aplicacao em runtime, normalmente pelo
  pooler de transacoes do Supabase.
- `DIRECT_URL`: conexao direta ou pelo pooler de sessao, usada pelo Prisma CLI
  para comparar schemas e administrar migrations.

O `.env` nunca deve ser versionado.

## Instalacao e validacao

```bash
npm ci
npm run prisma:validate
npm run prisma:generate
npm test
npm start
```

O `postinstall` tambem gera o Prisma Client. O projeto usa o gerador
`prisma-client-js` porque o backend e JavaScript ESM e nao deve depender da
execucao direta de arquivos TypeScript gerados. O acesso ao PostgreSQL continua
usando `@prisma/adapter-pg`.

## Migrations e baseline

A migration `prisma/migrations/0_init/migration.sql` representa o schema
completo dos cinco modelos atuais. Ela foi gerada com:

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema=prisma/schema.prisma \
  --script \
  --output=prisma/migrations/0_init/migration.sql
```

Quando um banco ja possui exatamente esse schema, compare primeiro:

```bash
npx prisma migrate diff \
  --from-config-datasource \
  --to-schema=prisma/schema.prisma \
  --script
```

Somente com diff vazio, marque a baseline como aplicada:

```bash
npx prisma migrate resolve --applied 0_init
```

Para consultar o estado depois:

```bash
npm run prisma:status
```

A baseline `0_init` esta registrada no banco Supabase atual. O diff estrutural
foi confirmado como vazio antes do registro, e `prisma migrate status` indica
que o schema esta atualizado.

Nunca use `prisma migrate reset` ou `prisma db push` no projeto remoto.

## Testes verificados nesta fundacao

- validacao e geracao do Prisma Client;
- teste nativo do Node para `GET /` e resposta HTTP 200;
- inicializacao da API na porta 3001;
- build do frontend.

O smoke test que escreve no Supabase so deve ser executado quando
`ALLOW_DATABASE_SMOKE=true` estiver definido:

```bash
ALLOW_DATABASE_SMOKE=true npm run test:db:smoke
```

O teste cria dados com marcador unico `codex-smoke-<timestamp>`, registra todos
os IDs e remove somente esses IDs no bloco `finally`. O fluxo completo passou
contra o Supabase, incluindo CRUD de Vessel, criacao dos quatro registros
relacionados, consultas por `vesselId`, cascatas e confirmacao de limpeza.

## Acesso e seguranca

As cinco tabelas de dominio permanecem no schema `public`, mas possuem RLS
habilitado e nao concedem privilegios a `anon` nem `authenticated`. Nao existem
policies publicas. Portanto, o acesso atual acontece exclusivamente pelo
backend Express usando a conexao PostgreSQL do Prisma.

Policies de propriedade so devem ser adicionadas quando autenticacao e
autorizacao fizerem parte do escopo. Ate la, o frontend nao deve consultar as
tabelas diretamente pela Data API do Supabase.
