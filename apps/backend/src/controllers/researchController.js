import { sendResearchResponse } from "../services/researchService.js";

export async function submitResearch(request, response) {
  try {
    const result = await sendResearchResponse(request.body?.summary);

    return response.status(202).json({
      message: "Research response received.",
      id: result?.id,
    });
  } catch (error) {
    if (error.status === 400) {
      return response.status(400).json({ message: error.message });
    }

    request.log?.error({ err: error }, "Could not send research response");
    return response.status(503).json({
      message: "Não foi possível enviar agora. Tente novamente em instantes.",
    });
  }
}
