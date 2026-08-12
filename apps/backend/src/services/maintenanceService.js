import prisma from "../lib/prisma.js";

export const createMaintenance = async (maintenanceData) => {
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

export const getMaintenances = async () => {
  return prisma.maintenance.findMany();
};

export const getMaintenanceById = async (id) => {
  return prisma.maintenance.findUnique({
    where: {
      id,
    },
  });
};

export const getMaintenancesByVesselId = async (vesselId) => {
  return prisma.maintenance.findMany({
    where: {
      vesselId,
    },
  });
};
