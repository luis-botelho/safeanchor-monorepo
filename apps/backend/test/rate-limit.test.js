import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import { createApp } from "../src/app.js";

function startServer(app) {
  const server = createServer(app);

  return new Promise((resolve) => {
    server.listen(0, () => {
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${server.address().port}`,
      });
    });
  });
}

function researchRequest(baseUrl) {
  return fetch(`${baseUrl}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: "Verificação de limite",
      consent: { accepted: false },
      response: {},
    }),
  });
}

test("/research aplica limite por IP", async (t) => {
  process.env.RESEARCH_IP_LIMIT = "2";
  const { server, baseUrl } = await startServer(createApp({ prisma: {} }));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  assert.equal((await researchRequest(baseUrl)).status, 202);
  assert.equal((await researchRequest(baseUrl)).status, 202);

  const blocked = await researchRequest(baseUrl);
  assert.equal(blocked.status, 429);
  assert.match((await blocked.json()).message, /Muitas respostas/);
});

test("honeypot preenchido não captura resposta", async (t) => {
  process.env.RESEARCH_IP_LIMIT = "20";
  const { server, baseUrl } = await startServer(createApp({ prisma: {} }));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await fetch(`${baseUrl}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: "Bot detectado",
      consent: {
        accepted: true,
        version: "2026-11-26",
        answeredAt: new Date().toISOString(),
      },
      response: { website: "https://spam.example" },
    }),
  });

  assert.equal(response.status, 202);
  const body = await response.json();
  assert.equal(body.captured, false);
  assert.equal(body.emailSent, false);
});
