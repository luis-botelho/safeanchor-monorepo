import {
  getMaintenances,
  createMaintenance,
} from "../services/maintenanceService.js";

export const getMaintenancesController = (request, response) => {
  const maintenances = getMaintenances();

  return response.status(200).json(maintenances);
};

export const createMaintenanceController = (request, response) => {
  const maintenanceData = request.body;

  const maintenance = createMaintenance(maintenanceData);

  return response.status(201).json(maintenance);
};
