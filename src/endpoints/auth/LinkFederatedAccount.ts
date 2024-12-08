import {
  ContextWithPayload,
  isOrdererTokenPayload,
  OpenAPIResponseForbidden,
  OpenAPIResponseUnauthorized,
  OrdererTokenPayload,
  requireAuth,
  TokenRole,
} from "@config/auth";
import { FederatedProvider } from "@prisma/client";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import { z } from "zod";
import console from "console";
import { FederatedProviderSchema } from "schema";
import env from "@config/env";
import axios from "axios";
import { TypedResponse } from "hono";

enum GrantFlows {
  AuthorizationCode = "authorization_code",
  Implicit = "token",
}

interface FederatedUserInfo {
  email: string;
  identifier: string;
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
            examples: {
              CodeFlow: {
                summary: "授權碼模式 (Authorization Code Flow)",
                value: {
                  flow: GrantFlows.AuthorizationCode,
                  grant_value: "4/0AY0e-g7jKJlKJH0A1B2C3D4E5F6G7H8I9J0K1L2M3N",
                  redirect_uri: "https://example.com/auth/callback",
                },
              },
              ImplicitFlow: {
                summary: "隱含授權模式 (Implicit Flow)",
                value: {
                  flow: GrantFlows.Implicit,
                  grant_value:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmRlcl9pZCI6MX0.ITogrM9A6N2QSvu2lbuxJjBrqa6btiNHzMAXG9HS0DM",
                },
              },
            },
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
            example: {
              message: "Successfully linked the federated account",
            },
          },
        },
      },
      400: {
        description: "請求格式錯誤",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
            examples: {
              MissingRedirectURI: {
                value: {
                  error: "Redirect URI is required for authorization code flow",
                },
              },
              AccountAlreadyLinked: {
                value: {
                  error: "Account already linked: Google",
                },
              },
            },
          },
        },
      },
      ...OpenAPIResponseUnauthorized,
      ...OpenAPIResponseForbidden,
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    try {
      requireAuth(ctx);
    } catch (res) {
      return res;
    }

    const provider = data.params.provider;
    const { flow: grant_flow, redirect_uri, grant_value } = data.body;
    let access_token: string;

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

        access_token = await this.exchangeCodeForToken(provider, redirect_uri, grant_value);
        break;
      case GrantFlows.Implicit:
        access_token = grant_value;
        break;
    }

    const info = await this.getUserInfo(provider, access_token);
    const role = ctx.var.auth_payload.role;

    try {
      switch (role) {
        case TokenRole.Orderer:
          requireAuth(ctx, isOrdererTokenPayload);
          await this.linkOrdererAccount(ctx, provider, info);
          break;
      }
    } catch (err) {
      if (isHonoResponse(err)) {
        // Return the error http response.
        return err;
      }

      console.error(err);
      return ctx.json(
        {
          error: "Internal server error",
        },
        500,
      );
    }

    return ctx.json({
      message: "Successfully linked the federated account",
    });
  }

  async exchangeCodeForToken(
    provider: FederatedProvider,
    redirect_uri: string,
    code: string,
  ): Promise<string> {
    interface ExchangeTokenConfig {
      server_url: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
      scope?: string;
    }

    let echange_config: ExchangeTokenConfig;
    switch (provider) {
      case FederatedProvider.Google: {
        echange_config = {
          server_url: "https://oauth2.googleapis.com/token",
          client_id: env.GOOGLE_OAUTH_CLIENT_ID,
          client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
          redirect_uri,
          scope: "https://www.googleapis.com/auth/userinfo.email openid",
        };
      }
    }

    const response = await axios.post(
      echange_config.server_url,
      {
        client_id: echange_config.client_id,
        client_secret: echange_config.client_secret,
        code,
        redirect_uri: echange_config.redirect_uri,
        grant_type: "authorization_code",
      },
      { validateStatus: () => true },
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to exchange code for token: ${response.status} ${JSON.stringify(response.data)}`,
      );
    }

    return response.data.access_token;
  }

  async getUserInfo(provider: FederatedProvider, access_token: string): Promise<FederatedUserInfo> {
    switch (provider) {
      case FederatedProvider.Google: {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          validateStatus: () => true,
        });

        if (response.status !== 200) {
          throw new Error(
            `Failed to get federated account's user info: ${response.status} ${JSON.stringify(response.data)}`,
          );
        }

        return {
          email: response.data.email,
          identifier: response.data.sub,
        };
      }
    }
  }

  async linkOrdererAccount(
    ctx: ContextWithPayload<OrdererTokenPayload>,
    provider: FederatedProvider,
    info: FederatedUserInfo,
  ) {
    const db = ctx.var.prisma;
    const { order_id } = ctx.var.auth_payload;
    const { email, identifier } = info;

    const order = await db.personalMembershipOrder.findUnique({
      where: { id: order_id },
      include: {
        member: { include: { federated_accounts: true } },
      },
    });
    const member = order?.member;
    if (!order || !member) {
      throw new Error(`Order not found or member not found: ${order_id}`);
    }

    const existing_account = member.federated_accounts.find(
      (account) => account.provider === provider,
    );
    if (existing_account) {
      throw ctx.json(
        {
          error: `Account already linked: ${provider}`,
        },
        400,
      );
    }

    if (!member.primary_email) {
      await db.studentMember.update({
        where: { id: member.id },
        data: {
          primary_email: email,
        },
      });
    }

    await db.federatedAccount.create({
      data: {
        provider,
        provider_identifier: identifier,
        email,
        member: {
          connect: {
            id: member.id,
          },
        },
      },
    });
  }
}

function isHonoResponse(res: unknown) {
  return res !== null && typeof res === "object" && "status" in res && "headers" in res;
}
