import { Resend } from "resend";

import prisma from "../lib/prisma.js";

const MAX_SUMMARY_LENGTH = 12000;
const MAX_TEXT_LENGTH = 500;
const MAX_ANSWER_KEYS = 60;
const MAX_ANSWER_LENGTH = 2000;

// Versionado para que a politica aceita fique identificada em cada resposta.
export const RESEARCH_CONSENT_VERSION = "2026-11-26";

function cleanText(value, maximum = MAX_TEXT_LENGTH) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text.slice(0, maximum) : null;
}

function cleanAnswers(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce((result, [key, item]) => {
    if (Object.keys(result).length >= MAX_ANSWER_KEYS) return result;
    if (typeof item !== "string" && typeof item !== "number" && typeof item !== "boolean") {
      return result;
    }
    result[String(key).slice(0, 80)] = String(item).slice(0, MAX_ANSWER_LENGTH);
    return result;
  }, {});
}

async function emailResearchSummary(summary) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEARCH_FROM_EMAIL;
  const to = process.env.RESEARCH_INBOX || "pesquisa@safeanchor.app";

  const missingVariables = [
    !apiKey && "RESEND_API_KEY",
    !from && "RESEARCH_FROM_EMAIL",
  ].filter(Boolean);

  if (missingVariables.length > 0) {
    const error = new Error("Research email configuration is incomplete.");
    error.code = "EMAIL_CONFIG_MISSING";
    error.missingVariables = missingVariables;
    throw error;
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Nova resposta da pesquisa SafeAnchor",
    text: summary,
  });

  if (error) {
    const sendError = new Error("Resend rejected the research email.", { cause: error });
    sendError.code = "RESEND_REJECTED";
    sendError.providerError = {
      name: error.name,
      statusCode: error.statusCode,
      message: error.message,
    };
    throw sendError;
  }

  return data;
}

// Mantido como API publica simples para quem quiser apenas enviar o e-mail.
export async function sendResearchResponse(summary) {
  if (typeof summary !== "string" || !summary.trim() || summary.length > MAX_SUMMARY_LENGTH) {
    const error = new Error("Invalid research summary.");
    error.status = 400;
    throw error;
  }

  return emailResearchSummary(summary);
}

export async function submitResearchResponse(payload, db = prisma) {
  const summary = payload?.summary;

  if (typeof summary !== "string" || !summary.trim() || summary.length > MAX_SUMMARY_LENGTH) {
    const error = new Error("Invalid research summary.");
    error.status = 400;
    throw error;
  }

  const consent = payload?.consent;

  // Sem aceite explicito, nada e enviado ao servidor nem gravado no banco.
  if (consent?.accepted !== true) {
    return {
      captured: false,
      emailSent: false,
      message: "Consentimento nao concedido; nenhuma resposta foi capturada.",
    };
  }

  if (
    consent.version !== RESEARCH_CONSENT_VERSION ||
    typeof consent.answeredAt !== "string" ||
    !consent.answeredAt.trim()
  ) {
    const error = new Error("Consentimento invalido ou desatualizado.");
    error.status = 400;
    throw error;
  }

  const responseData = payload.response || {};
  const saved = await db.researchResponse.create({
    data: {
      consentVersion: RESEARCH_CONSENT_VERSION,
      acceptedAt: consent.answeredAt.slice(0, 40),
      name: cleanText(responseData.name),
      contact: cleanText(responseData.contact),
      city: cleanText(responseData.city, 120),
      profile: cleanText(responseData.profile, 120),
      answers: cleanAnswers(responseData.answers),
      summary,
      createdAt: new Date().toISOString(),
    },
    select: { id: true },
  });

  let emailSent = false;
  let emailWarning = null;
  try {
    await emailResearchSummary(summary);
    emailSent = true;
  } catch (error) {
    emailWarning =
      error.code === "EMAIL_CONFIG_MISSING"
        ? "resposta salva, mas o e-mail nao esta configurado"
        : "resposta salva, mas o e-mail nao pôde ser enviado";
  }

  return {
    captured: true,
    emailSent,
    emailWarning,
    id: saved.id,
    message: "Resposta capturada com consentimento.",
  };
}
