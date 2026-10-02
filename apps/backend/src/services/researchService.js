import { Resend } from "resend";

const MAX_SUMMARY_LENGTH = 12000;

export async function sendResearchResponse(summary) {
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

  if (typeof summary !== "string" || !summary.trim() || summary.length > MAX_SUMMARY_LENGTH) {
    const error = new Error("Invalid research summary.");
    error.status = 400;
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
