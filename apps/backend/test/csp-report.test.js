import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import { createApp } from "../src/app.js";

async function withServer(callback) {
  const server = createServer(createApp({ prisma: {} }));
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    await callback(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("recebe relatório CSP e responde 204", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/csp-report`, {
      method: "POST",
      headers: { "content-type": "application/csp-report" },
      body: JSON.stringify({
        "csp-report": {
          "violated-directive": "script-src",
          "blocked-uri": "https://evil.example/script.js?token=segredo",
          "source-file": "https://luis-botelho.github.io/safeanchor-monorepo/index.html",
          "line-number": 42,
        },
      }),
    });

    assert.equal(response.status, 204);
  });
});

test("rejeita relatório CSP com JSON inválido", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/csp-report`, {
      method: "POST",
      headers: { "content-type": "application/csp-report" },
      body: "payload-invalido",
    });

    assert.equal(response.status, 400);
  });
});
