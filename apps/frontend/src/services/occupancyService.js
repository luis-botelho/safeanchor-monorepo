import { berthSlots, marinaMovements } from "../mock/occupancy";

export async function getBerthSlots() {
  return berthSlots;
}

export async function getMarinaMovements() {
  return marinaMovements;
}

export async function getTodayMovementCounts() {
  const arrivals = marinaMovements.filter((item) => item.type === "Chegada").length;
  const departures = marinaMovements.filter((item) => item.type === "Saída").length;

  return { arrivals, departures };
}

export const berthSlotMeta = {
  occupied: { label: "Ocupada", tone: "success" },
  available: { label: "Disponível", tone: "neutral" },
  arrival: { label: "Chegada prevista", tone: "info" },
  maintenance: { label: "Manutenção", tone: "warning" },
};