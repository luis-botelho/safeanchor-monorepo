import prisma from "../lib/prisma.js";
import {
  buildVesselLinkedScopeFilter,
  buildVesselScopeFilter,
} from "./accessScopeService.js";

function buildCertificate(inspection) {
  const validUntil = new Date(inspection.completedAt);
  validUntil.setMonth(validUntil.getMonth() + 6);

  return {
    id: `cert-${Date.now()}`,
    issuedAt: inspection.completedAt,
    validUntil: validUntil.toISOString().split("T")[0],
    inspector: inspection.inspector,
    type:
      inspection.type === "safety"
        ? "Certificado de Segurança"
        : "Certificado de Inspeção",
  };
}

async function findScopedInspection(scope, id, db) {
  return db.inspection.findFirst({
    where: {
      id,
      ...buildVesselLinkedScopeFilter(scope),
    },
  });
}

export async function getInspections(scope, db = prisma) {
  return db.inspection.findMany({
    where: buildVesselLinkedScopeFilter(scope),
    orderBy: { scheduledAt: "desc" },
  });
}

export async function getInspectionsByVessel(scope, vesselId, db = prisma) {
  return db.inspection.findMany({
    where: {
      ...buildVesselLinkedScopeFilter(scope),
      vesselId,
    },
    orderBy: { scheduledAt: "desc" },
  });
}

export async function getInspectionById(scope, id, db = prisma) {
  return findScopedInspection(scope, id, db);
}

export async function createInspection(scope, data, db = prisma) {
  const vessel = await db.vessel.findFirst({
    where: {
      id: data.vesselId,
      ...buildVesselScopeFilter(scope),
    },
  });

  if (!vessel) {
    return null;
  }

  return db.inspection.create({
    data: {
      vesselId: data.vesselId,
      type: data.type,
      status: "SCHEDULED",
      scheduledAt: data.scheduledAt,
      inspector: data.inspector,
      notes: data.notes || null,
      checklist: Array.isArray(data.checklist) ? data.checklist : [],
      createdAt: new Date().toISOString(),
    },
  });
}

export async function updateChecklistItem(
  scope,
  inspectionId,
  itemIndex,
  status,
  notes,
  db = prisma,
) {
  const inspection = await findScopedInspection(scope, inspectionId, db);

  if (!inspection || !inspection.checklist[itemIndex]) {
    return null;
  }

  const checklist = inspection.checklist.map((item, index) =>
    index === itemIndex ? { ...item, status, notes: notes || "" } : item,
  );

  return db.inspection.update({
    where: { id: inspectionId },
    data: { checklist, status: "IN_PROGRESS" },
  });
}

export async function completeInspection(scope, inspectionId, db = prisma) {
  const inspection = await findScopedInspection(scope, inspectionId, db);

  if (!inspection || inspection.status === "CANCELLED") {
    return null;
  }

  const allReviewed = inspection.checklist.every(
    (item) => item.status !== "pending",
  );

  if (!allReviewed) {
    return null;
  }

  const completedAt = new Date().toISOString();
  const hasFailure = inspection.checklist.some(
    (item) => item.status === "failed",
  );
  const completed = {
    ...inspection,
    status: "COMPLETED",
    completedAt,
  };

  return db.inspection.update({
    where: { id: inspectionId },
    data: {
      status: "COMPLETED",
      completedAt,
      certificate: hasFailure ? null : buildCertificate(completed),
    },
  });
}

export async function cancelInspection(scope, inspectionId, db = prisma) {
  const inspection = await findScopedInspection(scope, inspectionId, db);

  if (!inspection) {
    return null;
  }

  return db.inspection.update({
    where: { id: inspectionId },
    data: { status: "CANCELLED" },
  });
}
