import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createDocument,
  getDocumentsByVessel,
} from "../src/services/documentService.js";
import {
  cancelInspection,
  completeInspection,
  createInspection,
  getInspectionById,
  updateChecklistItem,
} from "../src/services/inspectionService.js";

function createFakeDb() {
  const state = {
    vessels: [{ id: "ves-1", ownerPartyId: "party-1" }],
    documents: [],
    inspections: [],
    sequence: 0,
  };

  function matchesScope(vessel, where) {
    if (where.id && vessel.id !== where.id) return false;
    if (where.ownerPartyId?.in && !where.ownerPartyId.in.includes(vessel.ownerPartyId)) {
      return false;
    }
    return true;
  }

  return {
    state,
    vessel: {
      findFirst: async ({ where }) =>
        state.vessels.find((vessel) => matchesScope(vessel, where)) || null,
    },
    document: {
      findMany: async ({ where }) =>
        state.documents.filter(
          (document) => !where.vesselId || document.vesselId === where.vesselId,
        ),
      create: async ({ data }) => {
        state.sequence += 1;
        const document = { id: `doc-${state.sequence}`, ...data };
        state.documents.push(document);
        return document;
      },
    },
    inspection: {
      findFirst: async ({ where }) => {
        const inspection = state.inspections.find((item) => item.id === where.id);

        if (!inspection) return null;

        const vessel = state.vessels.find((item) => item.id === inspection.vesselId);
        const allowedParties = where.vessel?.ownerPartyId?.in;

        if (allowedParties && !allowedParties.includes(vessel.ownerPartyId)) {
          return null;
        }

        return inspection;
      },
      findMany: async ({ where }) => {
        const allowedParties = where.vessel?.ownerPartyId?.in;

        return state.inspections.filter((item) => {
          if (where.vesselId && item.vesselId !== where.vesselId) return false;
          if (!allowedParties) return true;

          const vessel = state.vessels.find((v) => v.id === item.vesselId);
          return allowedParties.includes(vessel.ownerPartyId);
        });
      },
      create: async ({ data }) => {
        state.sequence += 1;
        const inspection = { id: `insp-${state.sequence}`, ...data };
        state.inspections.push(inspection);
        return inspection;
      },
      update: async ({ where, data }) => {
        const inspection = state.inspections.find((item) => item.id === where.id);
        Object.assign(inspection, data);
        return inspection;
      },
    },
  };
}

const owner = { isAdmin: false, partyId: "party-1", partyIds: ["party-1"] };
const outsider = { isAdmin: false, partyId: "party-2", partyIds: ["party-2"] };

test("documents are scoped to vessels owned by the user", async () => {
  const db = createFakeDb();

  const created = await createDocument(
    owner,
    {
      vesselId: "ves-1",
      name: "Seguro",
      category: "Seguro",
      number: "123",
      validFrom: "2026-01-01",
      expiresAt: "2027-01-01",
    },
    db,
  );

  assert.equal(created.vesselId, "ves-1");
  assert.equal((await getDocumentsByVessel(owner, "ves-1", db)).length, 1);
  assert.equal(await createDocument(outsider, { vesselId: "ves-1" }, db), null);
});

test("inspections can be reviewed and completed with a certificate", async () => {
  const db = createFakeDb();
  const checklist = [
    { item: "Casco", status: "pending", notes: "" },
    { item: "Motor", status: "pending", notes: "" },
  ];

  assert.equal(
    await createInspection(outsider, { vesselId: "ves-1", type: "safety" }, db),
    null,
  );

  const inspection = await createInspection(
    owner,
    {
      vesselId: "ves-1",
      type: "safety",
      scheduledAt: "2026-12-01T10:00:00.000Z",
      inspector: "Carlos",
      checklist,
    },
    db,
  );

  assert.equal(inspection.status, "SCHEDULED");
  assert.equal(await getInspectionById(owner, inspection.id, db), inspection);
  assert.equal(await getInspectionById(outsider, inspection.id, db), null);
  assert.equal(await completeInspection(owner, inspection.id, db), null);

  await updateChecklistItem(owner, inspection.id, 0, "passed", "ok", db);
  await updateChecklistItem(owner, inspection.id, 1, "passed", "ok", db);

  const completed = await completeInspection(owner, inspection.id, db);

  assert.equal(completed.status, "COMPLETED");
  assert.equal(completed.certificate.type, "Certificado de Segurança");
  assert.ok(completed.certificate.validUntil);

  const cancelled = await cancelInspection(owner, inspection.id, db);
  assert.equal(cancelled.status, "CANCELLED");
});
