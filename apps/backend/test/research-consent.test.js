import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

import { createApp } from "../src/app.js";
import { issueResearchNonce } from "../src/lib/researchConsent.js";
import {
  RESEARCH_CONSENT_VERSION,
  submitResearchResponse,
} from "../src/services/researchService.js";

process.env.JWT_SECRET ||= "test-secret-with-at-least-32-characters";
import {
  getInsights,
  updateResponse,
  updateUser,
} from "../src/services/directorService.js";

function mockDb() {
  const created = [];
  const actions = [];
  const response = {
    id: "res-1",
    status: "NEW",
    decision: null,
    contact: "ana@example.com",
    profile: "Proprietário de lancha",
    city: "Baixada Santista",
    createdAt: new Date().toISOString(),
  };
  const user = {
    id: "user-1",
    name: "Demo",
    role: "USER",
    persona: "OWNER",
  };

  return {
    created,
    actions,
    researchResponse: {
      create: async ({ data }) => {
        created.push(data);
        return { id: "res-1" };
      },
      findMany: async () => [response],
      findUnique: async () => response,
      update: async ({ data }) => {
        Object.assign(response, data);
        return response;
      },
    },
    directorAction: {
      create: async ({ data }) => {
        actions.push(data);
        return data;
      },
    },
    user: {
      findUnique: async () => user,
      findMany: async () => [user],
      count: async () => 2,
      update: async ({ data }) => {
        Object.assign(user, data);
        return user;
      },
    },
  };
}

function acceptedConsent() {
  return {
    accepted: true,
    version: RESEARCH_CONSENT_VERSION,
    answeredAt: new Date().toISOString(),
    nonce: issueResearchNonce().nonce,
  };
}

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

test("recusa de consentimento nao captura nem grava resposta", async () => {
  const db = mockDb();
  const result = await submitResearchResponse(
    { summary: "Resumo de teste", consent: { accepted: false }, response: {} },
    db,
  );

  assert.equal(result.captured, false);
  assert.equal(db.created.length, 0);
});

test("aceite explicito grava resposta com versao do consentimento", async () => {
  const db = mockDb();
  const result = await submitResearchResponse(
    {
      summary: "Resumo de teste",
      consent: acceptedConsent(),
      response: {
        name: "Ana",
        contact: "ana@example.com",
        city: "Santos",
        profile: "Proprietário de lancha",
        answers: { perfil: "lancha" },
      },
    },
    db,
  );

  assert.equal(result.captured, true);
  assert.equal(db.created.length, 1);
  assert.equal(db.created[0].consentVersion, RESEARCH_CONSENT_VERSION);
  assert.equal(db.created[0].contact, "ana@example.com");
});

test("aceite preserva respostas de multipla selecao", async () => {
  const db = mockDb();
  await submitResearchResponse(
    {
      summary: "Resumo de teste",
      consent: acceptedConsent(),
      response: {
        answers: { owner_problema: ["documentos", "prestadores", 42] },
      },
    },
    db,
  );

  assert.deepEqual(db.created[0].answers.owner_problema, [
    "documentos",
    "prestadores",
    "42",
  ]);
});

test("sem nonce assinado o aceite do cliente e rejeitado", async () => {
  const db = mockDb();

  await assert.rejects(
    submitResearchResponse(
      {
        summary: "Resumo de teste",
        consent: {
          accepted: true,
          version: RESEARCH_CONSENT_VERSION,
          answeredAt: new Date().toISOString(),
        },
        response: {},
      },
      db,
    ),
    (error) => error.status === 400,
  );

  assert.equal(db.created.length, 0);
});

test("captura registra IP, user-agent e timestamp do servidor", async () => {
  const db = mockDb();

  await submitResearchResponse(
    {
      summary: "Resumo de teste",
      consent: acceptedConsent(),
      response: {},
    },
    db,
    { ip: "203.0.113.10", userAgent: "Mozilla/5.0" },
  );

  assert.equal(db.actions.length, 1);
  assert.equal(db.actions[0].action, "CAPTURE_CONSENT");
  assert.equal(db.actions[0].details.ip, "203.0.113.10");
  assert.equal(db.actions[0].details.userAgent, "Mozilla/5.0");
  assert.ok(db.actions[0].details.acceptedAt);
  assert.ok(db.actions[0].details.nonceJti);
});

test("GET /research/nonce emite nonce e POST sem nonce e rejeitado", async (t) => {
  const { server, baseUrl } = await startServer(createApp({ prisma: mockDb() }));

  t.after(() => new Promise((resolve) => server.close(resolve)));

  const nonceResponse = await fetch(`${baseUrl}/research/nonce`);

  assert.equal(nonceResponse.status, 200);
  const nonceBody = await nonceResponse.json();
  assert.equal(typeof nonceBody.nonce, "string");
  assert.equal(nonceBody.version, RESEARCH_CONSENT_VERSION);

  const rejected = await fetch(`${baseUrl}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: "Resumo de teste",
      consent: {
        accepted: true,
        version: RESEARCH_CONSENT_VERSION,
        answeredAt: new Date().toISOString(),
      },
      response: {},
    }),
  });

  assert.equal(rejected.status, 400);
  assert.match((await rejected.json()).message, /Consentimento invalido/);
});

test("diretoria atualiza resposta e registra auditoria minima", async () => {
  const db = mockDb();
  const updated = await updateResponse(
    { id: "res-1", status: "ACTIONED", decision: "Criar alerta de validade" },
    "director-1",
    db,
  );

  assert.equal(updated.status, "ACTIONED");
  assert.equal(db.actions.length, 1);
  assert.equal(db.actions[0].targetType, "RESEARCH_RESPONSE");
});

test("diretoria altera papel do usuario e mantém um diretor", async () => {
  const db = mockDb();
  const updated = await updateUser(
    { id: "user-1", role: "MANAGER", persona: "MARINA" },
    "director-1",
    db,
  );

  assert.equal(updated.role, "MANAGER");
  assert.equal(db.actions[0].action, "UPDATE_USER");
});

test("insights resumem respostas capturadas", async () => {
  const db = mockDb();
  const insights = await getInsights(db);

  assert.equal(insights.total, 1);
  assert.equal(insights.withContact, 1);
  assert.deepEqual(insights.byStatus, { NEW: 1 });
});
