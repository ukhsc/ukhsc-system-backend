import {
  AuthService,
  OpenAPIResponseForbidden,
  OpenAPIResponseUnauthorized,
  UserRole,
} from "@services/auth";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { ErrorResponseSchema, StudentMemberSchemaPublic, UserSchema } from "schema";

export class GetMyMemberInfo extends OpenAPIRoute {
  schema = {
    tags: ["學生會員"],
    summary: "依據 Access Token 取得目前會員的資訊",
    security: [{ memberAuth: [] }],
    responses: {
      200: {
        description: "成功取得會員資訊",
        content: {
          "application/json": {
            schema: StudentMemberSchemaPublic.describe("會員帳號資訊").extend({
              user: UserSchema.describe("使用者共通性資訊"),
            }),
            example: {
              purchase_channel: "PartnerFree",
              id: "ckv4f2g3e0000y9l5t6z8j2h3",
              school_attended_id: 1,
              student_id: "1234567",
              nickname: "龔同學",
              created_at: "2025-01-01T00:00:00.000Z",
              activated_at: "2025-01-01T00:00:00.000Z",
              expired_at: "2025-12-31T23:59:59.999Z",
              user: {
                primary_email: "s1234567@example.edu.tw",
                created_at: "2025-01-01T00:00:00.000Z",
                updated_at: "2025-01-01T00:00:00.000Z",
              },
            },
          },
        },
      },
      404: {
        description: "找不到會員資訊",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
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
    const auth_service = new AuthService(ctx);
    const auth_payload = await auth_service.validate({
      roles: [UserRole.StudentMember],
    });

    const db = ctx.var.prisma;
    const member = await db.studentMember.findUnique({
      where: {
        user_id: auth_payload.user.id,
      },
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

    return ctx.json(
      {
        ...member,
        user: auth_payload.user,
      },
      200,
    );
  }
}
