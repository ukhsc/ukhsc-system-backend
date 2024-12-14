import { expect, describe, beforeEach } from "bun:test";
import { LinkFederatedAccount } from "@endpoints/auth/LinkFederatedAccount";
import { prisma as mockPrisma } from "@test-helpers/prisma_mock";
import { FederatedProvider } from "@prisma/client";
import { createOrdererContext } from "@tests/helpers/context_mock";
import { Hono } from "hono";
import { fromHono } from "chanfana";
import { testClient } from "hono/testing";
import { AppOptions } from "index";

describe("LinkFederatedAccount", () => {
  let app: Hono<AppOptions>;
  let openapi: ReturnType<typeof fromHono>;

  beforeEach(() => {
    app = new Hono<AppOptions>();
    openapi = fromHono(app);

    openapi.post("/auth/federated/:provider/link", LinkFederatedAccount);
  });

  let { context, prisma } = createOrdererContext();
  // const linkFederatedAccount = new LinkFederatedAccount(mockRouteOptions);

  describe("handle", () => {
    it("should successfully link Google account", async () => {
      // Arrange
      const mockOrderer = {
        id: 1,
        member: {
          id: 1,
          primary_email: null,
          federated_accounts: [],
        },
      };

      mockPrisma.personalMembershipOrder.findUnique.mockImplementation(() =>
        Promise.resolve(mockOrderer),
      );
      mockPrisma.federatedAccount.findFirst.mockImplementation(() => Promise.resolve(null));
      mockPrisma.studentMember.update.mockImplementation(() => Promise.resolve({ id: 1 }));
      mockPrisma.federatedAccount.create.mockImplementation(() => Promise.resolve({ id: 1 }));

      // Act
      app.request("/auth/federated/google/link", { method: "POST" }, context);
      const res = testClient(app);
      const result = await linkFederatedAccount.handle(mockContext as any);

      // Assert
      expect(result.status).toBe(200);
      expect(result.json).toEqual({
        message: "Successfully linked the federated account",
      });

      // Verify mock calls
      expect(mockPrisma.personalMembershipOrder.findUnique).toHaveBeenCalled();
      expect(mockPrisma.federatedAccount.create).toHaveBeenCalled();
    });

    it("should return error when account is already linked", async () => {
      // Arrange
      mockPrisma.federatedAccount.findFirst.mockImplementation(() =>
        Promise.resolve({
          id: 1,
          provider: FederatedProvider.Google,
        }),
      );

      const mockContext = {
        var: {
          prisma: mockPrisma,
          auth_payload: {
            order_id: 1,
            role: "orderer",
          },
        },
        json: (data: any, status?: number) => ({ json: data, status }),
      };

      // Act
      const result = await linkFederatedAccount.handle(mockContext as any);

      // Assert
      expect(result.status).toBe(400);
      expect(result.json).toEqual({
        error: "Account already linked: Google",
      });

      // Verify mock calls
      expect(mockPrisma.federatedAccount.findFirst).toHaveBeenCalled();
    });
  });
});
