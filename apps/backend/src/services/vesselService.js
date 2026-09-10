import prisma from "../lib/prisma.js";
import {
  buildVesselScopeFilter,
  resolveOwnerPartyId,
} from "./accessScopeService.js";

export const getAllVessels = async (scope) => {
  return prisma.vessel.findMany({
    where: buildVesselScopeFilter(scope),
  });
};

export const getVesselById = async (scope, id) => {
  if (scope.isAdmin) {
    return prisma.vessel.findUnique({
      where: {
        id,
      },
    });
  }

  return prisma.vessel.findFirst({
    where: {
      id,
      ownerPartyId: {
        in: scope.partyIds,
      },
    },
  });
};

export const createVessel = async (scope, vesselData) => {
  const ownerPartyId = resolveOwnerPartyId(scope, vesselData.ownerPartyId);

  if (ownerPartyId === null) {
    return null;
  }

  return prisma.vessel.create({
    data: {
      ownerPartyId,
      name: vesselData.name,
      type: vesselData.type,
      status: vesselData.status,
    },
  });
};

export const updateVessel = async (scope, id, vesselData) => {
  const vessel = await getVesselById(scope, id);

  if (!vessel) {
    return null;
  }

  const ownerPartyId =
    scope.isAdmin && vesselData.ownerPartyId
      ? vesselData.ownerPartyId
      : vessel.ownerPartyId;

  return prisma.vessel.update({
    where: {
      id,
    },

    data: {
      ownerPartyId,
      name: vesselData.name,
      type: vesselData.type,
      status: vesselData.status,
    },
  });
};

export const deleteVessel = async (scope, id) => {
  const vessel = await getVesselById(scope, id);

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