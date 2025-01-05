import { fromHono, OpenAPIRouterType } from "chanfana";
import { Context, Hono } from "hono";
import { ListPartnerSchool, registerAuth, registerForms } from "endpoints";
import { prismaInitMiddleware } from "config/prisma";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { PrismaClient } from "@prisma/client";
import { HealthCheck } from "endpoints/HealthCheck";
import process from "process";
import { BaseTokenPayload } from "@config/auth";
import { cors } from "hono/cors";
import { EnvConfig, initEnv } from "@config/env";
import console from "console";
import { serve } from "@hono/node-server";

interface Variables {
  prisma: PrismaClient;
  auth_payload?: BaseTokenPayload;
}
export type AppOptions = { Variables: Variables; Bindings: EnvConfig };
export type AppContext = Context<AppOptions>;
export type AppRouter = Hono<AppOptions> & OpenAPIRouterType<Hono<AppOptions>>;

dotenv.config();
const app = new Hono<AppOptions>();
const openapi = fromHono(app, {
  docs_url: "/docs",
});

let isEnvInitialized = false;
openapi.use(async (ctx, next) => {
  if (!isEnvInitialized) {
    ctx.env = initEnv();
    isEnvInitialized = true;
  }
  return next();
});
openapi.use(logger());
openapi.use(
  cors({
    origin: ["http://localhost:3000", "https://forms.ukhsc.org", "https://app.ukhsc.org"],
  }),
);
openapi.use(prismaInitMiddleware);
openapi.registry.registerComponent("securitySchemes", "ordererAuth", {
  type: "http",
  scheme: "bearer",
});

// Register OpenAPI endpoints
// TODO: fix ip restriction
// openapi.use(
//   "/health",
//   ipRestriction(getConnInfo, {
//     denyList: [],
//     allowList: [
//       "127.0.0.1", // IPv4 localhost
//       "::1", // IPv6 localhost
//       "172.16.0.0/12", // Docker default bridge network range
//       "192.168.0.0/16", // Additional Docker network range
//       "10.0.0.0/8", // Docker overlay network range
//     ],
//   }),
// );
openapi.get("/health", HealthCheck);
openapi.get("/resources/partner-school", ListPartnerSchool);
// Nesting routes is not working, see also: https://github.com/cloudflare/chanfana/issues/179.
registerForms(openapi);
registerAuth(openapi);
openapi.onError((err, cxt) => {
  console.error(err);
  return cxt.text("Internal Server Error", 500);
});

if (import.meta.env?.MODE !== "test") {
  serve(
    {
      fetch: app.fetch,
      port: Number(process.env.PORT) || 8787,
    },
    (info) => {
      console.log(`🚀 Server running at http://localhost:${info.port}`);
    },
  );
}

export default app;
