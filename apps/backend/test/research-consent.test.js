import assert from "node:assert/strict";
import { test } from "node:test";

import {
  RESEARCH_CONSENT_VERSION,
  submitResearchResponse,
} from "../src/services/researchService.js";
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
      consent: {
        accepted: true,
        version: RESEARCH_CONSENT_VERSION,
        answeredAt: new Date().toISOString(),
      },
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
      consent: {
        accepted: true,
        version: RESEARCH_CONSENT_VERSION,
        answeredAt: new Date().toISOString(),
      },
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
