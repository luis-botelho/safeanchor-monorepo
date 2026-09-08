import assert from "node:assert/strict";
import { test } from "node:test";
import jwt from "jsonwebtoken";

import { authorizeRoles } from "../src/middleware/authorizeRoles.js";
import { requireAuth } from "../src/middleware/authMiddleware.js";

process.env.JWT_SECRET = "test-secret";

function createMockResponse() {
  const response = {
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

  return response;
}

test("requireAuth -> 401 sem Authorization header", () => {
  const request = { headers: {} };
  const response = createMockResponse();

  requireAuth(request, response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Authentication required");
});

test("requireAuth -> 401 com token invalido", () => {
  const request = { headers: { authorization: "Bearer token-invalido" } };
  const response = createMockResponse();

  requireAuth(request, response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.message, "Invalid or expired token");
});

test("requireAuth -> aceita token valido e expoe payload", () => {
  const token = jwt.sign(
    { userId: "user-1", partyId: "party-1", role: "USER" },
    process.env.JWT_SECRET,
  );

  const request = { headers: { authorization: `Bearer ${token}` } };
  const response = createMockResponse();

  let nextCalled = false;

  requireAuth(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(request.user.userId, "user-1");
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
  const request = {};
  const response = createMockResponse();

  authorizeRoles("MANAGER", "ADMIN")(request, response, () => {
    assert.fail("next nao deve ser chamado");
  });

  assert.equal(response.statusCode, 403);
});

test("authorizeRoles -> chama next quando role e permitida", () => {
  const request = { user: { role: "ADMIN" } };
  const response = createMockResponse();

  let nextCalled = false;

  authorizeRoles("MANAGER", "ADMIN")(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});