import { AppRoute } from "../route";
import { z } from "zod";
import { PartnerSchoolSchema, SchoolAccountConfigSchema } from "schema";
import { AppContext } from "index";

export class ListPartnerSchool extends AppRoute {
  schema = {
    tags: ["合作學校"],
    summary: "列出所有本屆次聯盟的合作學校",
    responses: {
      200: {
        description: "回傳有關合作學校資訊的陣列",
        content: {
          "application/json": {
            schema: z.array(
              PartnerSchoolSchema.extend({
                google_account_config: SchoolAccountConfigSchema.optional(),
              }),
            ),
            example: [
              {
                id: 1,
                short_name: "仁武高中",
                full_name: "高雄市立仁武高級中學",
                google_account_config: {
                  username_format: "s＋學號",
                  student_username_format: "s[0-9]{7}",
                  password_format: "請洽本校資訊組",
                  domain_name: "rwm.kh.edu.tw",
                },
              },
            ],
          },
        },
      },
    },
  };

  async handle(ctx: AppContext) {
    const db = ctx.var.prisma;
    const partnerSchools = await db.partnerSchool.findMany({
      include: {
        google_account_config: true,
      },
    });
    return ctx.json(partnerSchools);
  }
}
