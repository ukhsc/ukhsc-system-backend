import pino from "pino";
import * as Sentry from "@sentry/node";
import console from "node:console";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import pkg from "@prisma/instrumentation";
const { PrismaInstrumentation } = pkg;

import { EnvConfig } from "./env";
import { AppContext } from "index";
import assert from "node:assert";

type PinoLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export class SentryTransport {
  constructor(private sentry: Sentry.Scope) {}

  write(data: string): void {
    try {
      const log = JSON.parse(data);
      const levelName = pino.levels.labels[log.level] as PinoLevel;
      const breadcrumb: Sentry.Breadcrumb = {
        type: this.getBreadcrumbType(levelName),
        category: "log",
        level: this.getSentryLevel(levelName),
        message: log.msg,
        data: this.formatData(log),
        timestamp: log.time,
      };

      this.sentry.addBreadcrumb(breadcrumb);
    } catch (err) {
      console.error("Sentry transport error:", err);
    }
  }

  private formatData(log: Record<string, unknown>): Record<string, unknown> {
    const data = { ...log };
    delete data.level;
    delete data.msg;
    delete data.time;
    return data;
  }

  private getBreadcrumbType(pinoLevel: PinoLevel): string {
    switch (pinoLevel) {
      case "trace":
      case "debug":
      case "info":
        return "debug";
      case "warn":
        return "default";
      case "error":
      case "fatal":
        return "error";
    }
  }

  private getSentryLevel(pinoLevel: PinoLevel): Sentry.SeverityLevel {
    switch (pinoLevel) {
      case "trace":
      case "debug":
        return "debug";
      case "info":
        return "info";
      case "warn":
        return "warning";
      case "error":
        return "error";
      case "fatal":
        return "fatal";
    }
  }
}

export function initSentry(env: EnvConfig): Sentry.NodeClient | undefined {
  assert(env.SENTRY_DSN, "SENTRY_DSN is required to initialize Sentry");
  assert(env.IS_PRODUCTION, "Sentry should only be initialized in production");

  console.info("Initializing Sentry");
  const client = Sentry.init({
    dsn: env.SENTRY_DSN,
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
        blue_green_deployment: env.CURRENT_ENVIRONMENT,
      },
    },
  });

  console.info("Sentry initialized");
  return client;
}

export function initScope(ctx: AppContext): Sentry.Scope {
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

  return scope;
}
