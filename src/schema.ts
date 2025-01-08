import { z } from "zod";
import { StudentMemberSchema } from "../prisma/schema/generated/zod";

export * from "../prisma/schema/generated/zod";

export const StudentMemberSchemaPublic = StudentMemberSchema.omit({
  password_hash: true,
}).extend({
  is_activated: z.boolean(),
});
