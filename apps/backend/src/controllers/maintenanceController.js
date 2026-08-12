
import {
  getMaintenances,
  createMaintenance,
  getMaintenancesByVesselId,
} from "../services/maintenanceService.js";
import { getDashboardStatistics } from "../services/maintenanceDashboardService.js";

export const getMaintenancesController = async (request, response) => {
  const maintenances = await getMaintenances();

  return response.status(200).json(maintenances);
};

export const createMaintenanceController = async (request, response) => {
  const maintenanceData = request.body;

  const maintenance = await createMaintenance(maintenanceData);

  return response.status(201).json(maintenance);
};

export const getMaintenancesByVesselIdController = async (request, response) => {
  const { id } = request.params;

  const maintenances = await getMaintenancesByVesselId(id);

  return response.status(200).json(maintenances);
};
export async function getMaintenanceDashboardController(request, response) {
  const dashboard = await getDashboardStatistics();

  return response.json(dashboard);
}
