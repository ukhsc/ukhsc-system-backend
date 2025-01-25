import { fromHono, HonoOpenAPIRouterType } from "chanfana";
import { Context, Hono } from "hono";
import { registerEndpoints } from "endpoints";
import { ExtendedPrismaClient } from "@utils/prisma";
import dotenv from "dotenv";
import { logger } from "hono/logger";
import process from "process";
import { cors } from "hono/cors";
import { EnvConfig } from "@utils/env";
import console from "console";
import { HttpBindings, serve } from "@hono/node-server";
import { httpErrorHandler } from "@utils/error";
import { initialMiddleware } from "@utils/init";

interface Variables {
  prisma: ExtendedPrismaClient;
}
export type AppOptions = { Variables: Variables; Bindings: EnvConfig & HttpBindings };
export type AppContext = Context<AppOptions>;
export type AppRouter = HonoOpenAPIRouterType<AppOptions>;

dotenv.config();
const app = new Hono<AppOptions>();
const openapi = fromHono(app, {
  docs_url: "/docs",
  schema: {
    info: {
      title: "高雄高校特約聯盟 會員暨商家資訊整合系統 API",
      version: "1.0.0",
    },
  },
});

openapi.use(initialMiddleware);
openapi.use(logger());
openapi.use(
  cors({
    origin: ["http://localhost:3000", "https://forms.ukhsc.org", "https://web.ukhsc.org"],
  }),
);
openapi.registry.registerComponent("securitySchemes", "userAuth", {
  type: "http",
  scheme: "bearer",
  description: "Bearer token for authenticated users",
});
openapi.registry.registerComponent("securitySchemes", "memberAuth", {
  type: "http",
  scheme: "bearer",
  description: "Bearer token for users with 'StudentMember' role",
});
registerEndpoints(openapi);
openapi.onError(httpErrorHandler);

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 8787,
  },
  (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
  },
);

export default app;
