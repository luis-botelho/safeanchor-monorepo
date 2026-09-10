import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import express from "express";

import prisma from "../src/lib/prisma.js";
import { requireAuth } from "../src/middleware/authMiddleware.js";
import authRoutes from "../src/routes/authRoutes.js";
import vesselRoutes from "../src/routes/vesselRoutes.js";
import maintenanceRoutes from "../src/routes/maintenanceRoutes.js";
import preventiveMaintenanceRoutes from "../src/routes/preventiveMaintenanceRoutes.js";
import checklistExecutionRoutes from "../src/routes/checklistExecutionRoutes.js";

const integrationEnabled = process.env.ALLOW_DATABASE_SMOKE === "true";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use(requireAuth);
  app.use("/vessels", vesselRoutes);
  app.use("/maintenances", maintenanceRoutes);
  app.use("/preventive-maintenances", preventiveMaintenanceRoutes);
  app.use("/checklist-executions", checklistExecutionRoutes);
  return app;
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

async function requestJson(baseUrl, path, { method = "GET", token, body } = {}) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = response.status === 204 ? null : await response.json();

  return { status: response.status, body: data };
}

async function registerUser(baseUrl, name, email, password) {
  const registerResponse = await requestJson(baseUrl, "/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
  assert.equal(registerResponse.status, 201);

  return {
    userId: registerResponse.body.id,
    partyId: registerResponse.body.partyId,
  };
}

async function loginUser(baseUrl, email, password) {
  const loginResponse = await requestJson(baseUrl, "/auth/login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(loginResponse.status, 200);
  return loginResponse.body.token;
}

test(
  "Ownership access scope integration",
  { skip: !integrationEnabled },
  async () => {
    const { server, baseUrl } = await startServer(buildApp());

    const marker = `scope-${Date.now()}`;
    const password = "senha123";
    const ownerEmail = `${marker}-owner@test.com`;
    const outsiderEmail = `${marker}-outsider@test.com`;
    const adminEmail = `${marker}-admin@test.com`;

    const userIds = [];
    const partyIds = [];
    const vesselIds = [];
    const maintenanceIds = [];
    let organizationId = null;
    let organizationPartyId = null;

    try {
      const owner = await registerUser(baseUrl, "Owner", ownerEmail, password);
      const outsider = await registerUser(
        baseUrl,
        "Outsider",
        outsiderEmail,
        password,
      );
      const admin = await registerUser(baseUrl, "Admin", adminEmail, password);

      userIds.push(owner.userId, outsider.userId, admin.userId);
      partyIds.push(owner.partyId, outsider.partyId, admin.partyId);

      await prisma.user.update({
        where: { id: owner.userId },
        data: { role: "MANAGER" },
      });
      await prisma.user.update({
        where: { id: outsider.userId },
        data: { role: "MANAGER" },
      });
      await prisma.user.update({
        where: { id: admin.userId },
        data: { role: "ADMIN" },
      });

      const ownerToken = await loginUser(baseUrl, ownerEmail, password);
      const outsiderToken = await loginUser(baseUrl, outsiderEmail, password);
      const adminToken = await loginUser(baseUrl, adminEmail, password);

      const createdVessel = await requestJson(baseUrl, "/vessels", {
        method: "POST",
        token: ownerToken,
        body: { name: marker, type: "Lancha", status: "Ativa" },
      });
      assert.equal(createdVessel.status, 201);
      assert.equal(createdVessel.body.ownerPartyId, owner.partyId);
      vesselIds.push(createdVessel.body.id);

      const outsiderList = await requestJson(baseUrl, "/vessels", {
        token: outsiderToken,
      });
      assert.equal(outsiderList.status, 200);
      assert.ok(
        !outsiderList.body.some(({ id }) => id === createdVessel.body.id),
      );

      const outsiderRead = await requestJson(
        baseUrl,
        `/vessels/${createdVessel.body.id}`,
        { token: outsiderToken },
      );
      assert.equal(outsiderRead.status, 404);

      const outsiderUpdate = await requestJson(
        baseUrl,
        `/vessels/${createdVessel.body.id}`,
        {
          method: "PUT",
          token: outsiderToken,
          body: { name: marker, type: "Lancha", status: "Inativa" },
        },
      );
      assert.equal(outsiderUpdate.status, 404);

      const outsiderDelete = await requestJson(
        baseUrl,
        `/vessels/${createdVessel.body.id}`,
        { method: "DELETE", token: outsiderToken },
      );
      assert.equal(outsiderDelete.status, 404);

      const outsiderCreate = await requestJson(baseUrl, "/vessels", {
        method: "POST",
        token: outsiderToken,
        body: {
          name: marker,
          type: "Lancha",
          status: "Ativa",
          ownerPartyId: owner.partyId,
        },
      });
      assert.equal(outsiderCreate.status, 403);

      const ownerRead = await requestJson(
        baseUrl,
        `/vessels/${createdVessel.body.id}`,
        { token: ownerToken },
      );
      assert.equal(ownerRead.status, 200);

      const adminRead = await requestJson(
        baseUrl,
        `/vessels/${createdVessel.body.id}`,
        { token: adminToken },
      );
      assert.equal(adminRead.status, 200);

      const adminList = await requestJson(baseUrl, "/vessels", {
        token: adminToken,
      });
      assert.equal(adminList.status, 200);
      assert.ok(
        adminList.body.some(({ id }) => id === createdVessel.body.id),
      );

      const outsiderMaintenance = await requestJson(baseUrl, "/maintenances", {
        method: "POST",
        token: outsiderToken,
        body: {
          vesselId: createdVessel.body.id,
          title: marker,
          description: "outside scope",
          type: "Preventiva",
          date: "2026-09-01",
          status: "Pendente",
        },
      });
      assert.equal(outsiderMaintenance.status, 404);

      const createdMaintenance = await requestJson(baseUrl, "/maintenances", {
        method: "POST",
        token: ownerToken,
        body: {
          vesselId: createdVessel.body.id,
          title: marker,
          description: "inside scope",
          type: "Preventiva",
          date: "2026-09-01",
          status: "Pendente",
        },
      });
      assert.equal(createdMaintenance.status, 201);
      maintenanceIds.push(createdMaintenance.body.id);

      const outsiderMaintenanceList = await requestJson(baseUrl, "/maintenances", {
        token: outsiderToken,
      });
      assert.equal(outsiderMaintenanceList.status, 200);
      assert.ok(
        !outsiderMaintenanceList.body.some(
          ({ id }) => id === createdMaintenance.body.id,
        ),
      );

      const outsiderVesselMaintenances = await requestJson(
        baseUrl,
        `/vessels/${createdVessel.body.id}/maintenances`,
        { token: outsiderToken },
      );
      assert.equal(outsiderVesselMaintenances.status, 404);

      const outsiderPreventive = await requestJson(
        baseUrl,
        "/preventive-maintenances",
        {
          method: "POST",
          token: outsiderToken,
          body: {
            title: marker,
            description: "outside scope",
            type: "Preventiva",
            status: "Pendente",
            vesselId: createdVessel.body.id,
            periodicity: "monthly",
            startDate: "2026-09-01",
          },
        },
      );
      assert.equal(outsiderPreventive.status, 404);

      const outsiderExecution = await requestJson(
        baseUrl,
        "/checklist-executions",
        {
          method: "POST",
          token: outsiderToken,
          body: {
            templateId: "inexistente",
            vesselId: createdVessel.body.id,
            responses: [],
          },
        },
      );
      assert.equal(outsiderExecution.status, 404);

      const organizationRecord = await prisma.party.create({
        data: {
          type: "ORGANIZATION",
          organization: {
            create: {
              name: `${marker}-org`,
            },
          },
        },
        include: { organization: true },
      });
      organizationId = organizationRecord.organization.id;
      organizationPartyId = organizationRecord.id;
      partyIds.push(organizationPartyId);

      await prisma.membership.create({
        data: {
          userId: owner.userId,
          organizationId: organizationRecord.organization.id,
        },
      });
      await prisma.membership.create({
        data: {
          userId: outsider.userId,
          organizationId: organizationRecord.organization.id,
        },
      });

      const orgVessel = await requestJson(baseUrl, "/vessels", {
        method: "POST",
        token: ownerToken,
        body: {
          name: `${marker}-org`,
          type: "Lancha",
          status: "Ativa",
          ownerPartyId: organizationPartyId,
        },
      });
      assert.equal(orgVessel.status, 201);
      vesselIds.push(orgVessel.body.id);

      const memberList = await requestJson(baseUrl, "/vessels", {
        token: outsiderToken,
      });
      assert.equal(memberList.status, 200);
      assert.ok(memberList.body.some(({ id }) => id === orgVessel.body.id));

      const memberRead = await requestJson(
        baseUrl,
        `/vessels/${orgVessel.body.id}`,
        { token: outsiderToken },
      );
      assert.equal(memberRead.status, 200);
    } finally {
      if (maintenanceIds.length) {
        await prisma.maintenance.deleteMany({
          where: { id: { in: maintenanceIds } },
        });
      }

      if (vesselIds.length) {
        await prisma.vessel.deleteMany({ where: { id: { in: vesselIds } } });
      }

      if (userIds.length) {
        await prisma.membership.deleteMany({
          where: { userId: { in: userIds } },
        });
      }

      if (organizationId) {
        await prisma.organization.delete({ where: { id: organizationId } });
      }

      if (partyIds.length) {
        await prisma.party.deleteMany({ where: { id: { in: partyIds } } });
      }

      if (userIds.length) {
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      }

      await new Promise((resolve) => server.close(resolve));
      await prisma.$disconnect();
    }
  },
);