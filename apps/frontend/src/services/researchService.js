import { apiFetch } from "./api";

/* ============================================================
   SafeAnchor — Envio das respostas da pesquisa
   A resposta vai ao backend, que a encaminha pelo Resend. WhatsApp
   e e-mail manual continuam disponíveis como formas de compartilhar.
   ============================================================ */

const rawPhone = import.meta.env.VITE_RESEARCH_WHATSAPP || "";

/* Apenas dígitos, com código do país. Ex.: "5511999999999" */
export const researchPhone = String(rawPhone).replace(/\D/g, "");

export const researchInbox =
  import.meta.env.VITE_RESEARCH_INBOX || "pesquisa@safeanchor.app";

export function hasWhatsappTarget() {
  return researchPhone.length > 0;
}

function labelFor(question, values) {
  const options = question.options || [];
  const labels = values
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter(Boolean);

  return labels.join("; ") || values.join("; ");
}

function isBlank(value) {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim() === "";
}

function formatAnswers(questions, answers) {
  const lines = [];

  questions.forEach((question) => {
    const values = answers[question.id];

    if (isBlank(values)) {
      lines.push(`- ${question.question} (pulei)`);
      return;
    }

    const list = Array.isArray(values) ? values : [values];
    const readable = question.options
      ? labelFor(question, list)
      : String(values);

    const other = answers[`${question.id}__other`];

    lines.push(
      `- ${question.question} ${readable}${
        !isBlank(other) ? ` — ${other}` : ""
      }`
    );
  });

  return lines;
}

export function buildSummary({ questions, answers, contact, startedAt }) {
  const lines = ["Resposta da pesquisa SafeAnchor", ""];

  lines.push(...formatAnswers(questions, answers));

  const extras = [];

  if (contact?.nome) extras.push(`Nome: ${contact.nome}`);
  if (contact?.contato) extras.push(`Contato: ${contact.contato}`);
  if (contact?.cidade) extras.push(`Cidade: ${contact.cidade}`);
  if (contact?.perfil) extras.push(`Perfil: ${contact.perfil}`);
  if (extras.length > 0) {
    lines.push("", "Contato", ...extras);
  }

  if (startedAt) {
    lines.push("", `Enviado em ${new Date(startedAt).toLocaleString("pt-BR")}`);
  }

  return lines.join("\n");
}

export function buildWhatsappUrl(summary) {
  return `https://wa.me/${researchPhone}?text=${encodeURIComponent(summary)}`;
}

export function buildMailtoUrl(summary) {
  const subject = "Resposta da pesquisa SafeAnchor";
  return `mailto:${researchInbox}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(summary)}`;
}

export async function copySummary(summary) {
  if (!navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(summary);
    return true;
  } catch {
    return false;
  }
}

export async function persistLocally(payload) {
  try {
    const previous = JSON.parse(
      localStorage.getItem("safeanchor.researchResponses") || "[]"
    );
    previous.push(payload);
    localStorage.setItem(
      "safeanchor.researchResponses",
      JSON.stringify(previous)
    );
    return true;
  } catch {
    return false;
  }
}

export function sendResearchSummary(summary) {
  return apiFetch("/research", {
    method: "POST",
    body: JSON.stringify({ summary }),
  });
}
