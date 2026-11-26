import {
  maintenancePriorityMeta,
  maintenanceStatusMeta,
} from "../mock/maintenance";
import { apiFetch } from "./api";
import { getFleetVessels } from "./vesselService";

const completedStatuses = ["Concluída", "COMPLETED"];
const cancelledStatuses = ["Cancelada", "CANCELLED"];

function formatDate(value) {
  if (!value) return "—";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  return value;
}

function toMaintenance(record, vesselNames) {
  return {
    ...record,
    sortDate: record.date || "",
    date: formatDate(record.date),
    category: record.type,
    priority: "—",
    cost: "—",
    vesselName: vesselNames.get(record.vesselId) || "Embarcação",
    statusTone: maintenanceStatusMeta[record.status]?.tone || "neutral",
    statusLabel: record.status,
  };
}

async function loadRecords() {
  const [records, vessels] = await Promise.all([
    apiFetch("/maintenances"),
    getFleetVessels(),
  ]);

  const vesselNames = new Map(vessels.map((vessel) => [vessel.id, vessel.name]));

  return records.map((record) => toMaintenance(record, vesselNames));
}

export async function getMaintenances() {
  return loadRecords();
}

export async function getMaintenanceById(id) {
  const records = await loadRecords();

  return records.find((record) => record.id === id) || null;
}

export async function getMaintenancesByVesselId(vesselId) {
  const records = await loadRecords();

  return records.filter((record) => record.vesselId === vesselId);
}

export async function getUpcomingMaintenance() {
  const records = await loadRecords();

  return records
    .filter(
      (record) =>
        !completedStatuses.includes(record.status) &&
        !cancelledStatuses.includes(record.status),
    )
    .sort((a, b) => a.sortDate.localeCompare(b.sortDate));
}

export async function getMaintenanceHistory() {
  const records = await loadRecords();

  return records
    .filter((record) => completedStatuses.includes(record.status))
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}

export function getPriorityTone(priority) {
  return maintenancePriorityMeta[priority] || "neutral";
}

export function getStatusMeta(status) {
  return maintenanceStatusMeta[status] || { tone: "neutral" };
}

export async function createMaintenance(data) {
  return apiFetch("/maintenances", {
    method: "POST",
    body: JSON.stringify({
      vesselId: data.vesselId,
      title: data.title,
      description: data.description,
      type: data.type,
      date: data.date,
      status: data.status,
    }),
  });
}

export {
  createPreventiveMaintenance,
  getPreventiveMaintenances,
} from "./preventiveMaintenanceService";
