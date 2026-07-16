import {
  createPreventiveMaintenance,
  getPreventiveMaintenances,
} from "../services/preventiveMaintenanceService.js";

export const getPreventiveMaintenancesController = (request, response) => {
  const preventiveMaintenances = getPreventiveMaintenances();

  return response.status(200).json(preventiveMaintenances);
};

export const createPreventiveMaintenanceController = (request, response) => {
  const preventiveMaintenanceData = request.body;

  const preventiveMaintenance =
    createPreventiveMaintenance(preventiveMaintenanceData);

  return response.status(201).json(preventiveMaintenance);
};