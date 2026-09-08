import { apiFetch } from "./api";

export async function getInspectionsByVessel(vesselId) {
  return apiFetch(`/vessels/${vesselId}/inspections`);
}