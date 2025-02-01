import { AppRouter } from "index";
import { CreateStudentMember } from "./CreateStudentMember";
import { GetMyMemberInfo } from "./GetMyMemberInfo";
import { createRouter } from "..";
import UpdateMyMemberSettings from "./UpdateMyMemberSettings";

export function registerMemberRoute(): AppRouter {
  const router = createRouter();

  router.post("/", CreateStudentMember);
  router.get("/me", GetMyMemberInfo);
  router.put("/me/settings", UpdateMyMemberSettings);

  return router;
}
