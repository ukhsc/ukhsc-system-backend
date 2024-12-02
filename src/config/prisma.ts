import { PrismaClient } from "@prisma/client";
import { MiddlewareHandler } from "hono";
import { AppOptions } from "index";
import env from "./env";

export const prismaInitMiddleware: MiddlewareHandler<AppOptions> = async (
  ctx,
  next,
) => {
  if (!ctx.var.prisma) {
    const connectionString = env.DATABASE_URL;
    const client = new PrismaClient({
      datasources: { db: { url: connectionString } },
    });

    ctx.set("prisma", client as any);
  }
  await next();
};
