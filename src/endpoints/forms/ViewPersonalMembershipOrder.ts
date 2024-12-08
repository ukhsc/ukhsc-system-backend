import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { PersonalMembershipOrderSchema } from "schema";
import { z } from "zod";
import {
  isOrdererTokenPayload,
  OpenAPIResponseForbidden,
  OpenAPIResponseUnauthorized,
  requireAuth,
} from "@config/auth";

export class ViewPersonalMembershipOrder extends OpenAPIRoute {
  schema = {
    tags: ["表單"],
    summary: "查看個人會員訂單",
    security: [{ ordererAuth: [] }],
    responses: {
      200: {
        description: "成功取得個人會員訂單資料",
        content: {
          "application/json": {
            schema: PersonalMembershipOrderSchema,
          },
        },
      },
      404: {
        description: "找不到指定的訂單",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
            example: {
              error: "Order not found",
            },
          },
        },
      },
      ...OpenAPIResponseUnauthorized,
      ...OpenAPIResponseForbidden,
    },
  };

  async handle(ctx: AppContext) {
    try {
      requireAuth(ctx, isOrdererTokenPayload);
    } catch (res) {
      return res;
    }

    const db = ctx.var.prisma;
    const payload = ctx.var.auth_payload;
    const order = await db.personalMembershipOrder.findUnique({
      where: { id: payload.order_id },
      include: { school: true },
    });
    if (!order) {
      return ctx.json(
        {
          error: "Order not found",
        },
        404,
      );
    }

    return ctx.json(order);
  }
}
