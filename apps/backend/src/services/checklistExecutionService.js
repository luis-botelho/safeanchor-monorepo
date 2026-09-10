import prisma from "../lib/prisma.js";
import { getVesselById } from "./vesselService.js";
import { buildVesselLinkedScopeFilter } from "./accessScopeService.js";

export async function createExecution(scope, executionData) {
  const vessel = await getVesselById(scope, executionData.vesselId);

  if (!vessel) {
    return null;
  }

  return prisma.checklistExecution.create({
    data: {
      templateId: executionData.templateId,
      vesselId: executionData.vesselId,
      responses: executionData.responses,
      executedAt: new Date().toISOString(),
    },
  });
}

export async function getChecklistExecutions(scope) {
  return prisma.checklistExecution.findMany({
    where: buildVesselLinkedScopeFilter(scope),
  });
}

export async function getChecklistExecutionsByVesselId(scope, vesselId) {
  const vessel = await getVesselById(scope, vesselId);

  if (!vessel) {
    return null;
  }

  return prisma.checklistExecution.findMany({
    where: {
      vesselId,
    },
    orderBy: {
      executedAt: "desc",
    },
  });
}