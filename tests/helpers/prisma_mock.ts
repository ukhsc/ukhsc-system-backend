import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";

export type MockPrisma = DeepMockProxy<PrismaClient>;

export function createMockPrisma(): MockPrisma {
  return mockDeep<PrismaClient>({
    fallbackMockImplementation: () => {
      throw new Error("please add expected return value using calledWith");
    },
  });
}
