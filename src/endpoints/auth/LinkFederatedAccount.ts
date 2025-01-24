import { ErrorResponseSchema, FederatedProviderSchema, FederateOAuthSchema, z } from "schema";
import { AppContext } from "index";
import { OpenAPIRoute } from "chanfana";
import { AuthService, OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { FederatedAccountService } from "@services/federated_account";
import { FederatedProvider } from "@prisma/client";

export class LinkFederatedAccount extends OpenAPIRoute {
  schema = {
    tags: ["身份驗證"],
    summary: "綁定社群帳號",
    description: "將社群帳號與現有的使用者帳號進行綁定。",
    security: [{ userAuth: [] }],
    request: {
      params: z.object({
        provider: FederatedProviderSchema.exclude(["GoogleWorkspace"])
          .describe("社群帳號提供者（目前僅支援 Google）")
          .openapi({
            example: FederatedProvider.Google,
          }),
      }),
      body: {
        content: {
          "application/json": {
            schema: FederateOAuthSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "成功綁定社群帳號",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
      400: {
        description: "提供的授權資訊無效",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      ...OpenAPIResponseUnauthorized,
      ...OpenAPIResponseForbidden,
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const db = ctx.var.prisma;

    const auth_service = new AuthService(ctx);
    const auth_payload = await auth_service.validate();

    const { flow, redirect_uri, grant_value } = data.body;
    const federated_service = new FederatedAccountService(ctx.env, data.params.provider);
    const token = await federated_service.getAccessToken(flow, grant_value, redirect_uri);
    const info = await federated_service.getUserInfo(token);
    await federated_service.linkAccount(db, auth_payload.user, info);

    return ctx.json({
      message: "Successfully linked the federated account",
    });
  }
}
