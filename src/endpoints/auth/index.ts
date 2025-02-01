import { AppRouter } from "index";
import { LinkFederatedAccount } from "./LinkFederatedAccount";
import { RefreshToken } from "./RefreshToken";
import { LoginFederatedAccount } from "./LoginFederatedAccount";
import { createRouter } from "..";

export function registerAuthRoute(): AppRouter {
  const router = createRouter();

  router.post("/federated/:provider/link", LinkFederatedAccount);
  router.post("/federated/:provider/login", LoginFederatedAccount);
  router.post("/token/refresh", RefreshToken);

  return router;
}
