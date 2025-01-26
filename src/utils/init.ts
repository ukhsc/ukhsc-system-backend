import { MiddlewareHandler } from "hono";
import { AppOptions } from "index";

import { EnvConfig, initEnv } from "./env";
import { ExtendedPrismaClient, initPrisma } from "./prisma";
import console from "console";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { PrismaInstrumentation } from "@prisma/instrumentation";

let envCache: EnvConfig | null = null;
let prismaCache: ExtendedPrismaClient | null = null;
let sentryCache: Sentry.NodeClient | undefined;
export const initialMiddleware: MiddlewareHandler<AppOptions> = async (ctx, next) => {
  if (!envCache) {
    envCache = initEnv();
  }
  if (!prismaCache) {
    prismaCache = initPrisma(envCache.DATABASE_URL);
  }

  ctx.env = {
    ...envCache,
    ...ctx.env,
  };
  ctx.set("prisma", prismaCache);

  if (ctx.env.SENTRY_DSN && ctx.env.IS_PRODUCTION) {
    if (!sentryCache) {
      console.info("Initializing Sentry");
      sentryCache = Sentry.init({
        dsn: ctx.env.SENTRY_DSN,
        integrations: [
          nodeProfilingIntegration(),
          Sentry.extraErrorDataIntegration(),
          Sentry.prismaIntegration({ prismaInstrumentation: new PrismaInstrumentation() }),
          Sentry.captureConsoleIntegration(),
          Sentry.anrIntegration({ captureStackTrace: true }),
        ],

        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,

        environment: "production",
        initialScope: {
          tags: {
            blue_green_deployment: ctx.env.CURRENT_ENVIRONMENT,
          },
        },
      });
      console.info("Sentry initialized");
    }

    const scope = Sentry.getIsolationScope();
    scope.setSDKProcessingMetadata({ request: ctx.env.incoming });
    ctx.set("sentry", scope);
  }

  await next();
  if (ctx.error) {
    ctx.var.sentry?.captureException(ctx.error);
  }
};
