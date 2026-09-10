import { documents, documentStatusMeta } from "../mock/documents";

export const TODAY = "2026-09-10";

function toISO(dateText) {
  const [day, month, year] = dateText.split("/");
  return `${year}-${month}-${day}`;
}

function daysUntil(isoExpires) {
  const today = Date.parse(TODAY);
  const expires = Date.parse(isoExpires);
  return Math.round((expires - today) / 86400000);
}

export function computeDocumentStatus(expiresAt) {
  const days = daysUntil(toISO(expiresAt));

  if (days < 0) {
    return { key: "vencido", ...documentStatusMeta.vencido };
  }

  if (days <= 30) {
    return { key: "proximo", ...documentStatusMeta.proximo };
  }

  return { key: "valido", ...documentStatusMeta.valido };
}

export async function getDocuments() {
  return documents.map((document) => ({
    ...document,
    status: computeDocumentStatus(document.expiresAt),
  }));
}

export async function getDocumentsByVessel(vesselId) {
  const all = await getDocuments();
  return all.filter((document) => document.vesselId === vesselId);
}

export async function getExpiringDocuments() {
  const all = await getDocuments();

  const sorted = [...all].sort((a, b) =>
    toISO(a.expiresAt).localeCompare(toISO(b.expiresAt)),
  );

  return sorted.filter(
    (document) =>
      document.status.key === "vencido" || document.status.key === "proximo",
  );
}

export function getDocumentsSummary(all) {
  return {
    valid: all.filter((item) => item.status.key === "valido").length,
    expiring: all.filter((item) => item.status.key === "proximo").length,
    expired: all.filter((item) => item.status.key === "vencido").length,
  };
}