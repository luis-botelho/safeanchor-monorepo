import prisma from "../lib/prisma.js";

const VALID_ROLES = ["USER", "MANAGER", "ADMIN", "DIRECTOR"];
const VALID_PERSONAS = ["OWNER", "SERVICE_PROVIDER", "MARINA"];
const VALID_RESPONSE_STATUSES = ["NEW", "REVIEWED", "ACTIONED"];

function invalid(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function cleanText(value, maximum = 500) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text.slice(0, maximum) : null;
}

function buildResponseFilter(query = {}) {
  const where = {};

  const status = cleanText(query.status, 30);
  if (status && VALID_RESPONSE_STATUSES.includes(status)) where.status = status;

  const city = cleanText(query.city, 120);
  if (city) where.city = { contains: city, mode: "insensitive" };

  const profile = cleanText(query.profile, 120);
  if (profile) where.profile = { contains: profile, mode: "insensitive" };

  const from = cleanText(query.from, 40);
  if (from) where.createdAt = { ...(where.createdAt || {}), gte: from };

  const to = cleanText(query.to, 40);
  if (to) where.createdAt = { ...(where.createdAt || {}), lte: to };

  return where;
}

export async function listResponses(query = {}, db = prisma) {
  const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 100);

  return db.researchResponse.findMany({
    where: buildResponseFilter(query),
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getInsights(db = prisma) {
  const responses = await db.researchResponse.findMany({
    select: { status: true, profile: true, city: true, contact: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 2000,
  });

  const countBy = (key) =>
    responses.reduce((result, item) => {
      const label = item[key] || "Não informado";
      result[label] = (result[label] || 0) + 1;
      return result;
    }, {});

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return {
    total: responses.length,
    withContact: responses.filter((item) => Boolean(item.contact)).length,
    last7Days: responses.filter((item) => Date.parse(item.createdAt) >= sevenDaysAgo).length,
    byStatus: countBy("status"),
    byProfile: countBy("profile"),
    byCity: countBy("city"),
    latest: responses.slice(0, 5).map((item) => ({
      id: item.id,
      profile: item.profile,
      city: item.city,
      status: item.status,
      createdAt: item.createdAt,
    })),
  };
}

export async function listUsers(db = prisma) {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      persona: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function updateUser({ id, name, role, persona }, actorId, db = prisma) {
  const current = await db.user.findUnique({
    where: { id },
    select: { id: true, name: true, role: true, persona: true },
  });

  if (!current) return null;

  if (role && !VALID_ROLES.includes(role)) {
    throw invalid("Papel inválido.");
  }

  if (persona && !VALID_PERSONAS.includes(persona)) {
    throw invalid("Persona inválida.");
  }

  if (actorId === id && role && role !== current.role) {
    throw invalid("Você não pode alterar seu próprio papel.");
  }

  if (current.role === "DIRECTOR" && role && role !== "DIRECTOR") {
    const directors = await db.user.count({ where: { role: "DIRECTOR" } });
    if (directors <= 1) {
      throw invalid("Mantenha pelo menos um administrador da diretoria.");
    }
  }

  const nextName = cleanText(name, 120);
  const data = {
    ...(nextName ? { name: nextName } : {}),
    ...(role ? { role } : {}),
    ...(persona ? { persona } : {}),
  };

  const updated = await db.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      persona: true,
    },
  });

  await db.directorAction.create({
    data: {
      actorId,
      targetType: "USER",
      targetId: id,
      action: "UPDATE_USER",
      details: {
        before: { name: current.name, role: current.role, persona: current.persona },
        after: { name: updated.name, role: updated.role, persona: updated.persona },
      },
      createdAt: new Date().toISOString(),
    },
  });

  return updated;
}

export async function updateResponse({ id, status, decision }, actorId, db = prisma) {
  const current = await db.researchResponse.findUnique({
    where: { id },
    select: { id: true, status: true, decision: true },
  });

  if (!current) return null;

  if (status && !VALID_RESPONSE_STATUSES.includes(status)) {
    throw invalid("Status inválido.");
  }

  const nextDecision = cleanText(decision, 1000);
  const updated = await db.researchResponse.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(nextDecision ? { decision: nextDecision } : {}),
    },
    select: {
      id: true,
      status: true,
      decision: true,
      profile: true,
      city: true,
      createdAt: true,
    },
  });

  await db.directorAction.create({
    data: {
      actorId,
      targetType: "RESEARCH_RESPONSE",
      targetId: id,
      action: "UPDATE_RESPONSE",
      details: {
        before: { status: current.status, decision: current.decision },
        after: { status: updated.status, decision: updated.decision },
      },
      createdAt: new Date().toISOString(),
    },
  });

  return updated;
}

export async function listActions(query = {}, db = prisma) {
  const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 100);

  return db.directorAction.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
