import { AppRouter } from "index";
import { LinkFederatedAccount } from "./LinkFederatedAccount";
import { RefreshToken } from "./RefreshToken";
import { LoginFederatedAccount } from "./LoginFederatedAccount";

export function registerAuthRoute(router: AppRouter) {
  router.post("/auth/federated/:provider/link", LinkFederatedAccount);
  router.post("/auth/federated/:provider/login", LoginFederatedAccount);
  router.post("/auth/token/refresh", RefreshToken);
}
