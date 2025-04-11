import { AppRoute } from "@endpoints/route";
import { OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { SecurityRequirementObject, z } from "schema";
import { AppContext } from "index";
import { findSchoolAndValidate } from ".";

export class PatchEligibleStudentConfig extends AppRoute {
  schema = {
    tags: ["合作學校"],
    summary: "更新指定校的學生會員資格限制名單設定",
    security: [{ memberAuth: [] }, { staffAuth: [] }] as SecurityRequirementObject[],
    request: {
      params: z.object({
        id: z.number().describe("合作夥伴學校的 ID"),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              enable_eligibility_check: z.boolean().describe("是否啟用學生會員資格限制"),
            }),
          },
        },
      },
    },
    responses: {
      204: {
        description: "成功更新學生會員資格限制名單設定",
      },
      ...OpenAPIResponseForbidden,
      ...OpenAPIResponseUnauthorized,
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { db } = ctx.var;

    const school = await findSchoolAndValidate(ctx, data.params.id);

    await db.partnerSchool.update({
      where: {
        id: school.id,
      },
      data: {
        enable_eligibility_check: data.body.enable_eligibility_check,
      },
    });

    return ctx.body(null, 204);
  }
}
