import {
  inspections as mockInspections,
  inspectionTypes,
  inspectionStatuses,
  checklistItemStatuses,
} from "../mock/inspections";

let inspections = [...mockInspections];

export async function getInspections() {
  return inspections;
}

export async function getInspectionById(id) {
  return inspections.find((item) => item.id === id) || null;
}

export async function getInspectionsByProvider(providerId) {
  return inspections.filter((item) => item.providerId === providerId);
}

export async function getInspectionsByVessel(vesselId) {
  return inspections.filter((item) => item.vesselId === vesselId);
}

export async function createInspection(data) {
  const newInspection = {
    id: `insp-${String(inspections.length + 1).padStart(3, "0")}`,
    vesselId: data.vesselId,
    vesselName: data.vesselName,
    vesselType: data.vesselType,
    providerId: data.providerId,
    type: data.type,
    status: "scheduled",
    scheduledAt: data.scheduledAt,
    completedAt: null,
    inspector: data.inspector,
    checklist: data.checklist || [
      { item: "Casco e tubulação", status: "pending", notes: "" },
      { item: "Motor e propulsão", status: "pending", notes: "" },
      { item: "Sistema elétrico", status: "pending", notes: "" },
      { item: "Equipamentos de segurança", status: "pending", notes: "" },
      { item: "Navegação e comunicação", status: "pending", notes: "" },
    ],
    certificate: null,
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
  };

  inspections = [...inspections, newInspection];
  return newInspection;
}

export async function updateChecklistItem(inspectionId, itemIndex, status, notes) {
  const inspection = inspections.find((item) => item.id === inspectionId);
  if (!inspection) return null;

  inspection.checklist[itemIndex] = {
    ...inspection.checklist[itemIndex],
    status,
    notes,
  };

  inspection.status = "in_progress";
  return inspection;
}

export async function completeInspection(inspectionId) {
  const inspection = inspections.find((item) => item.id === inspectionId);
  if (!inspection) return null;

  const allReviewed = inspection.checklist.every(
    (item) => item.status !== "pending",
  );

  if (!allReviewed) return null;

  inspection.status = "completed";
  inspection.completedAt = new Date().toISOString();

  const hasFailure = inspection.checklist.some(
    (item) => item.status === "failed",
  );

  if (!hasFailure) {
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 6);

    inspection.certificate = {
      id: `cert-${String(Date.now()).slice(-6)}`,
      issuedAt: inspection.completedAt,
      validUntil: validUntil.toISOString().split("T")[0],
      inspector: inspection.inspector,
      type:
        inspection.type === "safety"
          ? "Certificado de Segurança"
          : "Certificado de Inspeção",
    };
  }

  return inspection;
}

export async function cancelInspection(inspectionId) {
  const inspection = inspections.find((item) => item.id === inspectionId);
  if (!inspection) return null;

  inspection.status = "cancelled";
  return inspection;
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
