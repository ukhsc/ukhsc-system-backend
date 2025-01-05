import { FederatedProvider } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { EnvConfig } from "@config/env";

interface FederatedUserInfo {
  email: string;
  identifier: string;
}

export class FederatedAccountService {
  constructor(
    private prisma: PrismaClient,
    private env: EnvConfig,
  ) {}

  async linkOrdererAccount(orderId: number, provider: FederatedProvider, info: FederatedUserInfo) {
    const { email, identifier } = info;

    const order = await this.prisma.personalMembershipOrder.findUnique({
      where: { id: orderId },
      include: {
        member: { include: { federated_accounts: true } },
      },
    });

    const member = order?.member;
    if (!order || !member) {
      throw new Error(`Order not found or member not found: ${orderId}`);
    }

    const existingAccount = await this.prisma.federatedAccount.findFirst({
      where: {
        provider,
        OR: [{ member_id: member.id }, { provider_identifier: identifier }],
      },
    });

    if (existingAccount) {
      throw new Error(`Account already linked: ${provider}`);
    }

    if (!member.primary_email) {
      await this.prisma.studentMember.update({
        where: { id: member.id },
        data: {
          primary_email: email,
        },
      });
    }

    await this.prisma.federatedAccount.create({
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

    let exchangeConfig: ExchangeTokenConfig;
    switch (provider) {
      case FederatedProvider.Google: {
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
}
