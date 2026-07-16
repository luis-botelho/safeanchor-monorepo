import { getMaintenances } from "./maintenanceService.js";

export function getDashboardStatistics() {
  const maintenances = getMaintenances();

  return {
    total: maintenances.length,

    preventive: maintenances.filter(
      (maintenance) => maintenance.type === "Preventiva"
    ).length,

    corrective: maintenances.filter(
      (maintenance) => maintenance.type === "Corretiva"
    ).length,

    pending: maintenances.filter(
      (maintenance) => maintenance.status === "Pendente"
    ).length,

    completed: maintenances.filter(
      (maintenance) => maintenance.status === "Concluída"
    ).length,
  };
}