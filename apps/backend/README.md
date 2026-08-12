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

Nunca use `prisma migrate reset` ou `prisma db push` no projeto remoto.

## Testes verificados nesta fundacao

- validacao e geracao do Prisma Client;
- teste nativo do Node para `GET /` e resposta HTTP 200;
- inicializacao da API na porta 3001;
- build do frontend.

O smoke test que escreve no Supabase so deve ser executado quando
`ALLOW_DATABASE_SMOKE=true` estiver definido. Resultados remotos devem ser
registrados apenas depois da execucao real.
