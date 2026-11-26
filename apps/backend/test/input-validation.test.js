import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import jwt from "jsonwebtoken";

import { createApp } from "../src/app.js";
import { JWT_AUDIENCE, JWT_ISSUER } from "../src/lib/jwtConfig.js";

process.env.JWT_SECRET = "test-secret-with-at-least-32-characters";

const token = jwt.sign(
  {
    userId: "user-1",
    partyId: "party-1",
    role: "ADMIN",
    persona: "OWNER",
    jti: "validation-jti",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "15m",
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  },
);

function createFakeDb() {
  return {
    user: {
      findUnique: async () => ({
        id: "user-1",
        partyId: "party-1",
        role: "ADMIN",
        persona: "OWNER",
      }),
    },
    membership: { findMany: async () => [] },
  };
}

async function withServer(callback) {
  const server = createServer(createApp({ prisma: createFakeDb() }));

  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    await callback(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function authHeaders() {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function post(baseUrl, path, body, authenticated = true) {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: authenticated ? authHeaders() : { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("/auth/register rejeita senha curta e e-mail invalido", async () => {
  await withServer(async (baseUrl) => {
    const shortPassword = await post(
      baseUrl,
      "/auth/register",
      { name: "Ana", email: "ana@example.com", password: "1" },
      false,
    );

    assert.equal(shortPassword.status, 400);

    const invalidEmail = await post(
      baseUrl,
      "/auth/register",
      { name: "Ana", email: 123, password: "senha-super-segura-123" },
      false,
    );

    assert.equal(invalidEmail.status, 400);
  });
});

test("endpoints autenticados retornam 400 para tipos inesperados", async () => {
  await withServer(async (baseUrl) => {
    const cases = [
      ["/vessels", { name: 42, type: "Lancha", status: "ATIVA" }],
      [
        "/documents",
        {
          vesselId: "ves-1",
          name: 42,
          category: "Seguro",
          number: "BR-1",
          validFrom: "2026-01-01",
          expiresAt: "2027-01-01",
        },
      ],
      [
        "/inspections",
        {
          vesselId: "ves-1",
          type: [],
          scheduledAt: "2026-12-01T00:00:00.000Z",
          inspector: "Carlos",
        },
      ],
      [
        "/maintenances",
        {
          vesselId: "ves-1",
          title: 42,
          description: "Troca",
          type: "CORRETIVA",
          date: "2026-12-01",
          status: "PENDENTE",
        },
      ],
    ];

    for (const [path, body] of cases) {
      const response = await post(baseUrl, path, body);
      assert.equal(response.status, 400, ` corpo inválido em ${path}`);
    }
  });
});
