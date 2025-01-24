import { PrismaClient } from "@prisma/client";

export function initPrisma(connection_string: string) {
  const client = new PrismaClient({
    datasources: { db: { url: connection_string } },
  });

  return getExtendedPrisma(client);
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
