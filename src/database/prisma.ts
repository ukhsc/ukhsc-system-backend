import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { MiddlewareHandler } from "hono";
import { AppContext } from "index";

export const prisma = (): MiddlewareHandler => {
  return async (ctx: AppContext, next: any) => {
    if (!ctx.get("prisma")) {
      const connectionString = ctx.env.DATABASE_URL;
      const client = new PrismaClient({
        datasources: {
          db: {
            url: connectionString,
          },
        },
      }).$extends(withAccelerate());

      ctx.set("prisma", client as any);
    }
    await next();
  };
};
