import { AppRouter } from "index";
import { ListPartnerSchool } from "./ListPartnerSchool";
import { createRouter } from "..";

export function registerSchoolRoute(): AppRouter {
  const router = createRouter();

  router.get("/", ListPartnerSchool);

  return router;
}
