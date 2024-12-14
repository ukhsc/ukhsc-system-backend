/*
  Warnings:

  - A unique constraint covering the columns `[short_name]` on the table `PartnerSchool` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[full_name]` on the table `PartnerSchool` will be added. If there are existing duplicate values, this will fail.

  Fixed:
  - Changed the type of `plan` on the `PartnerSchool` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PartnerSchoolPlan" AS ENUM ('Personal', 'GroupA', 'GroupB', 'Combined');

-- Add temporary column
ALTER TABLE "PartnerSchool" ADD COLUMN "plan_new" "PartnerSchoolPlan";

-- Copy data from old enum to new enum
UPDATE "PartnerSchool"
SET "plan_new" = "plan"::text::"PartnerSchoolPlan";

-- Drop old column
ALTER TABLE "PartnerSchool" DROP COLUMN "plan";

-- Set NOT NULL constraint
ALTER TABLE "PartnerSchool" ALTER COLUMN "plan_new" SET NOT NULL;

-- Rename column
ALTER TABLE "PartnerSchool" RENAME COLUMN "plan_new" TO "plan";

-- DropEnum
DROP TYPE "PartnerPlan";

-- CreateTable
CREATE TABLE "CloudImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CloudImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerShopSubmission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "legal_name" TEXT,
    "address" TEXT NOT NULL,

    CONSTRAINT "PartnerShopSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerSchool_short_name_key" ON "PartnerSchool"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerSchool_full_name_key" ON "PartnerSchool"("full_name");
