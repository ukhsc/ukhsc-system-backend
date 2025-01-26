import pino from "pino";
import * as Sentry from "@sentry/node";
import console from "node:console";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import pkg from "@prisma/instrumentation";
const { PrismaInstrumentation } = pkg;

import { EnvConfig } from "./env";

type PinoLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export class SentryTransport {
  constructor(private sentry: Sentry.Scope) {}

  write(data: string): void {
    try {
      const log = JSON.parse(data);
      const levelName = pino.levels.labels[log.level] as PinoLevel;

      this.sentry.captureMessage(data, this.getSentryLevel(levelName));
    } catch (err) {
      console.error("Sentry transport error:", err);
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
