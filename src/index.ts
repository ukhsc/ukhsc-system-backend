import { HonoOpenAPIRouterType } from "chanfana";
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
import { Span } from "@opentelemetry/api";

import { registerEndpoints } from "endpoints";
import { EnvConfig } from "@utils/env";
import { ExtendedPrismaClient } from "@utils/prisma";
import { httpErrorHandler } from "@utils/error";
import { initialMiddleware } from "@utils/init";
import { loggingMiddleware } from "@utils/logging";
import { HealthCheck } from "@endpoints/HealthCheck";
import { configureOpenApi } from "@core/openapi";

interface Variables {
  db: ExtendedPrismaClient;
  request_id: string;

  sentry?: Sentry.Scope;
  span?: Span;

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
const openapi = configureOpenApi(app);

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

openapi.get("/health", HealthCheck);
openapi.route("/api/v1", registerEndpoints());

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
