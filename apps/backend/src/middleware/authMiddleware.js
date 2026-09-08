import jwt from "jsonwebtoken";

export const requireAuth = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Authentication required",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return response.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    request.user = payload;

    next();
  } catch {
    return response.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
