import { createPreventiveMaintenance } from "../services/preventiveMaintenanceService.js";

export const createPreventiveMaintenanceController = (request, response) => {
  const preventiveMaintenanceData = request.body;

  const preventiveMaintenance =
    createPreventiveMaintenance(preventiveMaintenanceData);

  return response.status(201).json(preventiveMaintenance);
};