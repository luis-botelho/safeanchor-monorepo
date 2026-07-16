# 📚 Learning Report — EPIC 002

# Maintenance Management

## Objetivo
Implementar o gerenciamento completo de manutenções das embarcações.

O objetivo foi transformar o SafeAnchor em um sistema capaz de controlar a operação da frota.

---

# Funcionalidades Desenvolvidas

- Maintenance Listing
- Maintenance Registration
- Maintenance History
- Preventive Maintenance
- Maintenance Dashboard

---

# Arquitetura Implementada
Além da arquitetura criada na EPIC 001, foram adicionados:

- Dashboard Services
- Relacionamentos entre entidades
- Serviços especializados
- Organização por domínio

---

# Conceitos Aprendidos

## Relacionamentos

- Vessel → Maintenances (1)

## MVVM
Reutilização completa da arquitetura para um novo módulo.

## CRUD
Implementação repetida do fluxo completo.

## Dashboard
Primeiro endpoint responsável por retornar indicadores ao invés de entidades.

## Single Responsibility Principle
Separação do Dashboard em um Service próprio.

## Git Flow
Fluxo completo de Feature Branches, Merge e Releases.

## Planejamento
Construção da Epic baseada em:

Epic

↓

Features

↓

Sub-Issues

↓

Implementação

---

# Problemas Encontrados

- Organização das responsabilidades dos Services
- Nomeação dos ViewModels
- Definição da estrutura de pastas
- Fluxo de Git durante algumas branches

---

# Decisões Arquiteturais

- Não modularizar por domínio neste momento
- Adiar Design System
- Adiar UI/UX
- Priorizar entrega do MVP
- Criar Services específicos para Dashboard

---

# Lições Aprendidas
Foi nesta Epic que o projeto deixou de parecer um CRUD e começou a se comportar como um produto.

O desenvolvimento passou a ser guiado por planejamento ao invés de implementação isolada.

Também foi possível compreender melhor o papel de um Product Owner durante o desenvolvimento.

---

# Próximos Passos
Construção da EPIC 003 — Safety Checklists.
