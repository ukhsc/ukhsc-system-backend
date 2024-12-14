import { ViewPersonalMembershipOrder } from "./ViewPersonalMembershipOrder";
import { OrderPersonalMembership } from "./OrderPersonalMembership";
import { AppRouter } from "index";
import { UpdatePersonalMembershipOrder } from "./UpdatePersonalMembershipOrder";

export function registerForms(router: AppRouter) {
  router.post("/forms/personal-membership-order", OrderPersonalMembership);
  router.get("/forms/personal-membership-order", ViewPersonalMembershipOrder);
  router.patch("/forms/personal-membership-order", UpdatePersonalMembershipOrder);
}
