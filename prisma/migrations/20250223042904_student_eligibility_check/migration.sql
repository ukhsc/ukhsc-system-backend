-- AlterTable
ALTER TABLE "PartnerSchool" ADD COLUMN     "eligible_student_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "enable_eligibility_check" BOOLEAN NOT NULL DEFAULT false;
