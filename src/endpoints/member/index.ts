import { AppRouter } from "index";
import { CreateStudentMember } from "./CreateStudentMember";
import { GetMyMemberInfo } from "./GetMyMemberInfo";
import { createRouter } from "..";

export function registerMemberRoute(): AppRouter {
  const router = createRouter();

  router.post("/", CreateStudentMember);
  router.get("/me", GetMyMemberInfo);

  return router;
}
