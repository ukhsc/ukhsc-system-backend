import { isOrdererTokenPayload } from "@utils/auth";
import { AuthService } from "@services/auth";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { z } from "zod";

export class UpdatePersonalMembershipOrder extends OpenAPIRoute {
  schema = {
    tags: ["表單"],
    summary: "更新個人會員訂單",
    security: [{ ordererAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              class: z.string(),
              number: z.string(),
              real_name: z.string(),
              need_sticker: z.boolean(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "成功更新訂單",
      },
    },
  };
  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const db = ctx.var.prisma;

    const auth_payload = new AuthService(ctx.req).validate(
      ctx.env.JWT_SECRET,
      isOrdererTokenPayload,
    );

    const order = await db.personalMembershipOrder.findUnique({
      where: { id: auth_payload.order_id },
    });
    if (!order) {
      return ctx.json({ error: "Order not found" }, 404);
    }

    const { class: className, number, real_name, need_sticker } = data.body;

    await db.personalMembershipOrder.update({
      where: { id: auth_payload.order_id },
      data: {
        class: className,
        number,
        real_name,
        need_sticker,
      },
    });

    return ctx.json({ message: "Order updated" });
  }
}
