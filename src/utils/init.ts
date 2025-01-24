import { MiddlewareHandler } from "hono";
import { AppOptions } from "index";

import { EnvConfig, initEnv } from "./env";
import { ExtendedPrismaClient, initPrisma } from "./prisma";

let envCache: EnvConfig | null = null;
let prismaCache: ExtendedPrismaClient | null = null;
export const initialMiddleware: MiddlewareHandler<AppOptions> = async (ctx, next) => {
  if (!envCache) {
    envCache = initEnv();
  }
  if (!prismaCache) {
    prismaCache = initPrisma(ctx.env.DATABASE_URL);
  }

  ctx.env = {
    ...envCache,
    ...ctx.env,
  };
  ctx.set("prisma", prismaCache);

  await next();
};
