import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import { createApp } from "../src/app.js";

test("API expõe headers de segurança e não anuncia X-Powered-By", async (t) => {
  const server = createServer(createApp({ prisma: {} }));

  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await fetch(
    `http://127.0.0.1:${server.address().port}/`,
  );

  assert.equal(response.headers.get("x-powered-by"), null);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.match(
    response.headers.get("strict-transport-security") || "",
    /max-age=63072000/,
  );
  assert.match(
    response.headers.get("permissions-policy") || "",
    /geolocation=\(\)/,
  );
});
