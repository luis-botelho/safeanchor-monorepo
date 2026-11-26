import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import jwt from "jsonwebtoken";

import { createApp } from "../src/app.js";

process.env.JWT_SECRET ||= "test-secret";

const token = jwt.sign(
  {
    userId: "user-1",
    partyId: "party-1",
    role: "ADMIN",
    persona: "OWNER",
  },
  process.env.JWT_SECRET,
);

function createFakeDb() {
  const state = {
    documents: [],
    inspections: [],
    sequence: 0,
  };

  return {
    state,
    vessel: {
      findFirst: async ({ where }) =>
        where.id === "ves-1" ? { id: "ves-1", ownerPartyId: "party-1" } : null,
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
      findFirst: async ({ where }) =>
        state.inspections.find((item) => item.id === where.id) || null,
      findMany: async ({ where }) =>
        state.inspections.filter(
          (item) => !where.vesselId || item.vesselId === where.vesselId,
        ),
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

function startServer(app) {
  const server = createServer(app);

  return new Promise((resolve) => {
    server.listen(0, () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
  });
}

function authHeaders() {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

test("documents API validates, creates and lists scoped documents", async (t) => {
  const { server, baseUrl } = await startServer(
    createApp({ prisma: createFakeDb() }),
  );

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const invalid = await fetch(`${baseUrl}/documents`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ vesselId: "ves-1" }),
  });

  assert.equal(invalid.status, 400);

  const payload = {
    vesselId: "ves-1",
    name: "Seguro da embarcação",
    category: "Seguro",
    number: "BR-123",
    validFrom: "2026-01-01",
    expiresAt: "2027-01-01",
    provider: "Porto Seguro",
  };

  const created = await fetch(`${baseUrl}/documents`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  assert.equal(created.status, 201);
  assert.equal((await created.json()).name, payload.name);

  const listed = await fetch(`${baseUrl}/documents`, {
    headers: authHeaders(),
  });

  assert.equal(listed.status, 200);
  assert.equal((await listed.json()).length, 1);

  const byVessel = await fetch(`${baseUrl}/documents/vessel/ves-1`, {
    headers: authHeaders(),
  });

  assert.equal(byVessel.status, 200);
  assert.equal((await byVessel.json()).length, 1);
});

test("inspections API creates, reviews and completes an inspection", async (t) => {
  const { server, baseUrl } = await startServer(
    createApp({ prisma: createFakeDb() }),
  );

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const created = await fetch(`${baseUrl}/inspections`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      vesselId: "ves-1",
      type: "safety",
      scheduledAt: "2026-12-01T10:00:00.000Z",
      inspector: "Carlos",
      checklist: [{ item: "Casco", status: "pending", notes: "" }],
    }),
  });

  assert.equal(created.status, 201);

  const inspection = await created.json();

  assert.equal(inspection.status, "SCHEDULED");

  const reviewed = await fetch(
    `${baseUrl}/inspections/${inspection.id}/checklist/0`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status: "ok", notes: "Sem avarias" }),
    },
  );

  assert.equal(reviewed.status, 200);
  assert.equal((await reviewed.json()).status, "IN_PROGRESS");

  const completed = await fetch(`${baseUrl}/inspections/${inspection.id}/complete`, {
    method: "POST",
    headers: authHeaders(),
  });

  assert.equal(completed.status, 200);

  const completedBody = await completed.json();

  assert.equal(completedBody.status, "COMPLETED");
  assert.ok(completedBody.certificate.validUntil);

  const cancelled = await fetch(`${baseUrl}/inspections/${inspection.id}/cancel`, {
    method: "POST",
    headers: authHeaders(),
  });

  assert.equal(cancelled.status, 200);
  assert.equal((await cancelled.json()).status, "CANCELLED");
});
