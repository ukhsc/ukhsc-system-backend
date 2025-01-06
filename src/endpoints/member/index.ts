import { AppRouter } from "index";
import { CreateStudentMember } from "./CreateStudentMember";

export function registerMemberRoute(router: AppRouter) {
  router.post("/member", CreateStudentMember);
}
