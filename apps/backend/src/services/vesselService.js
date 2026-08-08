import prisma from "../lib/prisma.js";

export const getAllVessels = async () => {
  return prisma.vessel.findMany();
};

export const createVessel = async (vesselData) => {
  return prisma.vessel.create({
    data: {
      name: vesselData.name,
      type: vesselData.type,
      status: vesselData.status,
    },
  });
};

export const getVesselById = async (id) => {
  return prisma.vessel.findUnique({
    where: {
      id,
    },
  });
};

export const updateVessel = async (id, vesselData) => {
  const vessel = await getVesselById(id);

  if (!vessel) {
    return null;
  }

  return prisma.vessel.update({
    where: {
      id,
    },
    data: {
      name: vesselData.name,
      type: vesselData.type,
      status: vesselData.status,
    },
  });
};

export const deleteVessel = async (id) => {
  const vessel = await getVesselById(id);

  if (!vessel) {
    return null;
  }

  await prisma.vessel.delete({
    where: {
      id,
    },
  });

  return true;
};