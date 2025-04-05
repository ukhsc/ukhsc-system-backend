import { AppRoute } from "@endpoints/route";
import { OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { SecurityRequirementObject, z } from "schema";
import { AppContext } from "index";
import { findSchoolAndValidate } from ".";

export class GetEligibleStudentsStatistics extends AppRoute {
  schema = {
    tags: ["合作學校"],
    summary: "取得指定校的學生會員資格相關資訊",
    security: [{ memberAuth: [] }, { staffAuth: [] }] as SecurityRequirementObject[],
    request: {
      params: z.object({
        id: z.number().describe("合作夥伴學校的 ID"),
      }),
    },
    responses: {
      200: {
        description: "成功取得會員資格相關資訊",
        content: {
          "application/json": {
            schema: z.object({
              enable_eligibility_check: z.boolean().describe("是否啟用資格檢查"),
              total_num: z.number().optional().describe("會員資格名單的總人數"),
              activated_num: z.number().optional().describe("實際已啟用會員資格的人數"),
            }),
            example: {
              enable_eligibility_check: true,
              total_num: 100,
              activated_num: 80,
            },
          },
        },
      },
      ...OpenAPIResponseForbidden,
      ...OpenAPIResponseUnauthorized,
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const school = await findSchoolAndValidate(ctx, data.params.id, {
      enable_eligibility_check: true,
      eligible_student_ids: true,
    });

    const { db } = ctx.var;
    const activated_count = await db.studentMember.count({
      where: {
        school_attended_id: school.id,
        id: {
          in: school.eligible_student_ids,
        },
      },
    });

    return ctx.json({
      enable_eligibility_check: school.enable_eligibility_check,
      total_num: school.eligible_student_ids.length,
      activated_num: activated_count,
    });
  }
}
