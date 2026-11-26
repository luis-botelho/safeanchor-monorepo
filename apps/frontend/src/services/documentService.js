import { documentStatusMeta } from "../mock/documents";
import { apiFetch } from "./api";

export function toISO(dateText) {
  if (!dateText) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    return dateText;
  }

  const [day, month, year] = dateText.split("/");

  return `${year}-${month}-${day}`;
}

function toDisplayDate(dateText) {
  const iso = toISO(dateText);

  if (!iso) return "—";

  const [year, month, day] = iso.split("-");

  return `${day}/${month}/${year}`;
}

function daysUntil(isoExpires) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expires = new Date(`${isoExpires}T00:00:00`);

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

function toDocument(row) {
  return {
    ...row,
    validFrom: toDisplayDate(row.validFrom),
    expiresAt: toDisplayDate(row.expiresAt),
    status: computeDocumentStatus(row.expiresAt),
  };
}

export async function getDocuments() {
  const rows = await apiFetch("/documents");

  return rows.map(toDocument);
}

export async function getDocumentsByVessel(vesselId) {
  const rows = await apiFetch(
    `/documents/vessel/${encodeURIComponent(vesselId)}`,
  );

  return rows.map(toDocument);
}

export async function createDocument(data) {
  const row = await apiFetch("/documents", {
    method: "POST",
    body: JSON.stringify({
      vesselId: data.vesselId,
      name: data.name,
      category: data.category,
      number: data.number,
      validFrom: data.validFrom,
      expiresAt: data.expiresAt,
      provider: data.provider || null,
    }),
  });

  return toDocument(row);
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
