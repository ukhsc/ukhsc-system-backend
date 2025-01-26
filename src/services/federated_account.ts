import { FederatedProvider, User } from "@prisma/client";
import axios from "axios";
import { EnvConfig } from "utils/env";
import { BadRequestError, InternalServerError, KnownErrorCode } from "@utils/error";
import { ExtendedPrismaClient } from "@utils/prisma";
import { hash } from "node:crypto";
import { PinoLogger } from "hono-pino";

interface FederatedUserInfo {
  email: string;
  identifier: string;
}

export enum GrantFlows {
  AuthorizationCode = "authorization_code",
  Implicit = "token",
}

export class FederatedAccountService {
  constructor(
    private logger: PinoLogger,
    private env: EnvConfig,
    private provider: FederatedProvider,
  ) {}

  async getAccessToken(flow: GrantFlows, grant_value: string, redirect_uri?: string) {
    switch (flow) {
      case GrantFlows.AuthorizationCode:
        this.logger
          .assign({
            provider: this.provider,
            grant_value: hash("sha256", grant_value),
            redirect_uri,
          })
          .info("Getting access token for authorization code flow");

        if (!redirect_uri) {
          throw new BadRequestError(
            KnownErrorCode.INVALID_FEDERATED_GRANT,
            "Redirect URI is required for authorization code flow",
          );
        }

        return await this.exchangeCodeForToken(redirect_uri, grant_value);
      case GrantFlows.Implicit:
        return grant_value;
    }
  }

  async linkAccount(prisma: ExtendedPrismaClient, user: User, info: FederatedUserInfo) {
    const { email, identifier } = info;

    const existingAccount = await prisma.federatedAccount.findFirst({
      where: {
        provider: this.provider,
        OR: [{ user_id: user.id }, { provider_identifier: identifier }],
      },
    });
    if (existingAccount) {
      const details = {
        user: {
          ...user,
          primary_email: hash("sha256", user.primary_email),
        },
        federated_user_info: {
          ...info,
          email: hash("sha256", email),
        },
        existing_account: {
          ...existingAccount,
          email: hash("sha256", existingAccount.email),
        },
      };

      throw new BadRequestError(
        KnownErrorCode.FEDERATED_LINKED,
        `User ${user.id} already linked with ${this.provider} account`,
        details,
      );
    }

    await prisma.federatedAccount.create({
      data: {
        provider: this.provider,
        provider_identifier: identifier,
        email,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  private async exchangeCodeForToken(redirect_uri: string, code: string): Promise<string> {
    interface ExchangeTokenConfig {
      server_url: string;
      client_id: string;
      client_secret: string;
      redirect_uri: string;
      scope?: string;
    }

    let exchangeConfig: ExchangeTokenConfig;
    switch (this.provider) {
      case FederatedProvider.Google:
      case FederatedProvider.GoogleWorkspace: {
        exchangeConfig = {
          server_url: "https://oauth2.googleapis.com/token",
          client_id: this.env.GOOGLE_OAUTH_CLIENT_ID,
          client_secret: this.env.GOOGLE_OAUTH_CLIENT_SECRET,
          redirect_uri,
          scope: "https://www.googleapis.com/auth/userinfo.email openid",
        };
      }
    }

    const response = await axios.post(
      exchangeConfig.server_url,
      {
        client_id: exchangeConfig.client_id,
        client_secret: exchangeConfig.client_secret,
        code,
        redirect_uri: exchangeConfig.redirect_uri,
        grant_type: "authorization_code",
      },
      { validateStatus: () => true },
    );

    if (response.status !== 200) {
      const details = {
        provider: this.provider,
        federated_server_response: {
          status: response.status,
          data: response.data,
        },
      };
      throw new BadRequestError(
        KnownErrorCode.INVALID_FEDERATED_GRANT,
        "Failed to exchange code for token",
        details,
      );
    }

    return response.data.access_token;
  }

  async getUserInfo(access_token: string): Promise<FederatedUserInfo> {
    switch (this.provider) {
      case FederatedProvider.Google:
      case FederatedProvider.GoogleWorkspace: {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          validateStatus: () => true,
        });

        if (response.status !== 200) {
          const details = {
            provider: this.provider,
            federated_server_response: {
              status: response.status,
              data: response.data,
            },
          };
          throw new InternalServerError(
            KnownErrorCode.OAUTH_ERROR,
            "Failed to get federated account's user info",
            details,
          );
        }

        return {
          email: response.data.email,
          identifier: response.data.sub,
        };
      }
    }
  }
}
