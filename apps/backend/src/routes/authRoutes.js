import express from "express";
import {
  register,
  login,
  logout,
  me,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createAuthLimiters } from "../middleware/rateLimits.js";

export function createAuthRouter(limiters = createAuthLimiters()) {
  const router = express.Router();

  router.post("/register", limiters.registerByIp, limiters.registerByEmail, register);
  router.post("/login", limiters.loginByIp, limiters.loginByEmail, login);
  router.post("/logout", requireAuth, logout);
  router.get("/me", requireAuth, me);

  return router;
}

// Compatibilidade com testes que montam o router diretamente.
export default createAuthRouter();
