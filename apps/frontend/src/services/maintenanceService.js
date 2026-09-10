import {
  maintenanceRecords,
  maintenancePriorityMeta,
  maintenanceStatusMeta,
} from "../mock/maintenance";
import { vessels } from "../mock/vessels";

function enrich(record) {
  const vessel = vessels.find((item) => item.id === record.vesselId);

  return {
    ...record,
    vesselName: vessel ? vessel.name : "Embarcação",
    statusTone: maintenanceStatusMeta[record.status]?.tone || "neutral",
    statusLabel: record.status,
  };
}

export async function getMaintenances() {
  return maintenanceRecords.map(enrich);
}

export async function getMaintenanceById(id) {
  const record = maintenanceRecords.find((item) => item.id === id);

  return record ? enrich(record) : null;
}

export async function getMaintenancesByVesselId(vesselId) {
  return maintenanceRecords
    .filter((item) => item.vesselId === vesselId)
    .map(enrich);
}

export async function getUpcomingMaintenance() {
  return maintenanceRecords
    .filter((item) => item.status !== "Concluída" && item.status !== "Cancelada")
    .sort((a, b) => {
      const [da, db] = [a.date.split("/").reverse().join(""), b.date.split("/").reverse().join("")];
      return da.localeCompare(db);
    })
    .map(enrich);
}

export async function getMaintenanceHistory() {
  return maintenanceRecords
    .filter((item) => item.status === "Concluída")
    .sort((a, b) => b.date.split("/").reverse().join("").localeCompare(a.date.split("/").reverse().join("")))
    .map(enrich);
}

export function getPriorityTone(priority) {
  return maintenancePriorityMeta[priority] || "neutral";
}

export function getStatusMeta(status) {
  return maintenanceStatusMeta[status] || { tone: "neutral" };
}

// Mocks preservados para compatibilidade com telas anteriores.
export async function createMaintenance() {
  return null;
}
export async function createPreventiveMaintenance() {
  return null;
}
export async function getPreventiveMaintenances() {
  return [];
}