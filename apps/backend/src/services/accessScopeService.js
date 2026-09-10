import prisma from "../lib/prisma.js";

export const isAdmin = (user) => user?.role === "ADMIN";

export const getAccessScope = async (user) => {
  if (isAdmin(user)) {
    return {
      isAdmin: true,
      partyId: user.partyId,
      partyIds: null,
    };
  }

  const memberships = await prisma.membership.findMany({
    where: {
      userId: user.userId,
    },

    include: {
      organization: {
        select: {
          partyId: true,
        },
      },
    },
  });

  const organizationPartyIds = memberships.map(
    (membership) => membership.organization.partyId,
  );

  return {
    isAdmin: false,
    partyId: user.partyId,
    partyIds: [user.partyId, ...organizationPartyIds],
  };
};

export const buildVesselScopeFilter = (scope) => {
  if (scope.isAdmin) {
    return {};
  }

  return {
    ownerPartyId: {
      in: scope.partyIds,
    },
  };
};

export const buildVesselLinkedScopeFilter = (scope) => {
  if (scope.isAdmin) {
    return {};
  }

  return {
    vessel: {
      ownerPartyId: {
        in: scope.partyIds,
      },
    },
  };
};

export const resolveOwnerPartyId = (scope, requestedPartyId) => {
  if (!requestedPartyId) {
    return scope.partyId;
  }

  if (scope.isAdmin || scope.partyIds.includes(requestedPartyId)) {
    return requestedPartyId;
  }

  return null;
};