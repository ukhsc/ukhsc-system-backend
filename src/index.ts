import { fromHono, HonoOpenAPIRouterType } from "chanfana";
import { Context, Hono } from "hono";
import { registerEndpoints } from "endpoints";
import { ExtendedPrismaClient, initPrisma } from "@utils/prisma";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import process from "process";
import { cors } from "hono/cors";
import { EnvConfig, initEnv } from "@utils/env";
import console from "console";
import { HttpBindings, serve } from "@hono/node-server";
import { httpErrorMiddleware } from "@utils/error";

interface Variables {
  prisma: ExtendedPrismaClient;
}
export type AppOptions = { Variables: Variables & EnvConfig; Bindings: HttpBindings };
export type AppContext = Context<AppOptions>;
export type AppRouter = HonoOpenAPIRouterType<AppOptions>;

dotenv.config();
const app = new Hono<AppOptions>();
const openapi = fromHono(app, {
  docs_url: "/docs",
  schema: {
    info: {
      title: "高雄高校特約聯盟 會員暨商家資訊整合系統 API",
      version: "1.0.0",
    },
  },
});

let isServerInitialized = false;
openapi.use(async (ctx, next) => {
  if (!isServerInitialized) {
    const env = initEnv();
    for (const item in env) {
      const key = item as keyof EnvConfig;
      ctx.set(key, env[key]);
    }

    const prisma = initPrisma(ctx.var.DATABASE_URL);
    ctx.set("prisma", prisma);

    isServerInitialized = true;
  }

  await next();
});
openapi.use(logger());
openapi.use(
  cors({
    origin: ["http://localhost:3000", "https://forms.ukhsc.org", "https://web.ukhsc.org"],
  }),
);
openapi.registry.registerComponent("securitySchemes", "userAuth", {
  type: "http",
  scheme: "bearer",
  description: "Bearer token for authenticated users",
});
openapi.registry.registerComponent("securitySchemes", "memberAuth", {
  type: "http",
  scheme: "bearer",
  description: "Bearer token for users with 'StudentMember' role",
});
registerEndpoints(openapi);
openapi.use(httpErrorMiddleware);

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 8787,
  },
  (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
  },
);

export default app;
