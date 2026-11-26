import assert from "node:assert/strict";
import { test } from "node:test";
import jwt from "jsonwebtoken";

import { authorizeRoles } from "../src/middleware/authorizeRoles.js";
import { requireAuth } from "../src/middleware/authMiddleware.js";
import { JWT_AUDIENCE, JWT_ISSUER } from "../src/lib/jwtConfig.js";
import { clearRevokedTokens, revokeToken } from "../src/services/tokenRevocation.js";

process.env.JWT_SECRET = "test-secret-with-at-least-32-characters";

function createMockResponse() {
  return {
    statusCode: 200,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function signToken(overrides = {}) {
  return jwt.sign(
    {
      userId: "user-1",
      partyId: "party-1",
      role: "USER",
      persona: "OWNER",
      jti: "jti-1",
      ...overrides,
    },
    process.env.JWT_SECRET,
    { issuer: JWT_ISSUER, audience: JWT_AUDIENCE },
  );
}

function requestWith(token, db) {
  const request = { headers: { authorization: `Bearer ${token}` } };

  if (db) request.app = { locals: { prisma: db } };

  return request;
}

test("requireAuth -> 401 sem Authorization header", async () => {
  const response = createMockResponse();

  await requireAuth({ headers: {} }, response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Authentication required");
});

test("requireAuth -> 401 com token invalido", async () => {
  const response = createMockResponse();

  await requireAuth(requestWith("token-invalido"), response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Invalid or expired token");
});

test("requireAuth -> aceita token valido e expoe payload", async () => {
  clearRevokedTokens();
  const response = createMockResponse();
  const request = requestWith(signToken());
  let nextCalled = false;

  await requireAuth(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, 200);
  assert.equal(request.user.userId, "user-1");
  assert.equal(request.user.partyId, "party-1");
  assert.equal(request.user.role, "USER");
  assert.equal(request.user.jti, "jti-1");
});

test("requireAuth -> rejeita token sem jti", async () => {
  clearRevokedTokens();
  const response = createMockResponse();
  const token = jwt.sign(
    { userId: "user-1", partyId: "party-1", role: "ADMIN" },
    process.env.JWT_SECRET,
    { issuer: JWT_ISSUER, audience: JWT_AUDIENCE },
  );

  await requireAuth(requestWith(token), response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Invalid or expired token");
});

test("requireAuth -> rejeita issuer ou audience divergentes", async () => {
  clearRevokedTokens();
  const wrongIssuer = createMockResponse();
  const wrongAudience = createMockResponse();
  const claims = {
    userId: "user-1",
    partyId: "party-1",
    role: "ADMIN",
    jti: "jti-claims",
  };

  const invalidIssuer = jwt.sign(claims, process.env.JWT_SECRET, {
    issuer: "outro",
    audience: JWT_AUDIENCE,
  });
  const invalidAudience = jwt.sign(claims, process.env.JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: "outro",
  });

  await requireAuth(requestWith(invalidIssuer), wrongIssuer, () => {
    assert.fail("next nao deve ser chamado");
  });

  await requireAuth(requestWith(invalidAudience), wrongAudience, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(wrongIssuer.statusCode, 401);
  assert.equal(wrongAudience.statusCode, 401);
  assert.equal(wrongIssuer.body.message, "Invalid or expired token");
  assert.equal(wrongAudience.body.message, "Invalid or expired token");
});

test("requireAuth -> token revogado e 401", async () => {
  clearRevokedTokens();
  const token = signToken({ jti: "revogado" });
  const response = createMockResponse();
  revokeToken("revogado", Math.floor(Date.now() / 1000) + 60);

  await requireAuth(requestWith(token), response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Token revoked");
});

test("requireAuth -> reconsulta role no banco antes de autorizar", async () => {
  clearRevokedTokens();
  const response = createMockResponse();
  const db = {
    user: {
      findUnique: async () => ({
        id: "user-1",
        partyId: "party-1",
        role: "USER",
        persona: "OWNER",
      }),
    },
  };
  const request = requestWith(signToken({ role: "DIRECTOR" }), db);
  let nextCalled = false;

  await requireAuth(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(request.user.role, "USER");
});

test("authorizeRoles -> 403 para role sem permissao", () => {
  const request = { user: { role: "USER" } };
  const response = createMockResponse();

  authorizeRoles("MANAGER", "ADMIN")(request, response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.message, "Insufficient permissions");
});

test("authorizeRoles -> 403 sem usuario autenticado", () => {
  const response = createMockResponse();

  authorizeRoles("MANAGER", "ADMIN")({}, response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 403);
});

test("authorizeRoles -> chama next quando role e permitida", () => {
  const response = createMockResponse();
  let nextCalled = false;

  authorizeRoles("MANAGER", "ADMIN")({ user: { role: "ADMIN" } }, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});
