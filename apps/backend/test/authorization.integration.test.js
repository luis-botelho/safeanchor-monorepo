import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import express from "express";
import jwt from "jsonwebtoken";

import prisma from "../src/lib/prisma.js";
import { requireAuth } from "../src/middleware/authMiddleware.js";
import authRoutes from "../src/routes/authRoutes.js";
import vesselRoutes from "../src/routes/vesselRoutes.js";

const integrationEnabled = process.env.ALLOW_DATABASE_SMOKE === "true";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use(requireAuth);
  app.use("/vessels", vesselRoutes);
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

test(
  "Authorization RBAC integration",
  { skip: !integrationEnabled },
  async () => {
    const { server, baseUrl } = await startServer(buildApp());

    const marker = `authz-${Date.now()}`;
    const userEmail = `${marker}-user@test.com`;
    const managerEmail = `${marker}-manager@test.com`;
    const password = "senha123";

    let userIds = [];
    let partyIds = [];
    let vesselId = null;

    try {
      const registerResponse = await requestJson(
        baseUrl,
        "/auth/register",
        {
          method: "POST",
          body: {
            name: "User",
            email: userEmail,
            password,
            role: "ADMIN",
          },
        },
      );

      assert.equal(registerResponse.status, 201);
      assert.equal(registerResponse.body.role, "USER");
      assert.ok(registerResponse.body.id);

      const publicUserId = registerResponse.body.id;

      const managerRegisterResponse = await requestJson(
        baseUrl,
        "/auth/register",
        {
          method: "POST",
          body: {
            name: "Manager",
            email: managerEmail,
            password,
          },
        },
      );

      assert.equal(managerRegisterResponse.status, 201);
      userIds = [publicUserId, managerRegisterResponse.body.id];

      const promotedManager = await prisma.user.update({
        where: { id: managerRegisterResponse.body.id },
        data: { role: "MANAGER" },
        select: { partyId: true },
      });
      partyIds = [registerResponse.body.partyId, promotedManager.partyId];

      const userLoginResponse = await requestJson(baseUrl, "/auth/login", {
        method: "POST",
        body: { email: userEmail, password },
      });
      assert.equal(userLoginResponse.status, 200);
      assert.equal(userLoginResponse.body.user.role, "USER");

      const payload = jwt.decode(userLoginResponse.body.token);
      assert.equal(payload.role, "USER");

      const userToken = userLoginResponse.body.token;

      const managerLoginResponse = await requestJson(baseUrl, "/auth/login", {
        method: "POST",
        body: { email: managerEmail, password },
      });
      assert.equal(managerLoginResponse.status, 200);
      assert.equal(managerLoginResponse.body.user.role, "MANAGER");

      const managerToken = managerLoginResponse.body.token;

      const meResponse = await requestJson(baseUrl, "/auth/me", {
        token: userToken,
      });
      assert.equal(meResponse.status, 200);
      assert.equal(meResponse.body.role, "USER");

      const noTokenResponse = await requestJson(baseUrl, "/vessels");
      assert.equal(noTokenResponse.status, 401);

      const invalidTokenResponse = await requestJson(baseUrl, "/vessels", {
        token: "token-invalido",
      });
      assert.equal(invalidTokenResponse.status, 401);

      const userReadResponse = await requestJson(baseUrl, "/vessels", {
        token: userToken,
      });
      assert.equal(userReadResponse.status, 200);
      assert.ok(Array.isArray(userReadResponse.body));

      const userWriteResponse = await requestJson(baseUrl, "/vessels", {
        method: "POST",
        token: userToken,
        body: { name: marker, type: "Lancha", status: "Ativa" },
      });
      assert.equal(userWriteResponse.status, 403);

      const managerWriteResponse = await requestJson(baseUrl, "/vessels", {
        method: "POST",
        token: managerToken,
        body: { name: marker, type: "Lancha", status: "Ativa" },
      });
      assert.equal(managerWriteResponse.status, 201);
      assert.ok(managerWriteResponse.body.id);
      vesselId = managerWriteResponse.body.id;
    } finally {
      if (vesselId) {
        await prisma.vessel.deleteMany({ where: { id: vesselId } });
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