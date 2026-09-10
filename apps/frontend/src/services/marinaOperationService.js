import {
  marinaOperations,
  marinaOperationStatusMeta,
  marinaOperationOriginMeta,
} from "../mock/marinaOperations";
import { getRequestsForMarina } from "./requestService";

export async function getMarinaOperations(marinaId) {
  return marinaOperations.filter((item) => item.marinaId === marinaId);
}

export async function getOpenMarinaOperations(marinaId) {
  const operations = await getMarinaOperations(marinaId);
  return operations.filter((item) => item.status !== "Concluído");
}

export async function getMarinaOperationStatusTone(status) {
  return marinaOperationStatusMeta[status] || "neutral";
}

export function getMarinaOperationOrigin(origin) {
  return marinaOperationOriginMeta[origin] || { tone: "neutral", icon: "wrench" };
}

export async function getReceivedRequestsForMarina(marinaId) {
  return getRequestsForMarina(marinaId);
}