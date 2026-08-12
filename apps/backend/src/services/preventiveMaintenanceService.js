import prisma from "../lib/prisma.js";

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

export const getPreventiveMaintenances = async () => {
  return prisma.preventiveMaintenance.findMany();
};

export const createPreventiveMaintenance = async ({
  title,
  description,
  type,
  status,
  vesselId,
  periodicity,
  startDate,
}) => {
  const nextExecution = calculateNextExecution(startDate, periodicity);
  return prisma.preventiveMaintenance.create({
    data: {
      title,
      description,
      type,
      status,
      vesselId,
      periodicity,
      startDate,
      nextExecution,
    },
  });
};
