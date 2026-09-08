export const createHealthHandler = (db) => {
  return async (request, response) => {
    const timestamp = new Date().toISOString();

    try {
      await db.$queryRaw`SELECT 1`;

      return response.status(200).json({
        status: "ok",
        database: "up",
        timestamp,
        uptime: Math.round(process.uptime()),
      });
    } catch {
      return response.status(503).json({
        status: "degraded",
        database: "down",
        timestamp,
      });
    }
  };
};