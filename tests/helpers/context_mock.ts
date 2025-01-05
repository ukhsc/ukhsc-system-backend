import { BaseTokenPayload, TokenRole } from "@config/auth";
import { mockPrisma } from "./prisma_mock";

export function createMockContext<P extends BaseTokenPayload>(payload?: Partial<P>) {
  return {
    prisma: mockPrisma,
    auth_payload: {
      ...payload,
    },
  };
}

export function createOrdererContext(orderId: number = 1) {
  return createMockContext({
    role: TokenRole.Orderer,
    order_id: orderId,
  });
}
