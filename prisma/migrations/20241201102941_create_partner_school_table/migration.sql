-- CreateEnum
CREATE TYPE "PartnerPlan" AS ENUM ('Personal', 'GroupA', 'GroupB', 'Combined');

-- CreateTable
CREATE TABLE "PartnerSchool" (
    "id" SERIAL NOT NULL,
    "short_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "plan" "PartnerPlan" NOT NULL,

    CONSTRAINT "PartnerSchool_pkey" PRIMARY KEY ("id")
);
