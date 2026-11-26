import { submitResearchResponse } from "../services/researchService.js";

export async function submitResearch(request, response) {
  try {
    const result = await submitResearchResponse(request.body);

    return response.status(202).json({
      message: result.message,
      captured: result.captured,
      emailSent: result.emailSent,
      emailWarning: result.emailWarning || undefined,
      id: result.id,
    });
  } catch (error) {
    if (error.status === 400) {
      return response.status(400).json({ message: error.message });
    }

    request.log?.error({ err: error }, "Could not process research response");

    return response.status(503).json({
      code: "RESEARCH_CAPTURE_FAILED",
      message: "Não foi possível registrar a resposta agora. Tente novamente em instantes.",
    });
  }
}
