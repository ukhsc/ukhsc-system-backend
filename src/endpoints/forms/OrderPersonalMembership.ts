import { OrdererTokenPayload, TokenRole } from "@utils/auth";
import { MembershipPurchaseChannel, Prisma } from "@prisma/client";
import { AuthService } from "@services/auth";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { z } from "zod";

export class OrderPersonalMembership extends OpenAPIRoute {
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
        description:
          "成功下單，並回傳用於查詢／編輯訂單的 Token（此時尚未綁定用於身份驗證之社群帳號）",
        content: {
          "text/plain": {
            schema: z.string().describe("訂購人的 Token"),
            example:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmRlcl9pZCI6MX0.ITogrM9A6N2QSvu2lbuxJjBrqa6btiNHzMAXG9HS0DM",
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
          member: {
            create: {
              school_attended: {
                connect: {
                  id: data.body.school_id,
                },
              },
              purchase_channel: MembershipPurchaseChannel.Personal,
            },
          },
          class: data.body.class,
          number: data.body.number,
          real_name: data.body.real_name,
          need_sticker: data.body.need_sticker,
          is_paid: false,
        },
      });

      const token = AuthService.generateToken<OrdererTokenPayload>(
        {
          role: TokenRole.Orderer,
          order_id: order.id,
        },
        ctx.env.JWT_SECRET,
      );
      return ctx.text(token);
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
