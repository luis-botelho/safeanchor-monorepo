-- Pending application to the Supabase database.
-- This migration is additive and does not delete existing data.

CREATE INDEX IF NOT EXISTS "Maintenance_vesselId_idx"
ON public."Maintenance" ("vesselId");

CREATE TABLE IF NOT EXISTS public."PreventiveMaintenance" (
  "id" text NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "type" text NOT NULL,
  "status" text NOT NULL,
  "vesselId" text NOT NULL,
  "periodicity" text NOT NULL,
  "startDate" text NOT NULL,
  "nextExecution" text NOT NULL,
  CONSTRAINT "PreventiveMaintenance_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PreventiveMaintenance_vesselId_fkey"
    FOREIGN KEY ("vesselId") REFERENCES public."Vessel"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "PreventiveMaintenance_vesselId_idx"
ON public."PreventiveMaintenance" ("vesselId");

CREATE TABLE IF NOT EXISTS public."ChecklistTemplate" (
  "id" text NOT NULL,
  "title" text NOT NULL,
  "vesselType" text NOT NULL,
  "items" jsonb NOT NULL,
  CONSTRAINT "ChecklistTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS public."ChecklistExecution" (
  "id" text NOT NULL,
  "templateId" text NOT NULL,
  "vesselId" text NOT NULL,
  "responses" jsonb NOT NULL,
  "executedAt" text NOT NULL,
  CONSTRAINT "ChecklistExecution_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ChecklistExecution_templateId_fkey"
    FOREIGN KEY ("templateId") REFERENCES public."ChecklistTemplate"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ChecklistExecution_vesselId_fkey"
    FOREIGN KEY ("vesselId") REFERENCES public."Vessel"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ChecklistExecution_templateId_idx"
ON public."ChecklistExecution" ("templateId");

CREATE INDEX IF NOT EXISTS "ChecklistExecution_vesselId_idx"
ON public."ChecklistExecution" ("vesselId");
