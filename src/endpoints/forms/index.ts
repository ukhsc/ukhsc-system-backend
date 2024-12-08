import { ViewPersonalMembershipOrder } from "./ViewPersonalMembershipOrder";
import { OrderPersonalMembership } from "./OrderPersonalMembership";
import { AppRouter } from "index";

export function registerForms(router: AppRouter) {
  router.post("/forms/personal-membership-order", OrderPersonalMembership);
  router.get("/forms/personal-membership-order", ViewPersonalMembershipOrder);
}
