import { vesselStatusMeta } from "../mock/vessels";
import { apiFetch } from "./api";

const statusAliases = {
  Ativa: "OPERACIONAL",
  ATIVA: "OPERACIONAL",
  Ativo: "OPERACIONAL",
  "Em manutenção": "EM MANUTENÇÃO",
  Manutenção: "EM MANUTENÇÃO",
};

const optionalFields = [
  "category",
  "length",
  "year",
  "engine",
  "registration",
  "location",
  "mission",
  "imageSeed",
];

function normalizeStatus(status) {
  return statusAliases[status] || status || "";
}

export function getVesselStatus(status) {
  return (
    vesselStatusMeta[status] ||
    vesselStatusMeta[normalizeStatus(status)] || { label: status || "—", tone: "neutral" }
  );
}

function toVessel(row) {
  return {
    ...row,
    status: normalizeStatus(row.status),
    category: row.category || row.type || "—",
    length: row.length || "—",
    year: row.year || "—",
    engine: row.engine || "—",
    mission: row.mission || "",
    imageSeed: row.imageSeed || row.id,
    owner: "",
    ownerType: "OWNER",
    marinaId: null,
    readiness: null,
    readinessFactors: null,
    lastChecklist: null,
  };
}

function toPayload(data) {
  const payload = {
    name: data.name,
    type: data.type,
    status: data.status,
  };

  for (const field of optionalFields) {
    if (data[field] !== undefined) {
      payload[field] = data[field] || null;
    }
  }

  return payload;
}

export async function getVessels() {
  const rows = await apiFetch("/vessels");

  return {
    vessels: rows.map(toVessel),
    source: "api",
    error: false,
  };
}

export async function getFleetVessels() {
  return (await getVessels()).vessels;
}

export async function getVesselsByOwner(ownerId) {
  const vessels = await getFleetVessels();

  return vessels.filter((item) => item.ownerPartyId === ownerId);
}

export async function getVesselById(id) {
  const row = await apiFetch(`/vessels/${encodeURIComponent(id)}`);

  return {
    vessel: toVessel(row),
    source: "api",
    error: false,
  };
}

export async function getVessel(id) {
  return (await getVesselById(id)).vessel;
}

export async function createVessel(data) {
  return toVessel(
    await apiFetch("/vessels", {
      method: "POST",
      body: JSON.stringify(toPayload(data)),
    }),
  );
}

export async function updateVessel(id, data) {
  return toVessel(
    await apiFetch(`/vessels/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(toPayload(data)),
    }),
  );
}

export async function deleteVessel(id) {
  await apiFetch(`/vessels/${encodeURIComponent(id)}`, { method: "DELETE" });

  return true;
}
