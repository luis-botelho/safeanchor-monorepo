import app from "./app.js";
import logger from "./lib/logger.js";
import { applyBootstrapMigrations } from "./services/bootstrapService.js";

try {
  const result = await applyBootstrapMigrations();
  if (result.applied) {
    logger.info("Bootstrap da diretoria concluído.");
  }
} catch (error) {
  logger.error({ err: error }, "Falha no bootstrap da diretoria.");
}

const port = Number(process.env.PORT) || 3001;

if (process.env.VERCEL) {
  // Vercel imports the Express app as a serverless function handler.
} else {
  app.listen(port, () => {
    logger.info(`SafeAnchor API rodando em http://localhost:${port}`);
  });
}

export default app;
