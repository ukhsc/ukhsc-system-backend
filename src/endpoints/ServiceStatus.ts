import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { SystemServiceStatusSchema } from "schema";
import { z } from "zod";

export class ServiceStatus extends OpenAPIRoute {
  schema = {
    summary: "系統服務狀態",
    responses: {
      200: {
        description: "成功取得服務狀態",
        content: {
          "application/json": {
            schema: z.object({ status: SystemServiceStatusSchema.describe("服務狀態") }),
            example: {
              status: "Normal",
            },
          },
        },
      },
      500: {
        description: "伺服器錯誤",
        content: {
          "application/json": {
            schema: z.object({ error: z.string() }),
            example: {
              error: "No configuration found",
            },
          },
        },
      },
    },
  };

  async handle(ctx: AppContext) {
    const configuration = await ctx.var.prisma.systemConfigurationUpdates.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    if (!configuration) {
      return ctx.json(
        {
          error: "No configuration found",
        },
        500,
      );
    }

    return ctx.json(
      {
        status: configuration.service_status,
      },
      200,
    );
  }
}
