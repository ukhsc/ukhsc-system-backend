import { FederatedProviderSchema } from "schema";
import { AppContext } from "index";
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
// TODO: fix the workaround for zod-to-openapi
// See Also: https://github.com/cloudflare/chanfana/issues/167
extendZodWithOpenApi(z);
import { AuthService, OpenAPIResponseForbidden, OpenAPIResponseUnauthorized } from "@services/auth";
import { FederatedAccountService } from "@services/federated_account";
import { isOrdererTokenPayload, OrdererTokenPayload } from "@config/auth";
import { FederatedProvider } from "@prisma/client";

enum GrantFlows {
  AuthorizationCode = "authorization_code",
  Implicit = "token",
}

export class LinkFederatedAccount extends OpenAPIRoute {
  schema = {
    tags: ["身份驗證"],
    summary: "綁定社群帳號",
    description: "將社群帳號與現有的用於身份驗證的帳號進行綁定。",
    security: [{ ordererAuth: [] }],
    request: {
      params: z.object({
        provider: FederatedProviderSchema.describe("社群帳號提供者（目前僅支援 Google）").openapi({
          example: FederatedProvider.Google,
        }),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              flow: z.nativeEnum(GrantFlows).describe("授權流程"),
              grant_value: z.string().describe("社群帳號提供者的授權資訊（取決於授權流程）"),
              redirect_uri: z
                .string()
                .optional()
                .describe(
                  "授權完成後的重新導向網址（必須與前端取得授權碼的網址相同）\n\n若授權認證流程（`flow`）為 `token`，則此欄位不需要",
                ),
            }),
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
      ...OpenAPIResponseUnauthorized,
      ...OpenAPIResponseForbidden,
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const federated_service = new FederatedAccountService(ctx.var.prisma, ctx.env);

    // Validate authentication
    const auth_service = new AuthService(ctx);
    let auth_payload: OrdererTokenPayload;
    try {
      auth_payload = auth_service.validate(isOrdererTokenPayload);
    } catch (res) {
      return res;
    }

    const provider = data.params.provider;
    const { flow: grant_flow, redirect_uri, grant_value } = data.body;

    let access_token: string;

    // Get access token
    switch (grant_flow) {
      case GrantFlows.AuthorizationCode:
        if (!redirect_uri) {
          return ctx.json(
            {
              error: "Redirect URI is required for authorization code flow",
            },
            400,
          );
        }
        access_token = await federated_service.exchangeCodeForToken(
          provider,
          redirect_uri,
          grant_value,
        );
        break;
      case GrantFlows.Implicit:
        access_token = grant_value;
        break;
    }

    // Get user info and link account
    try {
      const info = await federated_service.getUserInfo(provider, access_token);
      await federated_service.linkOrdererAccount(auth_payload.order_id, provider, info);
    } catch (err) {
      if (err instanceof Error) {
        return ctx.json({ error: err.message }, 400);
      }
      throw err;
    }

    return ctx.json({
      message: "Successfully linked the federated account",
    });
  }
}
