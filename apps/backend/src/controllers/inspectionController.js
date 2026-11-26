import { hasRequiredStrings } from "../lib/validation.js";
import { getAccessScope } from "../services/accessScopeService.js";
import {
  cancelInspection,
  completeInspection,
  createInspection,
  getInspectionById,
  getInspections,
  getInspectionsByVessel,
  updateChecklistItem,
} from "../services/inspectionService.js";

export async function listInspections(request, response) {
  const scope = await getAccessScope(request.user);
  const inspections = await getInspections(scope, request.app.locals.prisma);

  return response.json(inspections);
}

export async function listInspectionsByVessel(request, response) {
  const scope = await getAccessScope(request.user);
  const inspections = await getInspectionsByVessel(
    scope,
    request.params.vesselId,
    request.app.locals.prisma,
  );

  return response.json(inspections);
}

export async function getInspection(request, response) {
  const scope = await getAccessScope(request.user);
  const inspection = await getInspectionById(
    scope,
    request.params.id,
    request.app.locals.prisma,
  );

  if (!inspection) {
    return response.status(404).json({ message: "Inspection not found" });
  }

  return response.json(inspection);
}

export async function createNewInspection(request, response) {
  const body = request.body;

  if (
    !hasRequiredStrings(body, ["vesselId", "type", "inspector"], 120) ||
    !hasRequiredStrings(body, ["scheduledAt"], 40)
  ) {
    return response.status(400).json({
      message: "Vessel, type, scheduledAt and inspector are required",
    });
  }

  const scope = await getAccessScope(request.user);
  const inspection = await createInspection(
    scope,
    body,
    request.app.locals.prisma,
  );

  if (!inspection) {
    return response.status(404).json({ message: "Vessel not found" });
  }

  return response.status(201).json(inspection);
}

export async function updateInspectionChecklist(request, response) {
  const scope = await getAccessScope(request.user);
  const itemIndex = Number(request.params.itemIndex);

  if (!Number.isInteger(itemIndex) || itemIndex < 0) {
    return response.status(400).json({ message: "Invalid checklist item" });
  }

  if (
    !hasRequiredStrings(request.body, ["status"], 40) ||
    (request.body.notes !== undefined &&
      typeof request.body.notes !== "string")
  ) {
    return response.status(400).json({ message: "Invalid checklist payload" });
  }

  const inspection = await updateChecklistItem(
    scope,
    request.params.id,
    itemIndex,
    request.body.status,
    request.body.notes,
    request.app.locals.prisma,
  );

  if (!inspection) {
    return response.status(404).json({ message: "Inspection not found" });
  }

  return response.json(inspection);
}

export async function finishInspection(request, response) {
  const scope = await getAccessScope(request.user);
  const inspection = await completeInspection(
    scope,
    request.params.id,
    request.app.locals.prisma,
  );

  if (!inspection) {
    return response.status(404).json({
      message: "Inspection not found or checklist is incomplete",
    });
  }

  return response.json(inspection);
}

export async function cancelNewInspection(request, response) {
  const scope = await getAccessScope(request.user);
  const inspection = await cancelInspection(
    scope,
    request.params.id,
    request.app.locals.prisma,
  );

  if (!inspection) {
    return response.status(404).json({ message: "Inspection not found" });
  }

  return response.json(inspection);
}
