import { Resend } from "resend";

import {
  RESEARCH_CONSENT_VERSION,
  verifyResearchNonce,
} from "../lib/researchConsent.js";
import prisma from "../lib/prisma.js";

const MAX_SUMMARY_LENGTH = 12000;
const MAX_TEXT_LENGTH = 500;
const MAX_ANSWER_KEYS = 60;
const MAX_ANSWER_ITEMS = 30;
const MAX_ANSWER_LENGTH = 2000;

// Reexportado para compatibilidade com consumidores existentes.
export { RESEARCH_CONSENT_VERSION };

function cleanText(value, maximum = MAX_TEXT_LENGTH) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text.slice(0, maximum) : null;
}

const isPrimitiveAnswer = (value) =>
  ["string", "number", "boolean"].includes(typeof value);

function cleanAnswerValue(value) {
  if (Array.isArray(value)) {
    return value
      .filter(isPrimitiveAnswer)
      .slice(0, MAX_ANSWER_ITEMS)
      .map((item) => String(item).slice(0, MAX_ANSWER_LENGTH));
  }

  return isPrimitiveAnswer(value) ? String(value).slice(0, MAX_ANSWER_LENGTH) : null;
}

function cleanAnswers(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce((result, [key, item]) => {
    if (Object.keys(result).length >= MAX_ANSWER_KEYS) return result;
    const cleaned = cleanAnswerValue(item);
    if (cleaned !== null) {
      result[String(key).slice(0, 80)] = cleaned;
    }
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

export async function submitResearchResponse(
  payload,
  db = prisma,
  requestContext = {},
) {
  const summary = payload?.summary;

  if (typeof summary !== "string" || !summary.trim() || summary.length > MAX_SUMMARY_LENGTH) {
    const error = new Error("Invalid research summary.");
    error.status = 400;
    throw error;
  }

  // Campo escondido do formulario: bots preenchem, pessoas nao veem.
  // Responde como "nao capturado" para nao sinalizar o filtro ao bot.
  if (
    typeof payload?.response?.website === "string" &&
    payload.response.website.trim()
  ) {
    return {
      captured: false,
      emailSent: false,
      message: "Consentimento nao concedido; nenhuma resposta foi capturada.",
    };
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

  // O nonce é emitido e assinado pelo servidor. Aceitar apenas
  // `consent.accepted: true` do cliente permitiria gravar respostas sem gate.
  const nonce = verifyResearchNonce(consent?.nonce);

  if (!nonce || consent.version !== RESEARCH_CONSENT_VERSION) {
    const error = new Error("Consentimento invalido ou expirado.");
    error.status = 400;
    throw error;
  }

  const acceptedAt = new Date().toISOString();
  const responseData = payload.response || {};
  const saved = await db.researchResponse.create({
    data: {
      consentVersion: nonce.consentVersion,
      acceptedAt,
      name: cleanText(responseData.name),
      contact: cleanText(responseData.contact),
      city: cleanText(responseData.city, 120),
      profile: cleanText(responseData.profile, 120),
      answers: cleanAnswers(responseData.answers),
      summary,
      createdAt: acceptedAt,
    },
    select: { id: true },
  });

  // Reaproveita a tabela de auditoria ja existente: sem migration nova.
  // IP, user-agent e timestamp sao do servidor, nunca do navegador.
  if (db.directorAction?.create) {
    try {
      await db.directorAction.create({
        data: {
          actorId: "research-consent",
          targetType: "RESEARCH_RESPONSE",
          targetId: saved.id,
          action: "CAPTURE_CONSENT",
          details: {
            ip: requestContext.ip || null,
            userAgent: cleanText(requestContext.userAgent, 300),
            acceptedAt,
            clientAnsweredAt: cleanText(consent.answeredAt, 40),
            consentVersion: nonce.consentVersion,
            nonceJti: nonce.jti,
          },
          createdAt: acceptedAt,
        },
      });
    } catch {
      // A captura principal ja foi gravada; a auditoria e best-effort.
    }
  }

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
