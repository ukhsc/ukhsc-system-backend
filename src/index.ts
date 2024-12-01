import { fromHono } from "chanfana";
import { Context, Hono } from "hono";
import { Env } from "../worker-configuration";
import { cors } from "hono/cors";
import { ListPartnerSchool } from "endpoints/resources/ListPartnerSchool";
import { PrismaClient } from "@prisma/client";
import { prisma } from "database/prisma";

interface Variables {
  prisma: PrismaClient;
}

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/docs",
});
openapi.use("/*", prisma());

// Register OpenAPI endpoints
openapi.get("/resources/partner-school", ListPartnerSchool);

// Export the Hono app
export default app;
export type AppContext = Context<{ Bindings: Env; Variables: Variables }>;
