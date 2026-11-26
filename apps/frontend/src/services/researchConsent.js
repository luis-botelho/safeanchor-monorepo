/* Consentimento explicito para captura das respostas da pesquisa.
   Nao ha cookie de rastreamento nem publicidade: a escolha fica apenas
   no armazenamento local do navegador. */

export const RESEARCH_CONSENT_KEY = "safeanchor.researchConsent";
export const PRIVACY_NOTICE_KEY = "safeanchor.cookieConsent";
export const RESEARCH_CONSENT_VERSION = "2026-11-26";
export const CONSENT_CHANGED_EVENT = "safeanchor:consent-change";

export function readResearchConsent() {
  try {
    const value = JSON.parse(localStorage.getItem(RESEARCH_CONSENT_KEY) || "null");
    if (
      value &&
      (value.decision === "accepted" || value.decision === "declined") &&
      typeof value.answeredAt === "string"
    ) {
      return value;
    }
  } catch {
    /* escolha invalida: pede novamente */
  }
  return null;
}

export function saveResearchConsent(decision) {
  if (decision !== "accepted" && decision !== "declined") return null;

  const consent = {
    decision,
    version: RESEARCH_CONSENT_VERSION,
    answeredAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(RESEARCH_CONSENT_KEY, JSON.stringify(consent));
  } catch {
    /* navegação privada: a escolha vale somente nesta sessão */
  }

  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: consent }));
  return consent;
}

export function markPrivacyNoticeSeen() {
  try {
    localStorage.setItem(PRIVACY_NOTICE_KEY, "answered");
  } catch {
    /* navegação privada: nada a registrar */
  }
}

export function clearResearchConsent() {
  try {
    localStorage.removeItem(RESEARCH_CONSENT_KEY);
  } catch {
    /* nada a remover */
  }

  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: null }));
}

export function isResearchCaptureAllowed(consent) {
  return consent?.decision === "accepted" && consent.version === RESEARCH_CONSENT_VERSION;
}
