import prisma from "../lib/prisma.js";

export async function createExecution({
  templateId,
  vesselId,
  responses,
}) {
  return prisma.checklistExecution.create({
    data: {
      templateId,
      vesselId,
      responses,
      executedAt: new Date().toISOString(),
    },
  });
}

export async function getChecklistExecutions() {
  return prisma.checklistExecution.findMany();
}

export async function getChecklistExecutionsByVesselId(vesselId) {
  return prisma.checklistExecution.findMany({
    where: {
      vesselId,
    },
    orderBy: {
      executedAt: "desc",
    },
  });
}
