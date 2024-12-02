import { fromHono } from "chanfana";
import { Context, Hono } from "hono";
import { ListPartnerSchool } from "endpoints/resources/ListPartnerSchool";
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

dotenv.config();
const app = new Hono<AppOptions>();

const openapi = fromHono(app, {
  docs_url: "/docs",
});
openapi.use(logger());
openapi.use(prismaInitMiddleware);

// Register OpenAPI endpoints
openapi.get("/resources/partner-school", ListPartnerSchool);
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

export default {
  port: process.env.PORT || 8787,
  fetch: app.fetch,
};
