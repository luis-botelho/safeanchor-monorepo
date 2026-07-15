import { PreventiveMaintenance } from "../models/preventiveMaintenanceModel.js";

const preventiveMaintenances = [];

let nextId = 1;

export const createPreventiveMaintenance = ({
  title,
  description,
  type,
  status,
  vesselId,
  periodicity,
  startDate,
  nextExecution,
}) => {
  const preventiveMaintenance = new PreventiveMaintenance(
    nextId++,
    title,
    description,
    type,
    status,
    vesselId,
    periodicity,
    startDate,
    nextExecution
  );

  preventiveMaintenances.push(preventiveMaintenance);

  return preventiveMaintenance;
};