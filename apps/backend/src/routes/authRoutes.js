import express from "express";
import {
  register,
  login,
  me,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createAuthLimiters } from "../middleware/rateLimits.js";

export function createAuthRouter(limiters = createAuthLimiters()) {
  const router = express.Router();

  router.post("/register", limiters.registerByIp, limiters.registerByEmail, register);
  router.post("/login", limiters.loginByIp, limiters.loginByEmail, login);
  router.get("/me", requireAuth, me);

  return router;
}

// Compatibilidade com testes que montam o router diretamente.
export default createAuthRouter();
