import { AppRouter } from "index";
import { GetMyUserInfo } from "./GetMyUserInfo";

export function registerUserRoute(router: AppRouter) {
  router.get("/user/me", GetMyUserInfo);
}
