import { Resend } from "resend";

const MAX_SUMMARY_LENGTH = 12000;

export async function sendResearchResponse(summary) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEARCH_FROM_EMAIL;
  const to = process.env.RESEARCH_INBOX || "pesquisa@safeanchor.app";

  if (!apiKey || !from) {
    throw new Error("Research email is not configured.");
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
    throw new Error("Resend could not send the research email.", { cause: error });
  }

  return data;
}
