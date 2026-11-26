import express from "express";
import { submitResearch } from "../controllers/researchController.js";
import { createResearchLimiters } from "../middleware/rateLimits.js";

export function createResearchRouter(limiters = createResearchLimiters()) {
  const router = express.Router();

  router.post("/", limiters.submitByIp, submitResearch);

  return router;
}

export default createResearchRouter();
