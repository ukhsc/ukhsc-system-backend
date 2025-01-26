import { fromHono, HonoOpenAPIRouterType } from "chanfana";
import { Context, Hono } from "hono";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import process from "process";
import { cors } from "hono/cors";
import console from "console";
import { HttpBindings, serve } from "@hono/node-server";
import * as Sentry from "@sentry/node";
import { type Env as HonoPinoEnv } from "hono-pino";
import { contextStorage, getContext } from "hono/context-storage";

import { registerEndpoints } from "endpoints";
import { EnvConfig } from "@utils/env";
import { ExtendedPrismaClient } from "@utils/prisma";
import { httpErrorHandler } from "@utils/error";
import { initialMiddleware } from "@utils/init";
import { loggingMiddleware } from "@utils/logging";

interface Variables {
  db: ExtendedPrismaClient;
  sentry?: Sentry.Scope;
  request_id: string;

  /** @deprecated */
  prisma: ExtendedPrismaClient;
}
export type AppOptions = { Variables: Variables; Bindings: EnvConfig & HttpBindings } & HonoPinoEnv;
export type AppContext = Context<AppOptions>;
export type AppRouter = HonoOpenAPIRouterType<AppOptions>;

export function getCtx(): AppContext {
  return getContext<AppOptions>();
}

dotenv.config();
const app = new Hono<AppOptions>();
const openapi = fromHono(app, {
  docs_url: "/docs",
  schema: {
    info: {
      title: "高雄高校特約聯盟 會員暨商家資訊整合系統 API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8787",
        description: "Local Development",
      },
      {
        url: "https://api.ukhsc.org",
        description: "Production",
      },
    ],
  },
});

openapi
  .use(contextStorage())
  .use(
    cors({
      origin: ["http://localhost:3000", "https://forms.ukhsc.org", "https://web.ukhsc.org"],
    }),
  )
  .use(logger())
  .use(initialMiddleware)
  .use(loggingMiddleware);

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
openapi.onError(httpErrorHandler);

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
