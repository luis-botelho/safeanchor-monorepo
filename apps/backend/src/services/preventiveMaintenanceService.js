import prisma from "../lib/prisma.js";
import { getVesselById } from "./vesselService.js";
import { buildVesselLinkedScopeFilter } from "./accessScopeService.js";

function calculateNextExecution(startDate, periodicity) {
  const nextExecution = new Date(startDate);

  switch (periodicity) {
    case "monthly":
      nextExecution.setMonth(nextExecution.getMonth() + 1);
      break;

    case "quarterly":
      nextExecution.setMonth(nextExecution.getMonth() + 3);
      break;

    case "semiannual":
      nextExecution.setMonth(nextExecution.getMonth() + 6);
      break;

    case "annual":
      nextExecution.setFullYear(nextExecution.getFullYear() + 1);
      break;

    default:
      break;
  }

  return nextExecution.toISOString().split("T")[0];
}

export const getPreventiveMaintenances = async (scope) => {
  return prisma.preventiveMaintenance.findMany({
    where: buildVesselLinkedScopeFilter(scope),
  });
};

export const createPreventiveMaintenance = async (scope, maintenanceData) => {
  const vessel = await getVesselById(scope, maintenanceData.vesselId);

  if (!vessel) {
    return null;
  }

  const nextExecution = calculateNextExecution(
    maintenanceData.startDate,
    maintenanceData.periodicity,
  );

  return prisma.preventiveMaintenance.create({
    data: {
      title: maintenanceData.title,
      description: maintenanceData.description,
      type: maintenanceData.type,
      status: maintenanceData.status,
      vesselId: maintenanceData.vesselId,
      periodicity: maintenanceData.periodicity,
      startDate: maintenanceData.startDate,
      nextExecution,
    },
  });
};