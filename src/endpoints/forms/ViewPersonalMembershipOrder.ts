import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { PersonalMembershipOrderSchema } from "schema";
import { z } from "zod";
import { getBearerToken, OrdererTokenPayload, verifyToken } from "@config/jwt";

export class ViewPersonalMembershipOrder extends OpenAPIRoute {
  schema = {
    tags: ["表單"],
    summary: "查看個人會員訂單",
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
          },
        },
      },
    },
    security: [{ ordererAuth: [] }],
  };

  async handle(ctx: AppContext) {
    const db = ctx.var.prisma;

    const token = getBearerToken(ctx.req);
    if (!token) {
      return ctx.json(
        {
          error: "Unauthorized",
        },
        401,
      );
    }

    const payload = verifyToken<OrdererTokenPayload>(token);
    if (!payload) {
      return ctx.json(
        {
          error: "Unauthorized",
        },
        401,
      );
    }

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
