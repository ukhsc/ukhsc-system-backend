import { FederatedProvider, User } from "@prisma/client";
import axios from "axios";
import { BadRequestError, InternalError, KnownErrorCode } from "@utils/error";
import { getCtx } from "index";
import { simpleHash } from "@utils/hash";

interface FederatedUserInfo {
  email: string;
  identifier: string;
}

export enum GrantFlows {
  AuthorizationCode = "authorization_code",
  Implicit = "token",
}

export class FederatedAccountService {
  constructor(private provider: FederatedProvider) {}

  async getAccessToken(flow: GrantFlows, grant_value: string, redirect_uri?: string) {
    const { logger } = getCtx().var;
    switch (flow) {
      case GrantFlows.AuthorizationCode:
        logger
          .assign({
            provider: this.provider,
            grant_value: simpleHash(grant_value),
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

  async isLinked(user: User, info: FederatedUserInfo): Promise<boolean> {
    const { db } = getCtx().var;
    const existingAccount = await db.federatedAccount.findFirst({
      where: {
        AND: { provider: this.provider },
        OR: [{ user_id: user.id }, { provider_identifier: info.identifier }],
      },
    });

    return existingAccount !== null;
  }

  async linkAccount(user: User, info: FederatedUserInfo) {
    const { db } = getCtx().var;
    const { email, identifier } = info;

    await db.federatedAccount.upsert({
      where: {
        unique_provider_user: {
          provider: this.provider,
          user_id: user.id,
        },
      },
      update: {
        email,
      },
      create: {
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

    const { env } = getCtx();
    let exchangeConfig: ExchangeTokenConfig;
    switch (this.provider) {
      case FederatedProvider.Google:
      case FederatedProvider.GoogleWorkspace: {
        exchangeConfig = {
          server_url: "https://oauth2.googleapis.com/token",
          client_id: env.GOOGLE_OAUTH_CLIENT_ID,
          client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
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
          throw new InternalError("Failed to get federated account's user info", details);
        }

        return {
          email: response.data.email,
          identifier: response.data.sub,
        };
      }
    }
  }
}
