import { apiFetch } from "./api";

export async function createMaintenance(maintenanceData) {
  return apiFetch("/maintenances", {
    method: "POST",
    body: JSON.stringify(maintenanceData),
  });
}

export async function getMaintenances() {
  return apiFetch("/maintenances");
}

export async function getMaintenancesByVesselId(vesselId) {
  return apiFetch(`/vessels/${vesselId}/maintenances`);
}