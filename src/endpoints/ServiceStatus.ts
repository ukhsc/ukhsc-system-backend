import { AppContext } from "index";
import { InternalErrorResponseSchema, SystemServiceStatusSchema } from "schema";
import { z } from "zod";
import console from "console";
import { AppRoute } from "./route";

export class ServiceStatus extends AppRoute {
  schema = {
    tags: ["基礎設施"],
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
            schema: InternalErrorResponseSchema,
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
      select: {
        service_status: true,
      },
    });

    if (!configuration) {
      console.error("No system configuration found");
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
