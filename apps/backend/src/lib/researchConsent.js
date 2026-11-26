import { randomUUID } from "node:crypto";

import jwt from "jsonwebtoken";

import { getJwtSecret } from "./jwtConfig.js";

export const RESEARCH_CONSENT_VERSION = "2026-11-26";

const NONCE_ISSUER = "safeanchor-research";
const NONCE_AUDIENCE = "safeanchor-research-consent";
const NONCE_TTL_SECONDS = 10 * 60;

// Nonce assinado pelo servidor: o cliente não consegue forjar um aceite,
// nem reutilizar um nonce depois da janela de 10 minutos.
export function issueResearchNonce() {
  const nonce = jwt.sign(
    {
      jti: randomUUID(),
      consentVersion: RESEARCH_CONSENT_VERSION,
    },
    getJwtSecret(),
    {
      expiresIn: NONCE_TTL_SECONDS,
      issuer: NONCE_ISSUER,
      audience: NONCE_AUDIENCE,
    },
  );

  return {
    nonce,
    expiresInSeconds: NONCE_TTL_SECONDS,
    version: RESEARCH_CONSENT_VERSION,
  };
}

export function verifyResearchNonce(nonce) {
  if (typeof nonce !== "string" || !nonce.trim()) return null;

  try {
    const payload = jwt.verify(nonce, getJwtSecret(), {
      algorithms: ["HS256"],
      issuer: NONCE_ISSUER,
      audience: NONCE_AUDIENCE,
    });

    if (!payload.jti || payload.consentVersion !== RESEARCH_CONSENT_VERSION) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
