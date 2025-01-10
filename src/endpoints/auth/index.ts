import { AppRouter } from "index";
import { LinkFederatedAccount } from "./LinkFederatedAccount";
import { RefreshToken } from "./RefreshToken";

export function registerAuthRoute(router: AppRouter) {
  router.post("/auth/federated/:provider/link", LinkFederatedAccount);
  router.post("/auth/token/refresh", RefreshToken);
}
