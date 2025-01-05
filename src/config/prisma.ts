import { PrismaClient } from "@prisma/client";
import { MiddlewareHandler } from "hono";
import { AppOptions } from "index";

let prisma: PrismaClient | null = null;

function initPrisma(connection_string: string) {
  const client = new PrismaClient({
    datasources: { db: { url: connection_string } },
  });

  prisma = client;
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
