import { apiFetch } from "./api";

export async function getMaintenanceDashboard() {
  return apiFetch("/maintenances/dashboard");
}