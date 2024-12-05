import { Prisma } from "@prisma/client";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { z } from "zod";

export class OroderPersonalMembership extends OpenAPIRoute {
  schema = {
    tags: ["表單"],
    summary: "訂購個人會員",
    description: "這裡僅是下單的流程，之後要由學生會負責代收代付，才能取得真正的會員資格。",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              school_id: z.number(),
              class: z.string(),
              number: z.string(),
              real_name: z.string(),
              need_sticker: z.boolean(),
            }),
            example: {
              school_id: 2,
              class: "高二仁",
              number: "03",
              real_name: "龔曉明",
              need_sticker: true,
            },
          },
        },
      },
    },
    responses: {
      // TODO: 更完整的錯誤處理
      200: {
        description: "成功下單，並回傳訂單編號（此時尚未綁定用於身份驗證之帳號）",
        content: {
          "text/plain": {
            schema: z.string(),
            example: "cm4bgs9gf000408mjg8ah3xtf",
          },
        },
      },
      400: {
        description: "合作夥伴學校的 ID 錯誤或不存在",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
            example: {
              error: "Invalid partner school ID",
            },
          },
        },
      },
    },
  };
  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const db = ctx.var.prisma;

    try {
      const order = await db.personalMembershipOrder.create({
        data: {
          school: {
            connect: {
              id: data.body.school_id,
            },
          },
          class: data.body.class,
          number: data.body.number,
          real_name: data.body.real_name,
          need_sticker: data.body.need_sticker,
          is_paid: false,
        },
      });

      return ctx.text(order.id.toString());
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          return ctx.json(
            {
              error: "Invalid partner school ID",
            },
            400,
          );
        }
      }
      throw e;
    }
  }
}
