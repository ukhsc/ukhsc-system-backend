import {
  AuthService,
  OpenAPIResponseForbidden,
  OpenAPIResponseUnauthorized,
  UserRole,
} from "@services/auth";
import { InternalError } from "@utils/error";
import { simpleHash } from "@utils/hash";
import { AppRoute } from "../route";
import { AppContext } from "index";
import { StudentMemberSchemaPublic, UserSchema } from "schema";

export class GetMyMemberInfo extends AppRoute {
  schema = {
    tags: ["學生會員"],
    summary: "取得目前會員的資訊",
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
              id: "ckv4f2g3e0000y9l5t6z8j2h3",
              school_attended_id: 1,
              student_id: "1234567",
              created_at: "2025-01-01T00:00:00.000Z",
              activated_at: "2025-01-01T00:00:00.000Z",
              expired_at: "2025-12-31T23:59:59.999Z",
              user: {
                primary_email: "s1234567@example.edu.tw",
                created_at: "2025-01-01T00:00:00.000Z",
                updated_at: "2025-01-01T00:00:00.000Z",
              },
              school_attended: {
                id: 1,
                short_name: "仁武高中",
                full_name: "高雄市立仁武高級中學",
              },
              settings: {
                nickname: "龔同學",
                e_invoice_barcode: "/E7E6888",
              },
            },
          },
        },
      },
      ...OpenAPIResponseForbidden,
      ...OpenAPIResponseUnauthorized,
    },
  };

  async handle(ctx: AppContext) {
    const auth_payload = await AuthService.validate({
      permission_checker: [UserRole.StudentMember],
    });

    const { db, logger } = ctx.var;
    const member = await db.studentMember.findUnique({
      where: {
        user_id: auth_payload.user.id,
      },
      omit: {
        password_hash: true,
      },
      include: {
        school_attended: true,
        settings: true,
      },
    });

    if (!member) {
      logger
        .assign({
          auth_payload: {
            ...auth_payload,
            user: {
              ...auth_payload.user,
              primary_email: simpleHash(auth_payload.user.primary_email),
            },
          },
        })
        .error("Member not found but the validation passed.");
      throw new InternalError("The member does not exist.");
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
