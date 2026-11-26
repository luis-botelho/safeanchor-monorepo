import { randomUUID } from "node:crypto";
import cors from "cors";
import express from "express";
import helmet from "helmet";
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
import { createAuthRouter } from "./routes/authRoutes.js";
import { createResearchRouter } from "./routes/researchRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import inspectionRoutes from "./routes/inspectionRoutes.js";
import directorRoutes from "./routes/directorRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";

// IDs de correlação são sempre gerados no servidor: o header do cliente
// não é confiável e não deve ser refletido em logs nem em respostas.
const genReqId = () => randomUUID();

export const createApp = ({ prisma: db = prisma, beforeAuth } = {}) => {
  const app = express();

  app.disable("x-powered-by");

  // A API não serve HTML: a CSP é configurada no frontend. Aqui mantemos
  // HSTS, nosniff, frame-ancestors e Referrer-Policy sem quebrar o CORS.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
      referrerPolicy: { policy: "no-referrer" },
      frameguard: { action: "deny" },
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  app.use((request, response, next) => {
    response.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );

    return next();
  });

  // A Vercel Termina o TLS e repassa o IP real em X-Forwarded-For.
  app.set("trust proxy", 1);
  app.locals.prisma = db;

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

  const allowedOrigins = [
    process.env.FRONTEND_ORIGIN,
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:5173", "http://127.0.0.1:5173"]
      : []),
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // Requests without Origin (health checks, curl, server-to-server) are valid.
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        const error = new Error("Origin not allowed by CORS");
        error.status = 403;

        return callback(error);
      },
    }),
  );
  app.use(express.json({ limit: "32kb" }));

  // Public routes
  app.get("/", (request, response) => {
    response.json({
      name: "SafeAnchor API",
      status: "online",
    });
  });

  app.get("/health", createHealthHandler(db));

  app.use("/auth", createAuthRouter());
  app.use("/research", createResearchRouter());

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
  app.use("/documents", documentRoutes);
  app.use("/inspections", inspectionRoutes);
  app.use("/director", directorRoutes);

  app.use((request, response) => {
    return response.status(404).json({
      message: "Not found",
      requestId: request.id,
    });
  });

  app.use((error, request, response, next) => {
    logger.error(
      { err: error, requestId: request.id },
      "Unhandled error",
    );

    const status = error.status >= 400 && error.status < 500 ? error.status : 500;

    return response.status(status).json({
      message: status === 500 ? "Internal server error" : error.message,
      requestId: request.id,
    });
  });

  return app;
};

export default createApp();
