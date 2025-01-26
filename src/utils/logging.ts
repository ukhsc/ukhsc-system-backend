import { MiddlewareHandler } from "hono";
import { pinoLogger } from "hono-pino";
import { AppOptions } from "index";
import { DestinationStream } from "pino";

import { SentryTransport } from "./sentry";

export const loggingMiddleware: MiddlewareHandler<AppOptions> = async (ctx, next) => {
  const { sentry } = ctx.var;
  let transport: DestinationStream | undefined;
  if (sentry) {
    transport = new SentryTransport(sentry);
  }

  return pinoLogger({
    pino: transport,
    http: {
      referRequestIdKey: "request_id",
    },
  })(ctx as never, next);
};
