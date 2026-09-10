import prisma from "../lib/prisma.js";
import { getVesselById } from "./vesselService.js";
import { buildVesselLinkedScopeFilter } from "./accessScopeService.js";

export const createMaintenance = async (scope, maintenanceData) => {
  const vessel = await getVesselById(scope, maintenanceData.vesselId);

  if (!vessel) {
    return null;
  }

  return prisma.maintenance.create({
    data: {
      vesselId: maintenanceData.vesselId,
      title: maintenanceData.title,
      description: maintenanceData.description,
      type: maintenanceData.type,
      date: maintenanceData.date,
      status: maintenanceData.status,
    },
  });
};

export const getMaintenances = async (scope) => {
  return prisma.maintenance.findMany({
    where: buildVesselLinkedScopeFilter(scope),
  });
};

export const getMaintenanceById = async (id) => {
  return prisma.maintenance.findUnique({
    where: {
      id,
    },
  });
};

export const getMaintenancesByVesselId = async (scope, vesselId) => {
  const vessel = await getVesselById(scope, vesselId);

  if (!vessel) {
    return null;
  }

  return prisma.maintenance.findMany({
    where: {
      vesselId,
    },
  });
};