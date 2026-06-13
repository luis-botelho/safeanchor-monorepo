# SafeAnchor Business Rules

## Purpose

This document defines the business rules for the SafeAnchor MVP. These rules should guide product decisions, backend validation, frontend behavior, authorization policies, and acceptance criteria.

## Global Rules

### Ownership Rules

- Every operational resource must be associated with an owner, organization, or vessel.
- Users must not access resources outside their authorized ownership scope.
- Administrative users may manage organization-level resources according to role permissions.
- Audit-sensitive records must retain creator and timestamp metadata.

### Access Rules

- Unauthenticated users cannot access private operational data.
- Authenticated users can only access modules enabled for their account.
- Role-based permissions must be enforced in the backend.
- Frontend route protection is required but must not be the only security layer.

### Validation Rules

- Required fields must be validated before persistence.
- Backend validation is mandatory for all write operations.
- IDs must be validated before database queries.
- Dates must use a consistent timezone strategy.
- Status transitions must follow allowed domain workflows.

## Fleet Management

### Validation Rules

- A vessel must have a name.
- A vessel must have an owner or organization.
- Vessel registration identifiers must be unique within the relevant ownership scope when provided.
- Vessel status must match an allowed value.
- Vessel profile fields should support future regulatory and operational metadata.

### Access Rules

- Users can list only vessels they own or are authorized to manage.
- Fleet managers can view all vessels within their organization.
- Crew members may have read-only access depending on role.
- Unauthorized users cannot view vessel details.

### Ownership Rules

- A vessel belongs to one primary owner or organization.
- Related maintenance, documents, and checklist executions inherit vessel ownership scope.
- Ownership transfer must be explicit and auditable in future versions.

### Status Rules

- Allowed MVP statuses should include active, inactive, under maintenance, and blocked.
- A vessel with critical expired documents may be marked as compliance risk.
- A vessel under active maintenance may be excluded from ready-to-operate counts.

## Maintenance Management

### Validation Rules

- A maintenance record must be linked to a vessel.
- A maintenance record must have a type.
- A maintenance record must have a status.
- Preventive maintenance must have a due date.
- Completed maintenance must have a completion date.
- Maintenance cost should not be negative when provided.

### Access Rules

- Users can view maintenance only for vessels they can access.
- Users with maintenance permissions can create and update maintenance records.
- Read-only users cannot modify maintenance records.

### Ownership Rules

- Maintenance records inherit ownership from the related vessel.
- Maintenance history must remain associated with the vessel even if vessel status changes.
- Completed maintenance records should not be deleted without administrative permission.

### Expiration And Scheduling Rules

- Preventive maintenance becomes upcoming when it is within the configured warning window.
- Preventive maintenance becomes overdue after the due date passes without completion.
- Completed maintenance must be stored in history.
- Maintenance dashboard must distinguish upcoming, overdue, in-progress, and completed records.

## Safety Checklists

### Validation Rules

- A checklist template must have a name.
- A checklist template must contain at least one checklist item before it can be executed.
- A checklist execution must be linked to a vessel.
- Each required checklist item must receive an answer before completion.
- Failed or non-compliant answers must be stored for reporting.

### Access Rules

- Users can execute checklists only for vessels they can access.
- Only authorized roles can create or update checklist templates.
- Completed checklist executions should be read-only for standard users.

### Ownership Rules

- Checklist templates may belong to an organization or be global in future versions.
- Checklist executions inherit vessel ownership.
- Execution history must preserve executor identity and timestamp.

### Audit Rules

- Completed checklist executions must not be silently modified.
- Any correction should be recorded as a new version or administrative amendment.
- Safety reports must use completed checklist execution data.

## Document Management

### Validation Rules

- A document must be linked to a vessel.
- A document must have a type or category.
- Uploaded files must follow allowed file type and size rules.
- Expiration date is required for documents that expire.
- Document status must be derived from expiration and review state.

### Access Rules

- Users can view documents only for vessels they can access.
- Only authorized users can upload, replace, or archive documents.
- Sensitive documents may require elevated permission in future versions.

### Ownership Rules

- Documents inherit ownership from the related vessel.
- Document metadata must remain available even if the file is replaced.
- Archived documents should remain auditable.

### Expiration Rules

- A document is valid when the expiration date is in the future and no blocking issue exists.
- A document is expiring soon when it falls within the configured warning window.
- A document is expired when the expiration date is before the current date.
- Compliance dashboards must surface expired and expiring soon documents.

## Maritime Academy

### Validation Rules

- A course must have a title.
- A course must have a status.
- Enrollment must be linked to a user and course.
- Progress must remain between 0 and 100 percent.
- Certificates can only be issued after completion criteria are met.

### Access Rules

- Users can browse available courses.
- Users can view their own enrollments.
- Managers may view progress for users in their organization.
- Only authorized roles can create or publish courses.

### Enrollment Rules

- A user cannot enroll in the same active course twice.
- Enrollment status should include enrolled, in progress, completed, cancelled, or expired.
- Course progress must be associated with a specific enrollment.
- Completion date is required when enrollment is completed.

### Certificate Rules

- A certificate must be linked to a completed enrollment.
- A certificate must have an issued date.
- Certificate identifiers must be unique.
- Certificates may have expiration dates depending on course type.

