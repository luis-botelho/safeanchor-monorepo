import { apiFetch } from "./api";

export async function createPreventiveMaintenance(data) {
  return apiFetch("/preventive-maintenances", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPreventiveMaintenances() {
  return apiFetch("/preventive-maintenances");
}