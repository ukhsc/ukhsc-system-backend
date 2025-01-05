/*
  Warnings:

  - Added the required column `password_format` to the `SchoolAccountConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_username_format` to the `SchoolAccountConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "FederatedProvider" ADD VALUE 'GoogleWorkspace';

-- AlterEnum
ALTER TYPE "MembershipPurchaseChannel" ADD VALUE 'PartnerFree';

-- AlterTable
ALTER TABLE "SchoolAccountConfig" ADD COLUMN     "password_format" TEXT NOT NULL,
ADD COLUMN     "student_username_format" TEXT NOT NULL;
