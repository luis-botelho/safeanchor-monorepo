
import {
  getMaintenances,
  createMaintenance,
  getMaintenancesByVesselId,
} from "../services/maintenanceService.js";
import { getDashboardStatistics } from "../services/maintenanceDashboardService.js";

export const getMaintenancesController = (request, response) => {
  const maintenances = getMaintenances();

  return response.status(200).json(maintenances);
};

export const createMaintenanceController = (request, response) => {
  const maintenanceData = request.body;

  const maintenance = createMaintenance(maintenanceData);

  return response.status(201).json(maintenance);
};

export const getMaintenancesByVesselIdController = (request, response) => {
  const { id } = request.params;

  const maintenances = getMaintenancesByVesselId(id);

  return response.status(200).json(maintenances);
};
export function getMaintenanceDashboardController(request, response) {
  const dashboard = getDashboardStatistics();

  return response.json(dashboard);
}