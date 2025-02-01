import { AppRouter } from "index";
import { GetMyUserInfo } from "./GetMyUserInfo";
import { createRouter } from "..";

export function registerUserRoute(): AppRouter {
  const router = createRouter();

  router.get("/me", GetMyUserInfo);

  return router;
}
