import { AuthService, OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { UserSchema } from "schema";

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
            schema: UserSchema,
          },
        },
      },
      ...OpenAPIResponseForbidden,
      ...OpenAPIResponseUnauthorized,
    },
  };

  async handle(ctx: AppContext) {
    const auth_service = new AuthService(ctx);
    const { user } = await auth_service.validate();

    return ctx.json(user, 200);
  }
}
