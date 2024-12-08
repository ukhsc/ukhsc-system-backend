import { PrismaClient } from "@prisma/client";
import { MiddlewareHandler } from "hono";
import { AppOptions } from "index";
import env from "./env";

let prisma: PrismaClient | null = null;

function initPrisma() {
  const connectionString = env.DATABASE_URL;
  const client = new PrismaClient({
    datasources: { db: { url: connectionString } },
  });

  prisma = client;
}

export const prismaInitMiddleware: MiddlewareHandler<AppOptions> = async (ctx, next) => {
  if (!ctx.var.prisma) {
    if (!prisma) {
      initPrisma();
    }

    ctx.set("prisma", prisma as never);
  }
  await next();
};
