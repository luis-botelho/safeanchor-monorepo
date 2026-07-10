import { getMaintenances } from "../services/maintenanceService.js";

export const getMaintenancesController = (request, response) => {
  const maintenances = getMaintenances();

  
  return response.status(200).json(maintenances);
};
