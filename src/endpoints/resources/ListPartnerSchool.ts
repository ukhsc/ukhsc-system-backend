import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { PartnerSchoolSchema } from "schema";
import { AppContext } from "index";

export class ListPartnerSchool extends OpenAPIRoute {
  schema = {
    tags: ["Resources"],
    summary: "List Partner Schools",
    responses: {
      "200": {
        description: "Returns a list of partner schools",
        content: {
          "application/json": {
            schema: z.object({
              series: PartnerSchoolSchema,
            }),
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
