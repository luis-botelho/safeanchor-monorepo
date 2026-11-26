import {
  inspectionTypes,
  inspectionStatuses,
  checklistItemStatuses,
} from "../mock/inspections";
import { apiFetch } from "./api";
import { getFleetVessels } from "./vesselService";

const statusAliases = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const defaultChecklist = [
  { item: "Casco e tubulação", status: "pending", notes: "" },
  { item: "Motor e propulsão", status: "pending", notes: "" },
  { item: "Sistema elétrico", status: "pending", notes: "" },
  { item: "Equipamentos de segurança", status: "pending", notes: "" },
  { item: "Navegação e comunicação", status: "pending", notes: "" },
];

async function loadVesselNames() {
  const vessels = await getFleetVessels();

  return new Map(vessels.map((vessel) => [vessel.id, vessel]));
}

function toInspection(row, vesselNames) {
  const vessel = vesselNames.get(row.vesselId);

  return {
    ...row,
    status: statusAliases[row.status] || row.status,
    vesselName: vessel ? vessel.name : "Embarcação",
    vesselType: vessel ? vessel.type : "",
    checklist: Array.isArray(row.checklist) ? row.checklist : [],
  };
}

async function withVessels(rows) {
  const vesselNames = await loadVesselNames();

  return rows.map((row) => toInspection(row, vesselNames));
}

async function withVesselsById(row) {
  const vesselNames = await loadVesselNames();

  return toInspection(row, vesselNames);
}

export async function getInspections() {
  return withVessels(await apiFetch("/inspections"));
}

export async function getInspectionById(id) {
  return withVesselsById(
    await apiFetch(`/inspections/${encodeURIComponent(id)}`),
  );
}

export async function getInspectionsByProvider(providerId) {
  const inspections = await getInspections();

  return inspections.filter((item) => item.providerId === providerId);
}

export async function getInspectionsByVessel(vesselId) {
  return withVessels(
    await apiFetch(`/inspections/vessel/${encodeURIComponent(vesselId)}`),
  );
}

export async function createInspection(data) {
  const row = await apiFetch("/inspections", {
    method: "POST",
    body: JSON.stringify({
      vesselId: data.vesselId,
      type: data.type,
      scheduledAt: data.scheduledAt,
      inspector: data.inspector,
      notes: data.notes || "",
      checklist: data.checklist || defaultChecklist,
    }),
  });

  return withVesselsById(row);
}

export async function updateChecklistItem(inspectionId, itemIndex, status, notes) {
  const row = await apiFetch(
    `/inspections/${encodeURIComponent(inspectionId)}/checklist/${itemIndex}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    },
  );

  return withVesselsById(row);
}

export async function completeInspection(inspectionId) {
  const row = await apiFetch(
    `/inspections/${encodeURIComponent(inspectionId)}/complete`,
    { method: "POST" },
  );

  return withVesselsById(row);
}

export async function cancelInspection(inspectionId) {
  const row = await apiFetch(
    `/inspections/${encodeURIComponent(inspectionId)}/cancel`,
    { method: "POST" },
  );

  return withVesselsById(row);
}

export function getInspectionTypes() {
  return inspectionTypes;
}

export function getInspectionStatuses() {
  return inspectionStatuses;
}

export function getChecklistItemStatuses() {
  return checklistItemStatuses;
}
