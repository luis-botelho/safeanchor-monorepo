# 003 — Sprint Retrospective

## O que deu muito certo?

- Entrega de manutenções preventivas com listagem e cadastro.
- Implementação da arquitetura MVVM em novos módulos.
- Integração frontend/backend funcionando via API REST.

## O que deu errado?

- Nomeação de arquivos e imports no frontend causaram falhas de build.
- Falta de rotas GET no backend para endpoints usados pelo frontend.
- Organização inicial de serviços ainda estava confusa.

## O que podemos melhorar?

- Definir um padrão de naming e estrutura de pastas mais cedo.
- Garantir que toda nova feature tenha documentação de arquitetura.
- Criar testes básicos para endpoints e fluxos críticos.

## Dívidas técnicas geradas

- Endpoint de listagem preventiva criado apenas após problema no frontend.
- Falta de validação consistente de payloads na API.
- Dependências e configurações do frontend não estavam sincronizadas.

## Ações para a próxima Sprint

- Documentar o padrão de pastas e naming na raiz `docs/`.
- Criar EPIC 003 com foco em Safety Checklists.
- Adicionar testes automatizados para rotas e componentes principais.
