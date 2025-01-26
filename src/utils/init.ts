import { MiddlewareHandler } from "hono";
import { AppOptions } from "index";

import { EnvConfig, initEnv } from "./env";
import { ExtendedPrismaClient, initPrisma } from "./prisma";
import * as Sentry from "@sentry/node";
import { initSentry } from "./sentry";
import { randomUUID } from "crypto";

let envCache: EnvConfig | null = null;
let prismaCache: ExtendedPrismaClient | null = null;
let sentryCache: Sentry.NodeClient | undefined;
export const initialMiddleware: MiddlewareHandler<AppOptions> = async (ctx, next) => {
  ctx.set("request_id", randomUUID());

  envCache ??= initEnv();
  ctx.env = {
    ...envCache,
    ...ctx.env,
  };

  prismaCache ??= initPrisma(envCache.DATABASE_URL);
  ctx.set("prisma", prismaCache);

  if (ctx.env.SENTRY_DSN && ctx.env.IS_PRODUCTION) {
    sentryCache ??= initSentry(ctx.env);

    const scope = Sentry.getIsolationScope();
    scope.setSDKProcessingMetadata({
      normalizedRequest: {
        url: ctx.req.url,
        headers: ctx.req.header(),
        method: ctx.req.method,
        query_string: ctx.req.query(),
        data: ctx.req.text(),
      } satisfies Sentry.RequestEventData,
    });
    scope.setTransactionName(`[${ctx.req.method}] ${ctx.req.path}`);
    scope.setContext("environment_vars", ctx.env);
    ctx.set("sentry", scope);
  }

  await next();
  if (ctx.error) {
    ctx.var.sentry?.captureException(ctx.error);
  }
};
