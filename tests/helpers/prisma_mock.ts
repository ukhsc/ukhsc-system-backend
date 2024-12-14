import { PrismaClient } from "@prisma/client";
import { mock, beforeEach } from "bun:test";

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

function createMockPrismaClient(): MockPrismaClient {
  return {
    personalMembershipOrder: {
      findUnique: mock(() => Promise.resolve(null)),
    },
    federatedAccount: {
      findFirst: mock(() => Promise.resolve(null)),
      create: mock(() => Promise.resolve(null)),
    },
    studentMember: {
      update: mock(() => Promise.resolve(null)),
    },
  } as MockPrismaClient;
}

let prisma: MockPrismaClient = createMockPrismaClient();

beforeEach(() => {
  prisma = createMockPrismaClient();
});

export { prisma };
