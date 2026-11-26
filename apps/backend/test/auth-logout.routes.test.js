import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import jwt from "jsonwebtoken";

import { createApp } from "../src/app.js";
import { JWT_AUDIENCE, JWT_ISSUER } from "../src/lib/jwtConfig.js";
import { clearRevokedTokens } from "../src/services/tokenRevocation.js";

process.env.JWT_SECRET = "test-secret-with-at-least-32-characters";

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
  };
}

function signToken() {
  return jwt.sign(
    {
      userId: "user-1",
      partyId: "party-1",
      role: "ADMIN",
      persona: "OWNER",
      jti: "logout-http-jti",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );
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

test("POST /auth/logout revoga o token e o mesmo token deixa de autenticar", async (t) => {
  clearRevokedTokens();
  const { server, baseUrl } = await startServer(createApp({ prisma: createFakeDb() }));

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const token = signToken();
  const headers = { Authorization: `Bearer ${token}` };

  const logout = await fetch(`${baseUrl}/auth/logout`, {
    method: "POST",
    headers,
  });

  assert.equal(logout.status, 204);

  const me = await fetch(`${baseUrl}/auth/me`, { headers });

  assert.equal(me.status, 401);
  assert.equal((await me.json()).message, "Token revoked");
});

test("POST /auth/logout exige autenticacao", async (t) => {
  clearRevokedTokens();
  const { server, baseUrl } = await startServer(createApp({ prisma: createFakeDb() }));

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const logout = await fetch(`${baseUrl}/auth/logout`, { method: "POST" });

  assert.equal(logout.status, 401);
  assert.equal((await logout.json()).message, "Authentication required");
});
