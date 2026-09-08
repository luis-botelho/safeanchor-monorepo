export const authorizeRoles = (...allowedRoles) => {
  return (request, response, next) => {
    const { role } = request.user || {};

    if (!role || !allowedRoles.includes(role)) {
      return response.status(403).json({
        message: "Insufficient permissions",
      });
    }

    next();
  };
};