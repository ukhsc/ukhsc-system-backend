import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { PartnerSchoolSchema } from "schema";
import { AppContext } from "index";

export class ListPartnerSchool extends OpenAPIRoute {
  schema = {
    tags: ["資源"],
    summary: "列出所有本屆次聯盟的合作學校",
    responses: {
      "200": {
        description: "回傳有關合作學校資訊的陣列",
        content: {
          "application/json": {
            schema: z.object({
              series: PartnerSchoolSchema,
            }),
            example: {
              series: [
                {
                  id: 1,
                  short_name: "仁武高中",
                  full_name: "高雄市立仁武高級中學",
                  plan: "Combined",
                },
              ],
            },
          },
        },
      },
    },
  };

  async handle(ctx: AppContext) {
    const db = ctx.var.prisma;
    const partnerSchools = await db.partnerSchool.findMany();
    return ctx.json(partnerSchools);
  }
}
