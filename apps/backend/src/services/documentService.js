import prisma from "../lib/prisma.js";
import {
  buildVesselLinkedScopeFilter,
  buildVesselScopeFilter,
} from "./accessScopeService.js";

export async function getDocuments(scope, db = prisma) {
  return db.document.findMany({
    where: buildVesselLinkedScopeFilter(scope),
    orderBy: { expiresAt: "asc" },
  });
}

export async function getDocumentsByVessel(scope, vesselId, db = prisma) {
  return db.document.findMany({
    where: {
      ...buildVesselLinkedScopeFilter(scope),
      vesselId,
    },
    orderBy: { expiresAt: "asc" },
  });
}

export async function createDocument(scope, documentData, db = prisma) {
  const vessel = await db.vessel.findFirst({
    where: {
      id: documentData.vesselId,
      ...buildVesselScopeFilter(scope),
    },
  });

  if (!vessel) {
    return null;
  }

  return db.document.create({
    data: {
      vesselId: documentData.vesselId,
      name: documentData.name,
      category: documentData.category,
      number: documentData.number,
      validFrom: documentData.validFrom,
      expiresAt: documentData.expiresAt,
      provider: documentData.provider || null,
    },
  });
}
