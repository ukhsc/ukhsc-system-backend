import { ExtendedPrismaClient } from "@utils/prisma";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";

export type MockPrisma = DeepMockProxy<ExtendedPrismaClient>;

export function createMockPrisma(): MockPrisma {
  return mockDeep<ExtendedPrismaClient>({
    fallbackMockImplementation: () => {
      throw new Error("please add expected return value using calledWith");
    },
  });
}
