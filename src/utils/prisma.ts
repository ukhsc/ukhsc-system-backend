import { PrismaClient } from "@prisma/client";
import { MiddlewareHandler } from "hono";
import { AppOptions } from "index";

let prisma: ExtendedPrismaClient | null = null;

function initPrisma(connection_string: string) {
  const client = new PrismaClient({
    datasources: { db: { url: connection_string } },
  });

  prisma = getExtendedPrisma(client);
}

export const prismaInitMiddleware: MiddlewareHandler<AppOptions> = async (ctx, next) => {
  if (!ctx.var.prisma) {
    if (!prisma) {
      initPrisma(ctx.env.DATABASE_URL);
    }

    ctx.set("prisma", prisma as never);
  }
  await next();
};

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
