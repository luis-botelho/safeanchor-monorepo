# SafeAnchor Backend Architecture

## Purpose

This document defines the target backend architecture for SafeAnchor as a production-ready Vertical SaaS platform for the maritime industry.

## Stack

- NestJS
- PostgreSQL 
- Prisma ORM 
- TypeScript 

## Architecture Goals

- Provide a modular backend organized by business capability.
- Enforce validation, authentication, and authorization centrally.
- Keep database access consistent through Prisma.
- Support auditability for maritime safety and compliance workflows.
- Prepare the platform for future marketplace, mobile, IoT, and analytics expansion.

## Proposed Folder Structure

```text
apps/backend
├── src
│   ├── main.ts
│   ├── app.module.ts
│   ├── common
│   │   ├── decorators
│   │   ├── filters
│   │   ├── guards
│   │   ├── interceptors
│   │   └── pipes
│   ├── config
│   │   ├── database.config.ts
│   │   ├── auth.config.ts
│   │   └── app.config.ts
│   ├── modules
│   │   ├── auth
│   │   ├── users
│   │   ├── fleet
│   │   ├── maintenance
│   │   ├── safety
│   │   ├── documents
│   │   └── academy
│   └── prisma
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── prisma
│   ├── schema.prisma
│   └── migrations
└── test
```

## Modular Architecture

Each module should own a business capability and expose only the necessary application boundary.

Recommended modules:

- `auth`: authentication, login, token handling.
- `users`: user profile and account data.
- `fleet`: vessels, status tracking, fleet dashboard.
- `maintenance`: corrective and preventive maintenance.
- `safety`: checklist templates, executions, reports.
- `documents`: document upload, metadata, expiration.
- `academy`: courses, enrollments, certificates.

Each module should generally contain:

```text
module-name
├── dto
├── entities or models
├── module-name.controller.ts
├── module-name.service.ts
├── module-name.repository.ts
└── module-name.module.ts
```

## Controllers

Controllers define HTTP endpoints and handle request/response boundaries.

Responsibilities:

- map routes to use cases;
- receive validated DTOs;
- pass authenticated user context to services;
- return response DTOs;
- avoid business logic.

Example endpoints:

```text
GET    /vessels
POST   /vessels
GET    /vessels/:id
PATCH  /vessels/:id/status
```

## Services

Services contain application business logic.

Responsibilities:

- enforce domain workflows;
- call repositories;
- check ownership rules;
- coordinate multiple repositories when needed;
- publish events in future versions;
- prepare data for response mapping.

Services should not directly depend on HTTP objects such as request or response.

## Repositories

Repositories isolate persistence operations.

Responsibilities:

- execute Prisma queries;
- keep query details out of services;
- provide business-oriented persistence methods;
- centralize includes and filtering logic.

Example:

```text
fleet.repository.ts
```

Potential methods:

```ts
findVesselsByOrganization()
findVesselByIdAndOrganization()
createVessel()
updateVesselStatus()
```

## Prisma Integration

Prisma should be integrated through a shared `PrismaService`.

Recommended location:

```text
src/prisma/prisma.service.ts
```

Usage rules:

- Repositories should use Prisma directly.
- Controllers should not use Prisma.
- Services should prefer repositories over direct Prisma access.
- Migrations must be versioned and reviewed.
- Prisma schema should be aligned with documented database entities.

## Validation

Validation should be performed using DTOs and NestJS validation pipes.

Rules:

- All write endpoints must validate input.
- Required fields must be explicit.
- IDs must be validated before persistence operations.
- Enum values must be restricted.
- Date fields must be validated and normalized.

Recommended tools:

- `class-validator`
- `class-transformer`
- global `ValidationPipe`

## Authentication

Authentication verifies user identity.

MVP target:

- email and password login;
- secure password hashing;
- JWT or secure session strategy;
- authenticated user context available to controllers and services.

Authentication routes:

```text
POST /auth/login
POST /auth/logout
GET  /auth/me
```

## Authorization

Authorization controls what authenticated users can access.

Required authorization dimensions:

- role-based access;
- ownership-based access;
- organization-based access;
- module-level permission checks.

Example roles:

- platform admin;
- organization admin;
- fleet manager;
- crew member;
- training user.

Authorization must be enforced in backend services or guards. Frontend checks are helpful for UX but are not security boundaries.

## Error Handling

Use consistent error handling through NestJS exceptions and filters.

Common error cases:

- `400 Bad Request`: invalid input.
- `401 Unauthorized`: missing or invalid authentication.
- `403 Forbidden`: authenticated but not allowed.
- `404 Not Found`: resource not found or not accessible.
- `409 Conflict`: uniqueness or workflow conflict.

## Observability And Logging

Backend logs should include:

- request method and path;
- user ID when authenticated;
- organization ID when available;
- error stack for unexpected failures;
- domain event context for audit-sensitive actions.

Future observability may include:

- structured JSON logs;
- request tracing;
- metrics;
- alerting.

## Security Considerations

- Hash passwords with a secure algorithm.
- Never expose password hashes.
- Validate all input on the backend.
- Enforce authorization on every private resource.
- Avoid leaking resource existence across ownership boundaries.
- Apply file upload restrictions for documents.
- Store audit metadata for safety and compliance actions.

## Definition Of Done For Backend Features

- Controller endpoint exists and is documented.
- DTO validation is implemented.
- Service enforces business rules.
- Repository encapsulates persistence.
- Authorization is enforced.
- Errors are handled consistently.
- Prisma migration exists when schema changes.
- Tests are added for critical business rules in future phases.

