import { isStudentMemberTokenPayload } from "utils/auth";
import { AuthService, OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { StudentMemberSchemaPublic } from "schema";
import { z } from "zod";

export class GetMyMemberInfo extends OpenAPIRoute {
  schema = {
    tags: ["學生會員"],
    summary: "依據存取權杖取得目前會員的資訊",
    security: [{ memberAuth: [] }],
    responses: {
      201: {
        description: "成功取得會員資訊",
        content: {
          "application/json": {
            schema: StudentMemberSchemaPublic.describe("會員帳號資訊"),
            example: {
              purchase_channel: "PartnerFree",
              id: "ckv4f2g3e0000y9l5t6z8j2h3",
              school_attended_id: 1,
              primary_email: "s1234567@example.edu.tw",
              student_id: "1234567",
              nickname: "龔同學",
              created_at: "2025-01-01T00:00:00.000Z",
              activated_at: "2025-01-01T00:00:00.000Z",
              expired_at: "2025-12-31T23:59:59.999Z",
            },
          },
        },
      },
      404: {
        description: "找不到會員資訊",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
            example: {
              error: "Member not found",
            },
          },
        },
      },
      ...OpenAPIResponseForbidden,
      ...OpenAPIResponseUnauthorized,
    },
  };

  async handle(ctx: AppContext) {
    const auth_service = new AuthService(ctx.req);
    const auth_payload = auth_service.validate(ctx.env.JWT_SECRET, isStudentMemberTokenPayload);

    const db = ctx.var.prisma;
    const member = await db.studentMember.findUnique({
      where: { id: auth_payload.member_id },
      omit: {
        password_hash: true,
      },
    });

    if (!member) {
      return ctx.json(
        {
          error: "Member not found",
        },
        404,
      );
    }

    return ctx.json(member);
  }
}
