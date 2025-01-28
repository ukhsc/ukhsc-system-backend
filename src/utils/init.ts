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
    const tracer = trace.getTracer("hono-server");
    const requestSpan = tracer.startSpan("hono.request", {
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
    });

    return Sentry.continueTrace(
      {
        sentryTrace: req.header("sentry-trace") || "",
        baggage: req.header("baggage"),
      },
      () => {
        const activeContext = trace.setSpan(context.active(), requestSpan);
        return context.with(activeContext, async () => {
          try {
            await next();
            requestSpan.setStatus({ code: SpanStatusCode.OK });
            requestSpan.setAttribute("http.status_code", ctx.res.status);
          } finally {
            requestSpan.end();
          }
        });
      },
    );
  } else {
    return await next();
  }
};
