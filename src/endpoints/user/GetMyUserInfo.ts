import {
  AuthService,
  OpenAPIResponseForbidden,
  OpenAPIResponseUnauthorized,
  UserRole,
} from "@services/auth";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { UserSchema, z } from "schema";

export class GetMyUserInfo extends OpenAPIRoute {
  schema = {
    tags: ["使用者"],
    summary: "依據 Access Token 取得目前使用者的資訊",
    security: [{ userAuth: [] }],
    responses: {
      200: {
        description: "成功取得使用者資訊",
        content: {
          "application/json": {
            schema: UserSchema.extend({
              roles: z.array(z.nativeEnum(UserRole)),
            }),
          },
        },
      },
      ...OpenAPIResponseForbidden,
      ...OpenAPIResponseUnauthorized,
    },
  };

  async handle(ctx: AppContext) {
    const { user, roles } = await AuthService.validate();

    return ctx.json(
      {
        ...user,
        roles,
      },
      200,
    );
  }
}
