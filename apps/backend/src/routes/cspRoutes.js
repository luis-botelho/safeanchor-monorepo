import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

import logger from "../lib/logger.js";

const ONE_HOUR = 60 * 60 * 1000;
const MAX_FIELD_LENGTH = 300;

function clientIp(request) {
  const address = request.ip || request.socket?.remoteAddress || "unknown";
  return ipKeyGenerator(address);
}

// Relatórios podem conter URLs com query strings. Guardamos só origem e caminho
// para não registrar tokens, e-mails ou outros dados sensíveis nos logs.
function sanitizeUri(value) {
  const text = String(value || "").slice(0, MAX_FIELD_LENGTH);

  try {
    const url = new URL(text);
    return `${url.origin}${url.pathname}`.slice(0, MAX_FIELD_LENGTH);
  } catch {
    return text.replace(/[^\w:.@/-]/g, "").slice(0, MAX_FIELD_LENGTH) || "unknown";
  }
}

function parseReport(body) {
  return typeof body === "string" ? JSON.parse(body) : body;
}

export function createCspRouter() {
  const router = Router();

  const limiter = rateLimit({
    windowMs: ONE_HOUR,
    limit: 60,
    keyGenerator: clientIp,
    standardHeaders: false,
    legacyHeaders: false,
    handler: (request, response) =>
      response.status(429).json({
        message: "Muitos relatórios de CSP. Tente novamente mais tarde.",
        requestId: request.id,
      }),
  });

  router.post("/csp-report", limiter, (request, response) => {
    let payload;

    try {
      payload = parseReport(request.body);
    } catch {
      return response.status(400).end();
    }

    const report = payload?.["csp-report"] || payload || {};
    const directive = String(
      report["violated-directive"] || report.effectiveDirective || "unknown",
    ).slice(0, 100);
    const lineNumber = Number(report["line-number"]);

    logger.warn(
      {
        csp: {
          directive,
          blockedUri: sanitizeUri(report["blocked-uri"]),
          sourceFile: sanitizeUri(report["source-file"]),
          lineNumber: Number.isInteger(lineNumber) ? lineNumber : null,
          requestId: request.id,
        },
      },
      "CSP violation report",
    );

    return response.status(204).end();
  });

  return router;
}

export default createCspRouter();
