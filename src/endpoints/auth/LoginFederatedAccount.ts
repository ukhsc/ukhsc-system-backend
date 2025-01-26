import { FederatedProvider } from "@prisma/client";
import { AuthService, UserRole } from "@services/auth";
import { DeviceManagementService } from "@services/device_management";
import { FederatedAccountService } from "@services/federated_account";
import { ExtendedPrismaClient } from "@utils/prisma";
import { OpenAPIRoute } from "chanfana";
import { AppContext } from "index";
import {
  ErrorResponseSchema,
  FederatedProviderSchema,
  FederateOAuthSchema,
  TokenResponseSchema,
} from "schema";
import { z } from "zod";

export class LoginFederatedAccount extends OpenAPIRoute {
  schema = {
    tags: ["身份驗證"],
    summary: "使用社群帳號登入",
    description: "使用社群帳號的授權資訊取得現有已綁定該社群帳號的使用者存取權杖。",
    request: {
      params: z.object({
        provider: FederatedProviderSchema.describe("社群帳號提供者").openapi({
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
        description: "成功透過社群帳號登入並取得存取權杖",
        content: {
          "application/json": {
            schema: TokenResponseSchema,
          },
        },
      },
      400: {
        description: "無效的授權資訊",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "該社群帳號未綁定任何使用者",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
            example: { error: "The account is not linked to any user." },
          },
        },
      },
    },
  };

  async handle(ctx: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { prisma: db, logger } = ctx.var;

    const { flow, redirect_uri, grant_value } = data.body;
    const federated_service = new FederatedAccountService(logger, ctx.env, data.params.provider);
    const federated_token = await federated_service.getAccessToken(flow, grant_value, redirect_uri);
    const info = await federated_service.getUserInfo(federated_token);

    const account = await db.federatedAccount.findFirst({
      where: {
        provider: data.params.provider,
        provider_identifier: info.identifier,
      },
      include: {
        user: true,
      },
    });
    if (!account) {
      return ctx.json({ error: "The account is not linked to any user." }, 401);
    }
    if (account.email !== info.email) {
      await db.federatedAccount.update({
        where: { id: account.id },
        data: { email: info.email },
      });
    }

    const user = account.user;
    const device_service = new DeviceManagementService(ctx);
    const device = await device_service.registerDevice(user.id);

    const token = AuthService.generateToken(
      {
        roles: await this.getUserRoles(db, user.id),
        user_id: user.id,
        device_id: device.id,
      },
      ctx.env.JWT_SECRET,
    );

    return ctx.json({ token }, 200);
  }

  private async getUserRoles(db: ExtendedPrismaClient, user_id: number): Promise<UserRole[]> {
    const roles = [];

    const user = await db.user.findUnique({
      where: { id: user_id },
      include: { member: true },
    });
    if (!user) throw new Error("User not found when getting roles.");

    if (user.member) {
      roles.push(UserRole.StudentMember);
    }
    // TODO: Add more roles here

    return roles;
  }
}
