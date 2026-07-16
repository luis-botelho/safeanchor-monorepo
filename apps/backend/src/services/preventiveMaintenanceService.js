import { PreventiveMaintenance } from "../models/preventiveMaintenanceModel.js";

const preventiveMaintenances = [];

let nextId = 1;

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

export const getPreventiveMaintenances = () => preventiveMaintenances;

export const createPreventiveMaintenance = ({
  title,
  description,
  type,
  status,
  vesselId,
  periodicity,
  startDate,
}) => {
  const nextExecution = calculateNextExecution(startDate, periodicity);
  const preventiveMaintenance = new PreventiveMaintenance(
    nextId++,
    title,
    description,
    type,
    status,
    vesselId,
    periodicity,
    startDate,
    nextExecution,
  );

  preventiveMaintenances.push(preventiveMaintenance);

  return preventiveMaintenance;
};
