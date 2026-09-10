import { getAccessScope } from "../services/accessScopeService.js";
import {
  getMaintenances,
  createMaintenance,
  getMaintenancesByVesselId,
} from "../services/maintenanceService.js";
import { getDashboardStatistics } from "../services/maintenanceDashboardService.js";

export const getMaintenancesController = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const maintenances = await getMaintenances(scope);

  return response.status(200).json(maintenances);
};

export const createMaintenanceController = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const maintenance = await createMaintenance(scope, request.body);

  if (!maintenance) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.status(201).json(maintenance);
};

export const getMaintenancesByVesselIdController = async (request, response) => {
  const scope = await getAccessScope(request.user);

  const { id } = request.params;

  const maintenances = await getMaintenancesByVesselId(scope, id);

  if (!maintenances) {
    return response.status(404).json({
      message: "Vessel not found",
    });
  }

  return response.status(200).json(maintenances);
};

export async function getMaintenanceDashboardController(request, response) {
  const scope = await getAccessScope(request.user);

  const dashboard = await getDashboardStatistics(scope);

  return response.json(dashboard);
}