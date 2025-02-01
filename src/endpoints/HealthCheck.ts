import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { z } from "zod";

export class HealthCheck extends OpenAPIRoute {
  schema = {
    tags: ["基礎設施"],
    summary: "Health Check (Internal)",
    responses: {
      "200": {
        description: "Returns a health check response",
        content: {
          "application/json": {
            schema: z.object({
              status: z.string(),
              environment: z.string(),
              timestamp: z.string().datetime(),
            }),
          },
        },
      },
    },
  };

  async handle(ctx: AppContext) {
    const { prisma: db, logger } = ctx.var;
    logger.info("Health check");
    let status = "ok";
    let statusCode: 200 | 500 = 200;
    try {
      // Try a simple query to check DB connectivity
      await db.$queryRaw`SELECT 1`;
    } catch (err) {
      logger.error({ err, query: "SELECT 1", service: "database" }, "Database health check failed");
      status = "error";
      statusCode = 500;
    }

    return ctx.json(
      {
        status,
        environment: ctx.env.CURRENT_ENVIRONMENT || "unknown",
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
