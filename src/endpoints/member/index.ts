import { AppRouter } from "index";
import { CreateStudentMember } from "./CreateStudentMember";
import { GetMyMemberInfo } from "./GetMyMemberInfo";

export function registerMemberRoute(router: AppRouter) {
  router.post("/member", CreateStudentMember);
  router.get("/member/me", GetMyMemberInfo);
}
