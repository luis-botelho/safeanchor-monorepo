# SafeAnchor MVP Roadmap

## Product Context

SafeAnchor is a Vertical SaaS platform for the maritime industry. The product helps vessel owners, fleet operators, maritime professionals, service providers, and training organizations centralize operational management, improve compliance, and increase safety across maritime workflows.

The MVP roadmap focuses on establishing the core operational foundation required to manage vessels, maintenance, safety routines, compliance documents, training, and platform infrastructure.

## Roadmap Principles

- Prioritize operational safety and compliance.
- Deliver value incrementally by module.
- Build reusable platform foundations before scaling advanced workflows.
- Keep each feature measurable, testable, and aligned with maritime operations.
- Support future expansion into marketplace, IoT, AIS integrations, and predictive maintenance.

## MVP Epic Overview

| Epic | Name | Objective |
| --- | --- | --- |
| EPIC 001 | Fleet Management Foundation | Establish vessel records, status visibility, and fleet-level overview. |
| EPIC 002 | Maintenance Management | Enable maintenance planning, history, and operational tracking. |
| EPIC 003 | Safety Checklists | Digitize safety routines, inspection execution, and reporting. |
| EPIC 004 | Document Management | Centralize vessel documents, expiration control, and compliance visibility. |
| EPIC 005 | Maritime Academy | Provide training catalog, enrollment, progress tracking, and certificates. |
| EPIC 006 | Platform & Infrastructure | Provide the technical foundation for secure and scalable SaaS operations. |

## EPIC 001 - Fleet Management Foundation

### Objective

Create the foundational fleet module that allows users to register, view, and monitor vessels.

### Features

| ID | Feature | Description | Outcome |
| --- | --- | --- | --- |
| Feature 001 | Vessel Listing | Display vessels associated with the authenticated user or organization. | Users can access an organized list of vessels. |
| Feature 002 | Vessel Registration | Allow users to create vessel records with required operational data. | Users can onboard vessels into the platform. |
| Feature 003 | Vessel Details | Provide a detailed vessel profile with core attributes and related information. | Users can inspect vessel data in one place. |
| Feature 004 | Vessel Status Tracking | Track operational status such as active, inactive, under maintenance, or blocked. | Users can understand fleet readiness. |
| Feature 005 | Fleet Dashboard | Provide aggregated fleet metrics and status cards. | Users can monitor fleet health at a glance. |

### MVP Acceptance Criteria

- A user can view only vessels they are allowed to access.
- A user can create a vessel with required fields.
- Each vessel has a visible status.
- The dashboard summarizes total vessels and status distribution.

## EPIC 002 - Maintenance Management

### Objective

Provide a structured way to register, monitor, and review vessel maintenance activities.

### Features

| ID | Feature | Description | Outcome |
| --- | --- | --- | --- |
| Feature 006 | Maintenance Listing | Display maintenance records by vessel, status, and date. | Users can track maintenance activities. |
| Feature 007 | Maintenance Registration | Allow users to register corrective or preventive maintenance. | Maintenance events are captured in the system. |
| Feature 008 | Maintenance History | Show historical maintenance per vessel. | Users can review past interventions. |
| Feature 009 | Preventive Maintenance | Support scheduled preventive maintenance routines. | Users can anticipate operational issues. |
| Feature 010 | Maintenance Dashboard | Provide maintenance metrics and upcoming work visibility. | Users can manage workload and risk. |

### MVP Acceptance Criteria

- Maintenance records are associated with a vessel.
- Maintenance can be categorized by type and status.
- Preventive maintenance can have a due date.
- History is preserved after maintenance completion.

## EPIC 003 - Safety Checklists

### Objective

Digitize recurring safety inspections and create traceable operational records.

### Features

| ID | Feature | Description | Outcome |
| --- | --- | --- | --- |
| Feature 011 | Checklist Templates | Create reusable checklist templates for safety routines. | Users can standardize inspections. |
| Feature 012 | Checklist Execution | Allow users to execute checklists and record answers. | Safety checks become digital records. |
| Feature 013 | Inspection History | Store and display completed checklist executions. | Users can audit past inspections. |
| Feature 014 | QR Code Checklists | Enable quick access to vessel checklists through QR codes. | Operators can execute checklists in the field. |
| Feature 015 | Safety Reports | Generate safety summaries from checklist results. | Managers can identify issues and trends. |

### MVP Acceptance Criteria

- Checklist templates can contain multiple items.
- Executions are linked to a vessel and user.
- Completed inspections are immutable audit records.
- Failed items can be highlighted in reports.

## EPIC 004 - Document Management

### Objective

Centralize operational and compliance documents with expiration tracking.

### Features

| ID | Feature | Description | Outcome |
| --- | --- | --- | --- |
| Feature 016 | Document Listing | Display documents by vessel, type, and expiration status. | Users can find documents quickly. |
| Feature 017 | Document Upload | Allow users to upload and classify documents. | Documents are centralized in SafeAnchor. |
| Feature 018 | Expiration Tracking | Track expiration dates and highlight upcoming deadlines. | Users can avoid compliance gaps. |
| Feature 019 | Vessel Documents | Show all documents related to a specific vessel. | Vessel records become compliance-ready. |
| Feature 020 | Compliance Dashboard | Provide compliance status by vessel and fleet. | Managers can monitor regulatory readiness. |

### MVP Acceptance Criteria

- Documents are associated with vessels.
- Required metadata is captured.
- Expired and soon-to-expire documents are visible.
- Compliance dashboard summarizes document risk.

## EPIC 005 - Maritime Academy

### Objective

Provide a basic training experience for maritime professionals.

### Features

| ID | Feature | Description | Outcome |
| --- | --- | --- | --- |
| Feature 021 | Course Catalog | Display available courses and training paths. | Users can discover training content. |
| Feature 022 | Course Details | Provide course description, duration, requirements, and outcomes. | Users can evaluate course relevance. |
| Feature 023 | Enrollment | Allow users to enroll in courses. | Training participation is tracked. |
| Feature 024 | Progress Tracking | Track course progress per enrolled user. | Users and managers can monitor completion. |
| Feature 025 | Certificates | Issue certificates after completion. | Users receive proof of training. |

### MVP Acceptance Criteria

- Users can browse courses.
- Users can enroll in available courses.
- Progress can be updated.
- Certificates are generated only after completion.

## EPIC 006 - Platform & Infrastructure

### Objective

Create the core technical foundation required for a secure, observable, and deployable SaaS platform.

### Features

| ID | Feature | Description | Outcome |
| --- | --- | --- | --- |
| Feature 026 | Database Foundation | Establish PostgreSQL schema and migrations. | Data can be persisted safely. |
| Feature 027 | Authentication | Implement secure login and user identity. | Users can access the system securely. |
| Feature 028 | Authorization | Control access by role and ownership. | Users see only permitted data. |
| Feature 029 | Observability & Logging | Add structured logs and basic monitoring. | The team can diagnose production issues. |
| Feature 030 | CI/CD & Deployment | Automate build, test, and deployment flows. | Releases become repeatable and reliable. |

### MVP Acceptance Criteria

- Database migrations are versioned.
- Authentication protects private routes.
- Authorization is enforced on backend endpoints.
- Logs include request and error context.
- Deployment pipeline can release frontend and backend.

## Suggested Delivery Sequence

1. EPIC 006 - Database Foundation, Authentication, and Authorization.
2. EPIC 001 - Fleet Management Foundation.
3. EPIC 002 - Maintenance Management.
4. EPIC 004 - Document Management.
5. EPIC 003 - Safety Checklists.
6. EPIC 005 - Maritime Academy.
7. EPIC 006 - Observability, Logging, CI/CD, and Deployment hardening.

## MVP Completion Definition

The MVP is considered complete when:

- users can authenticate;
- users can manage vessels;
- users can register maintenance records;
- users can execute safety checklists;
- users can upload and track vessel documents;
- users can access basic training content;
- administrators can monitor core operational dashboards;
- data access respects ownership and authorization rules.

