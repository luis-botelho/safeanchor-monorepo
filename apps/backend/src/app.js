import { randomUUID } from "node:crypto";
import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";

import logger from "./lib/logger.js";
import prisma from "./lib/prisma.js";
import { createHealthHandler } from "./controllers/healthController.js";
import { modulesRouter } from "./routes/modulesRoutes.js";
import vesselRoutes from "./routes/vesselRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import preventiveMaintenanceRoutes from "./routes/preventiveMaintenanceRoutes.js";
import checklistTemplateRoutes from "./routes/checklistTemplateRoutes.js";
import checklistExecutionRoutes from "./routes/checklistExecutionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";

const genReqId = (request) => request.headers["x-request-id"] || randomUUID();

export const createApp = ({ prisma: db = prisma, beforeAuth } = {}) => {
  const app = express();

  app.use(
    pinoHttp({
      logger,
      genReqId,
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "res.headers['set-cookie']",
          "req.body.password",
          "req.body.passwordHash",
        ],
        remove: true,
      },
    }),
  );

  app.use(cors());
  app.use(express.json());

  // Public routes
  app.get("/", (request, response) => {
    response.json({
      name: "SafeAnchor API",
      status: "online",
    });
  });

  app.get("/health", createHealthHandler(db));

  app.use("/auth", authRoutes);

  if (beforeAuth) {
    beforeAuth(app);
  }

  // Everything below this line requires authentication
  app.use(requireAuth);

  app.use("/modules", modulesRouter);
  app.use("/vessels", vesselRoutes);
  app.use("/maintenances", maintenanceRoutes);
  app.use("/preventive-maintenances", preventiveMaintenanceRoutes);
  app.use("/checklist-templates", checklistTemplateRoutes);
  app.use("/checklist-executions", checklistExecutionRoutes);

  app.use((error, request, response, next) => {
    logger.error(
      { err: error, requestId: request.id },
      "Unhandled error",
    );

    return response.status(500).json({
      message: "Internal server error",
      requestId: request.id,
    });
  });

  return app;
};