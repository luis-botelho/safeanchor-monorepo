# SafeAnchor Frontend Architecture

## Purpose

This document defines the target frontend architecture for SafeAnchor as a production-ready Vertical SaaS platform for the maritime industry.

The current learning implementation may be simpler, but this document describes the intended scalable frontend architecture.

## Stack

- Next.js
- TypeScript
- Redux Toolkit
- MVVM Architecture
- CSS Modules or BEM-compatible styling strategy
- API client layer
- Feature-based organization

## Architecture Goals

- Keep domain features isolated and maintainable.
- Separate rendering concerns from state and business logic.
- Provide predictable state management.
- Support authenticated routing and role-based UI behavior.
- Enable scalable frontend development across Fleet, Maintenance, Safety, Documents, Academy, and Platform modules.
- Keep API integrations centralized and testable.

## Proposed Folder Structure

```text
apps/frontend
├── src
│   ├── app
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   ├── (auth)
│   │   └── (dashboard)
│   ├── components
│   │   ├── ui
│   │   ├── layout
│   │   └── feedback
│   ├── features
│   │   ├── fleet
│   │   │   ├── models
│   │   │   ├── services
│   │   │   ├── viewmodels
│   │   │   ├── views
│   │   │   ├── components
│   │   │   └── store
│   │   ├── maintenance
│   │   ├── safety
│   │   ├── documents
│   │   └── academy
│   ├── lib
│   │   ├── api
│   │   ├── auth
│   │   ├── config
│   │   └── formatters
│   ├── store
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── rootReducer.ts
│   ├── types
│   └── styles
└── public
```

## MVVM Pattern

SafeAnchor frontend should use MVVM to separate UI rendering from screen behavior and data orchestration.

### Model

Models define the shape of frontend data and domain contracts.

Examples:

- `Vessel`
- `Maintenance`
- `Document`
- `ChecklistTemplate`
- `ChecklistExecution`
- `Course`
- `Enrollment`

Models should be TypeScript types or interfaces and should remain framework-independent.

### View

Views are React components responsible for rendering UI.

Rules:

- Views should not call `fetch` directly.
- Views should not contain complex business rules.
- Views should receive prepared data from ViewModels.
- Views should delegate reusable UI to components.

Example:

```text
features/fleet/views/VesselListView.tsx
```

### ViewModel

ViewModels manage view-specific behavior, state composition, derived data, and interaction handlers.

In React, ViewModels should usually be custom hooks.

Example:

```text
features/fleet/viewmodels/useVesselListViewModel.ts
```

Responsibilities:

- load data from services;
- expose loading and error state;
- prepare data for rendering;
- provide event handlers;
- coordinate local state and Redux state when needed.

## ViewModels

ViewModels should be named using the target view or use case.

Examples:

```text
useVesselListViewModel
useVesselDetailsViewModel
useMaintenanceDashboardViewModel
useChecklistExecutionViewModel
useDocumentExpirationViewModel
useCourseCatalogViewModel
```

Recommended ViewModel return shape:

```ts
type VesselListViewModel = {
  vessels: VesselListItem[];
  isLoading: boolean;
  errorMessage?: string;
  filters: VesselFilters;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: VesselStatus) => void;
  onCreateVessel: () => void;
};
```

## Services

Services represent feature-level application operations.

Examples:

```text
features/fleet/services/vesselService.ts
features/maintenance/services/maintenanceService.ts
features/documents/services/documentService.ts
```

Responsibilities:

- call API layer functions;
- transform API responses when needed;
- keep HTTP details out of Views and ViewModels;
- provide clear feature-level methods.

Example methods:

```ts
listVessels()
getVesselById(id)
createVessel(payload)
updateVesselStatus(id, status)
```

## API Layer

The API layer centralizes HTTP behavior.

Recommended location:

```text
src/lib/api
├── apiClient.ts
├── apiError.ts
└── endpoints.ts
```

Responsibilities:

- configure base URL;
- attach authentication tokens;
- handle common errors;
- normalize response parsing;
- support request cancellation when appropriate.

API clients should not be scattered across components.

## State Management

SafeAnchor should use Redux Toolkit for shared application state.

Recommended use cases:

- authenticated user session;
- organization context;
- global permissions;
- dashboard filters shared across pages;
- cached lists needed across multiple screens;
- global notifications.

Avoid using Redux for:

- purely local form state;
- temporary modal state;
- simple component-only toggles.

Recommended store structure:

```text
src/store
├── index.ts
├── hooks.ts
├── rootReducer.ts
└── slices
    ├── authSlice.ts
    ├── organizationSlice.ts
    └── notificationSlice.ts
```

Feature-specific slices may live inside feature folders when tightly coupled to that domain.

## Routing

Next.js App Router should organize routes by product areas.

Suggested route groups:

```text
src/app
├── (auth)
│   ├── login
│   └── forgot-password
├── (dashboard)
│   ├── fleet
│   │   ├── page.tsx
│   │   ├── new
│   │   └── [vesselId]
│   ├── maintenance
│   ├── safety
│   ├── documents
│   └── academy
└── layout.tsx
```

Routing rules:

- public routes belong to `(auth)` or public groups;
- private routes belong to `(dashboard)`;
- route-level authorization should redirect unauthorized users;
- backend authorization must still be enforced independently.

## Component Organization

### UI Components

Reusable design-system primitives:

```text
components/ui/Button.tsx
components/ui/Input.tsx
components/ui/Select.tsx
components/ui/Table.tsx
components/ui/Badge.tsx
```

### Layout Components

Application structure:

```text
components/layout/AppShell.tsx
components/layout/Sidebar.tsx
components/layout/Header.tsx
components/layout/PageHeader.tsx
```

### Feature Components

Domain-specific components should stay inside feature folders.

Examples:

```text
features/fleet/components/VesselStatusBadge.tsx
features/maintenance/components/MaintenanceTimeline.tsx
features/documents/components/ExpirationBadge.tsx
```

## Error Handling

Frontend error handling should include:

- field-level validation messages;
- request error messages;
- empty states;
- permission denied states;
- retry actions for recoverable failures;
- global error boundary for unexpected crashes.

## Security Considerations

- Do not store sensitive data unnecessarily in Redux.
- Never rely only on frontend authorization.
- Sanitize user-generated content before rendering.
- Use secure token storage strategy aligned with backend authentication model.
- Hide UI actions users cannot perform, but enforce permissions on the backend.

## Performance Considerations

- Use route-level code splitting from Next.js.
- Avoid loading dashboard-heavy data globally.
- Paginate large lists.
- Use memoization only where it solves measurable rendering cost.
- Prefer server-side data loading for SEO/public pages and client-side loading for authenticated operational workflows when appropriate.

## Definition Of Done For Frontend Features

- View, ViewModel, Service, and Model responsibilities are separated.
- Loading, error, empty, and success states are handled.
- API calls are centralized in services or API layer.
- Shared state uses Redux Toolkit only when justified.
- Components follow established organization.
- Routes enforce expected access behavior.
- UI is responsive and accessible.

