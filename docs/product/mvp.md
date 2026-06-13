# SafeAnchor MVP

## Product Vision

SafeAnchor is a Vertical SaaS platform designed to modernize maritime operations by centralizing vessel management, maintenance workflows, safety inspections, compliance documents, and professional training.

The MVP vision is to provide a reliable operational command center for vessel owners and maritime teams, reducing manual controls and improving safety, visibility, and compliance readiness.

## Problem Statement

Maritime operations often depend on spreadsheets, paper checklists, scattered documents, informal communication, and disconnected training records. This creates operational risk, poor traceability, missed maintenance deadlines, expired documents, and limited visibility into vessel readiness.

SafeAnchor addresses this by creating a single digital platform for managing critical operational data and workflows.

## Target Audience

### Primary Users

- Vessel owners.
- Fleet managers.
- Captains and crew members.
- Maritime operations coordinators.

### Secondary Users

- Maintenance service providers.
- Safety inspectors.
- Maritime training providers.
- Administrative and compliance teams.

## Value Proposition

SafeAnchor helps maritime teams:

- centralize vessel information;
- reduce missed maintenance and document deadlines;
- digitize safety routines;
- improve operational traceability;
- monitor fleet status;
- connect training progress with operational readiness;
- prepare for future compliance and audit requirements.

## Product Modules

### Fleet Management

Manages vessel registration, vessel profiles, status tracking, and fleet overview.

### Maintenance Management

Manages corrective maintenance, preventive maintenance, maintenance history, and maintenance dashboards.

### Safety Checklists

Manages checklist templates, checklist execution, inspection history, QR code access, and safety reporting.

### Document Management

Manages document uploads, document listing, expiration tracking, vessel documents, and compliance dashboard.

### Maritime Academy

Manages course catalog, course details, enrollment, progress tracking, and certificates.

### Platform & Infrastructure

Provides database, authentication, authorization, observability, logging, deployment, and operational foundations.

## Success Metrics

### Activation Metrics

- Number of organizations created.
- Number of users invited.
- Number of vessels registered.
- Time from signup to first vessel registration.

### Engagement Metrics

- Weekly active users.
- Number of maintenance records created.
- Number of checklist executions completed.
- Number of documents uploaded.
- Number of course enrollments.

### Operational Metrics

- Percentage of vessels with complete profile data.
- Percentage of vessels with valid documents.
- Number of upcoming maintenance alerts.
- Number of overdue maintenance records.
- Number of failed checklist items.

### Business Metrics

- Trial-to-paid conversion rate.
- Monthly recurring revenue.
- Churn rate.
- Account expansion by fleet size.

## Scope Included

The MVP includes:

- user authentication;
- role-based authorization;
- vessel listing, registration, details, status tracking, and dashboard;
- maintenance listing, registration, history, preventive maintenance, and dashboard;
- checklist templates, execution, inspection history, QR code access, and reports;
- document listing, upload, expiration tracking, vessel documents, and compliance dashboard;
- course catalog, course details, enrollment, progress tracking, and certificates;
- PostgreSQL database foundation;
- Prisma ORM integration;
- basic observability and logging;
- deployment pipeline foundation.

## Scope Excluded

The MVP does not include:

- mobile app;
- offline-first checklist execution;
- AIS integration;
- IoT sensor integration;
- predictive maintenance with AI;
- full marketplace for service providers;
- payment processing;
- multi-language support;
- advanced analytics;
- native document signing;
- complex certification authority workflows;
- advanced notification automation beyond MVP alerts.

## MVP Assumptions

- Each vessel belongs to an owner or organization.
- Users can only access resources they own or are authorized to manage.
- Documents and maintenance records are tied to vessels.
- Safety checklist executions must remain auditable.
- Certificates are issued only after course completion.

## MVP Risks

- Maritime compliance rules may vary by country or vessel category.
- Document expiration rules may require localization.
- QR code checklist execution may require mobile-first optimization.
- Authorization complexity may increase with multi-organization accounts.
- Data model decisions must support future marketplace and IoT expansion.

