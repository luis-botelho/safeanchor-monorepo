import express from "express";
import {
  researchNonce,
  submitResearch,
} from "../controllers/researchController.js";
import { createResearchLimiters } from "../middleware/rateLimits.js";

export function createResearchRouter(limiters = createResearchLimiters()) {
  const router = express.Router();

  router.get("/nonce", limiters.nonceByIp, researchNonce);
  router.post("/", limiters.submitByIp, submitResearch);

  return router;
}

export default createResearchRouter();
