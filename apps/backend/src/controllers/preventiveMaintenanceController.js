import { getAccessScope } from "../services/accessScopeService.js";
import {
  createPreventiveMaintenance,
  getPreventiveMaintenances,
} from "../services/preventiveMaintenanceService.js";

export const getPreventiveMaintenancesController = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const preventiveMaintenances = await getPreventiveMaintenances(scope);

  return response.status(200).json(preventiveMaintenances);
};

export const createPreventiveMaintenanceController = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const preventiveMaintenance = await createPreventiveMaintenance(
    scope,
    request.body,
  );

  if (!preventiveMaintenance) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.status(201).json(preventiveMaintenance);
};