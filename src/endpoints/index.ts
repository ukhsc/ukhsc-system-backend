import { Hono } from "hono";
import { fromHono } from "chanfana";

import { registerSchoolRoute } from "./school";
import { registerAuthRoute } from "./auth";
import { registerMemberRoute } from "./member";
import { AppOptions, AppRouter } from "index";
import { ServiceStatus } from "./ServiceStatus";
import { registerUserRoute } from "./user";

export function createRouter(): AppRouter {
  const router = new Hono<AppOptions>();
  return fromHono(router);
}

export function registerEndpoints(): AppRouter {
  const router = createRouter();

  router.get("/status", ServiceStatus);

  router.route("/school", registerSchoolRoute());
  router.route("/auth", registerAuthRoute());
  router.route("/member", registerMemberRoute());
  router.route("/user", registerUserRoute());

  return router;
}
