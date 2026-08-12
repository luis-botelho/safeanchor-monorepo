import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

test("GET / returns the API status", async (t) => {
  const server = spawn(process.execPath, ["src/server.js"], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
  });

  t.after(() => server.kill());

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("API did not start in time")),
      5000,
    );

    server.once("error", reject);
    server.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("http://localhost:3001")) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });

  const response = await fetch("http://127.0.0.1:3001/");
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, {
    name: "SafeAnchor API",
    status: "online",
  });
});
