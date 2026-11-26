import jwt from "jsonwebtoken";

import { getJwtSecret, JWT_VERIFY_OPTIONS } from "../lib/jwtConfig.js";
import { isTokenRevoked } from "../services/tokenRevocation.js";

function unauthorized(response, message) {
  return response.status(401).json({ message });
}

export const requireAuth = async (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return unauthorized(response, "Authentication required");
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return unauthorized(response, "Invalid authorization header");
  }

  try {
    const payload = jwt.verify(token, getJwtSecret(), JWT_VERIFY_OPTIONS);

    if (!payload.userId || !payload.partyId || !payload.jti) {
      return unauthorized(response, "Invalid or expired token");
    }

    if (isTokenRevoked(payload.jti)) {
      return unauthorized(response, "Token revoked");
    }

    // O papel no banco é a fonte autoritativa: uma promoção ou rebaixamento
    // passa a valer antes mesmo de o token atual expirar.
    const db = request.app?.locals?.prisma;

    if (db?.user?.findUnique) {
      const user = await db.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, partyId: true, role: true, persona: true },
      });

      if (!user || user.partyId !== payload.partyId) {
        return unauthorized(response, "Invalid or expired token");
      }

      request.user = { ...payload, role: user.role, persona: user.persona };
    } else {
      request.user = payload;
    }

    return next();
  } catch {
    return unauthorized(response, "Invalid or expired token");
  }
};
