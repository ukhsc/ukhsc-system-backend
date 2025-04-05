import { SecurityRequirementObject, z } from "schema";
import { AppRoute } from "@endpoints/route";
import { OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { AppContext } from "index";
import { findSchoolAndValidate } from ".";

export class AddEligibleStudent extends AppRoute {
  schema = {
    tags: ["合作學校"],
    summary: "擴充指定校的學生會員資格限制名單",
    security: [{ memberAuth: [] }, { staffAuth: [] }] as SecurityRequirementObject[],
    request: {
      params: z.object({
        id: z.number().describe("合作夥伴學校的 ID"),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              item: z.string().nonempty().max(30).describe("要加入資格限制名單的學號"),
            }),
          },
        },
      },
    },
    responses: {
      204: {
        description: "成功擴充資格限制名單",
      },
      ...OpenAPIResponseUnauthorized,
      ...OpenAPIResponseForbidden,
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const school = await findSchoolAndValidate(ctx, data.params.id);

    const { db } = ctx.var;
    await db.partnerSchool.update({
      where: {
        id: school.id,
      },
      data: {
        eligible_student_ids: {
          push: data.body.item,
        },
      },
    });

    return ctx.body(null, 204);
  }
}
