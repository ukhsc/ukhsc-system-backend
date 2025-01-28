import { MiddlewareHandler } from "hono";
import { AppOptions } from "index";

import { EnvConfig, initEnv } from "./env";
import { ExtendedPrismaClient, initPrisma } from "./prisma";
import * as Sentry from "@sentry/node";
import { initScope, initSentry } from "./sentry";
import { randomUUID } from "node:crypto";
import { context, SpanStatusCode, trace } from "@opentelemetry/api";

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
  // TODO: deprecate prisma field in ctx
  ctx.set("prisma", prismaCache);
  ctx.set("db", prismaCache);

  if (ctx.env.SENTRY_DSN && ctx.env.IS_PRODUCTION) {
    sentryCache ??= initSentry(ctx.env);
    ctx.set("sentry", initScope(ctx));

    const { req } = ctx;
    return Sentry.continueTrace(
      {
        sentryTrace: req.header("sentry-trace") || "",
        baggage: req.header("baggage"),
      },
      () => {
        return Sentry.startSpan(
          {
            name: `[${ctx.req.method}] ${ctx.req.path}`,
            attributes: {
              "http.method": req.method,
              "http.url": req.url,
              "http.route": req.routePath || req.path,

              // See Also: https://github.com/getsentry/sentry-javascript/blob/6ce53653c19105681784ae4b9d614b69970f5d84/packages/core/src/semanticAttributes.ts#L19C46-L19C55
              "sentry.origin": "auto.http.hono",
              "sentry.source": "url",
              "sentry.op": "http.server",
              "http.request.method": req.method,
              "url.full": req.url,
              "http.request.body.size": parseInt(req.header("content-length") || "0", 10),
            },
          },
          (span) => {
            const activeContext = trace.setSpan(context.active(), span);
            return context.with(activeContext, async () => {
              try {
                ctx.set("span", span);
                await next();
                span.setStatus({ code: SpanStatusCode.OK });
                span.setAttribute("http.status_code", ctx.res.status);
              } finally {
                span.end();
              }
            });
          },
        );
      },
    );
  } else {
    return await next();
  }
};
