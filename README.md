# ⚓ SafeAnchor

> Digitalizing fleet management, operational safety and professional training for the maritime industry.

SafeAnchor is a Vertical SaaS platform designed for vessel owners, maritime professionals and service providers.

The platform centralizes fleet management, maintenance tracking, document compliance, safety inspections and professional development into a single ecosystem.

---

## 🚀 Vision

To become the operating system of the maritime industry.

---

## 🎯 Problem

The maritime sector still relies heavily on:

- Spreadsheets
- Paper documentation
- Manual inspections
- Fragmented maintenance records
- Decentralized professional training

These processes increase operational risks, reduce efficiency and make compliance difficult.

---

## 💡 Solution

SafeAnchor provides a unified platform where users can:

- Manage vessels
- Track maintenance
- Monitor documentation
- Execute safety checklists
- Access maritime training

All in one place.

---

## Stack atual

- Frontend: React com Vite.
- Backend: Node.js com Express 5.
- Persistencia: PostgreSQL hospedado no Supabase.
- ORM: Prisma 7 com `@prisma/adapter-pg`.

## Desenvolvimento local

O frontend e o backend possuem dependencias e comandos separados:

```bash
cd apps/backend
cp .env.example .env
npm ci
npm run prisma:validate
npm run prisma:generate
npm test
npm start
```

Em outro terminal:

```bash
cd apps/frontend
npm ci
npm run build
```

O arquivo `apps/backend/.env.example` documenta as variaveis sem conter
credenciais. Consulte o [README do backend](apps/backend/README.md) para os
comandos de migrations e baseline.
