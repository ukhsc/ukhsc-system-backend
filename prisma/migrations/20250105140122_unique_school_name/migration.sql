/*
  Warnings:

  - A unique constraint covering the columns `[short_name]` on the table `PartnerSchool` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[full_name]` on the table `PartnerSchool` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PartnerSchool_short_name_key" ON "PartnerSchool"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerSchool_full_name_key" ON "PartnerSchool"("full_name");
