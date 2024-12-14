import { BaseTokenPayload, TokenRole } from "@config/auth";
import { Context } from "hono";
import { prisma } from "./prisma_mock";

export function createMockContext<P extends BaseTokenPayload>(payload?: Partial<P>) {
  const context = {
    prisma,
    auth_payload: {
      ...payload,
    },
  };

  return { context, prisma };
}

// 提供便利的工具函數
export function createOrdererContext(orderId: number = 1) {
  return createMockContext({
    role: TokenRole.Orderer,
    order_id: orderId,
  });
}
