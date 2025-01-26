import { HealthCheck } from "./HealthCheck";
import { registerSchoolRoute } from "./school";
import { registerAuthRoute } from "./auth";
import { registerMemberRoute } from "./member";
import { AppRouter } from "index";
import { ServiceStatus } from "./ServiceStatus";
import { registerUserRoute } from "./user";

export function registerEndpoints(router: AppRouter) {
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

  router.get("/health", HealthCheck);
  router.get("/status", ServiceStatus);

  // Nesting routes is not working, see also: https://github.com/cloudflare/chanfana/issues/179.
  registerSchoolRoute(router);
  registerAuthRoute(router);
  registerMemberRoute(router);
  registerUserRoute(router);
}
