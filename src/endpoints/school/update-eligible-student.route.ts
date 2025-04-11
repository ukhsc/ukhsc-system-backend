import { AppRoute } from "@endpoints/route";
import { OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { SecurityRequirementObject, z } from "schema";
import { AppContext } from "index";
import { findSchoolAndValidate } from ".";

export class UpdateEligibleStudents extends AppRoute {
  schema = {
    tags: ["合作學校"],
    summary: "更換指定校的學生會員資格限制名單",
    security: [{ memberAuth: [] }, { staffAuth: [] }] as SecurityRequirementObject[],
    request: {
      params: z.object({
        id: z.number().describe("合作夥伴學校的 ID"),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              items: z
                .array(z.string().nonempty().max(30))
                .max(5000)
                .describe("要替換的會員資格限制之學號名單"),
            }),
          },
        },
      },
    },
    responses: {
      204: {
        description: "成功更新資格限制名單",
      },
      ...OpenAPIResponseForbidden,
      ...OpenAPIResponseUnauthorized,
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
        eligible_student_ids: data.body.items,
      },
    });

    return ctx.body(null, 204);
  }
}
