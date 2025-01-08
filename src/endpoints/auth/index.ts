import { AppRouter } from "index";
import { LinkFederatedAccount } from "./LinkFederatedAccount";

export function registerAuthRoute(router: AppRouter) {
  router.post("/auth/federated/:provider/link", LinkFederatedAccount);
}
