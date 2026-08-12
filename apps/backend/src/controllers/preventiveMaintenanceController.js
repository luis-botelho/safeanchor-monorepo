import {
  createPreventiveMaintenance,
  getPreventiveMaintenances,
} from "../services/preventiveMaintenanceService.js";

export const getPreventiveMaintenancesController = async (request, response) => {
  const preventiveMaintenances = await getPreventiveMaintenances();

  return response.status(200).json(preventiveMaintenances);
};

export const createPreventiveMaintenanceController = async (request, response) => {
  const preventiveMaintenanceData = request.body;

  const preventiveMaintenance =
    await createPreventiveMaintenance(preventiveMaintenanceData);

  return response.status(201).json(preventiveMaintenance);
};
