import { sendResearchResponse } from "../services/researchService.js";
import logger from "../lib/logger.js";

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

    if (error.code === "RESEND_REJECTED") {
      logger.error(
        { requestId: request.id, resendError: error.providerError },
        "Could not send research response",
      );
    } else {
      request.log?.error({ err: error }, "Could not send research response");
    }

    if (error.code === "EMAIL_CONFIG_MISSING") {
      return response.status(503).json({
        code: error.code,
        message: `Configure no ambiente Production: ${error.missingVariables.join(", ")}.`,
      });
    }

    if (error.code === "RESEND_REJECTED") {
      return response.status(503).json({
        code: error.code,
        message:
          "O Resend rejeitou o envio. Confira a validade da chave, o remetente verificado e o endereço destinatário.",
      });
    }

    return response.status(503).json({
      code: "RESEARCH_SEND_FAILED",
      message: "Não foi possível enviar agora. Tente novamente em instantes.",
    });
  }
}
