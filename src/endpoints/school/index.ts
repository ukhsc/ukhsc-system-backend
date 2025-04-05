import { AppRouter, getCtx } from "index";
import { createRouter } from "..";
import { ListPartnerSchool } from "./list-partner-school.route";
import { GetEligibleStudentsStatistics } from "./eligible-students-statistics.route";
import { AddEligibleStudent } from "./add-eligible-student.route";
import { UpdateEligibleStudents } from "./update-eligible-student.route";
import { PatchEligibleStudentConfig } from "./patch-eligible-student-config.route";
import { PermissionCheckContext, UserRole } from "@services/auth";
import { Prisma, StaffPermission } from "@prisma/client";
import { AppContext } from "index";
import { KnownErrorCode, NotFoundError } from "@utils/error";
import { AuthService } from "@services/auth";

export function registerSchoolRoute(): AppRouter {
  const router = createRouter();
  router.get("/", ListPartnerSchool);

  const eligibleStudentsRouter = createRouter();
  eligibleStudentsRouter.post("/", AddEligibleStudent);
  eligibleStudentsRouter.put("/", UpdateEligibleStudents);
  eligibleStudentsRouter.get("/statistics", GetEligibleStudentsStatistics);

  eligibleStudentsRouter.patch("/config", PatchEligibleStudentConfig);

  router.route("/:id/eligible-students", eligibleStudentsRouter);

  return router;
}

export async function canManageEligibility(
  target_school_id: number,
  context: PermissionCheckContext,
): Promise<boolean> {
  const { db } = getCtx().var;
  const { roles, staff_permissions } = context;

  if (roles.includes(UserRole.SchoolRepresentative)) {
    // TODO: determine directly from the school representative's affiliated school instead of through the student member from user ID.
    const representative_school = await db.partnerSchool.findFirst({
      where: { students: { some: { user_id: context.user_id } } },
      select: { id: true },
    });
    return representative_school?.id === target_school_id;
  }

  if (
    roles.includes(UserRole.UnionStaff) &&
    staff_permissions?.includes(StaffPermission.MembershipEligibility)
  ) {
    return true;
  }

  return false;
}

export async function findSchoolAndValidate(
  ctx: AppContext,
  school_id: number,
  extra_select: Prisma.PartnerSchoolSelect = {},
) {
  const { db } = ctx.var;

  const school = await db.partnerSchool.findUnique({
    where: {
      id: school_id,
    },
    select: {
      id: true,
      ...extra_select,
    },
  });

  if (!school) {
    throw new NotFoundError(KnownErrorCode.NOT_FOUND);
  }

  await AuthService.validate({
    permission_checker: async (context) => await canManageEligibility(school.id, context),
  });

  return school;
}
