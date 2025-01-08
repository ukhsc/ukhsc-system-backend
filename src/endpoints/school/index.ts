import { AppRouter } from "index";
import { ListPartnerSchool } from "./ListPartnerSchool";

export function registerSchoolRoute(router: AppRouter) {
  // Backward compatibility
  router.get("/resources/partner-school", ListPartnerSchool);

  router.get("/school", ListPartnerSchool);
}
