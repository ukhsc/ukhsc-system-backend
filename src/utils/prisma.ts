import { PrismaClient } from "@prisma/client";
import console from "node:console";
import process from "node:process";

export function initPrisma(connection_string: string): ExtendedPrismaClient {
  try {
    console.log("🔍 Initializing Prisma client...");
    const client = new PrismaClient({
      datasources: { db: { url: connection_string } },
    });

    return getExtendedPrisma(client);
  } catch (error) {
    console.error("❌ Failed to initialize Prisma client:", error);
    process.exit(1);
  }
}

function getExtendedPrisma(prisma: PrismaClient) {
  return prisma.$extends({
    result: {
      studentMember: {
        is_activated: {
          needs: {
            activated_at: true,
            expired_at: true,
          },
          compute(data): boolean {
            const now = new Date();
            if (!data.activated_at) return false;
            if (!data.expired_at) return false;

            return data.activated_at <= now && now <= data.expired_at;
          },
        },
      },
    },
  });
}

export type ExtendedPrismaClient = ReturnType<typeof getExtendedPrisma>;
