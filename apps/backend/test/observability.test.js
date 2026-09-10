import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import { createApp } from "../src/app.js";

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

const okDb = {
  $queryRaw: async () => [{ "?column?": 1 }],
};

const downDb = {
  $queryRaw: async () => {
    throw new Error(
      "FATAL: password authentication failed for user \"postgres\"",
    );
  },
};

test("GET /health is public and returns ok when database is up", async (t) => {
  const { server, baseUrl } = await startServer(createApp({ prisma: okDb }));

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.database, "up");
  assert.equal(typeof body.timestamp, "string");
  assert.ok(typeof body.uptime === "number");

  const unauthenticatedResponse = await fetch(`${baseUrl}/modules`);
  assert.equal(unauthenticatedResponse.status, 401);
});

test("GET /health returns 503 degraded when database is down", async (t) => {
  const { server, baseUrl } = await startServer(createApp({ prisma: downDb }));

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.status, "degraded");
  assert.equal(body.database, "down");
  assert.equal(typeof body.timestamp, "string");

  const serialized = JSON.stringify(body);
  assert.ok(!serialized.includes("FATAL"));
  assert.ok(!serialized.includes("postgres"));
});

test("500 responses are generic and do not leak stack or secrets", async (t) => {
  const app = createApp({
    prisma: okDb,
    beforeAuth: (app) => {
      app.get("/boom", () => {
        throw new Error("super-secret-internal-detail");
      });
    },
  });

  const { server, baseUrl } = await startServer(app);

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await fetch(`${baseUrl}/boom`);
  const body = await response.json();

  assert.equal(response.status, 500);
  assert.equal(body.message, "Internal server error");
  assert.equal(typeof body.requestId, "string");

  const serialized = JSON.stringify(body);
  assert.ok(!serialized.includes("super-secret-internal-detail"));
  assert.ok(!serialized.includes("at "));
});

test("existing root route still works", async (t) => {
  const { server, baseUrl } = await startServer(createApp({ prisma: okDb }));

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    name: "SafeAnchor API",
    status: "online",
  });
});