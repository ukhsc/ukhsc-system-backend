import { fromHono } from "chanfana";
import { Context, Hono } from "hono";
import { ListPartnerSchool } from "endpoints/resources/ListPartnerSchool";
import { prismaInitMiddleware } from "config/prisma";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import { PrismaClient } from "@prisma/client";

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

export default {
  port: process.env.PORT || 8787,
  fetch: app.fetch,
};
