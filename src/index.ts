import { fromHono, OpenAPIRouterType } from "chanfana";
import { Context, Hono } from "hono";
import { ListPartnerSchool, registerForms } from "endpoints";
import { prismaInitMiddleware } from "config/prisma";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { PrismaClient } from "@prisma/client";
import { HealthCheck } from "endpoints/HealthCheck";
import process from "process";

interface Variables {
  prisma: PrismaClient;
}
export type AppOptions = { Variables: Variables };
export type AppContext = Context<AppOptions>;
export type AppRouter = Hono<AppOptions> & OpenAPIRouterType<Hono<AppOptions>>;

dotenv.config();
const app = new Hono<AppOptions>();

const openapi = fromHono(app, {
  docs_url: "/docs",
});
openapi.use(logger());
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

export default {
  port: process.env.PORT || 8787,
  fetch: app.fetch,
};
