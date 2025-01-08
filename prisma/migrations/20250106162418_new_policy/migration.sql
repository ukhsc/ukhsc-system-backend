/*
  Warnings:

  - You are about to drop the column `has_stickers` on the `StudentMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PartnerSchool" ALTER COLUMN "plan" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudentMember" DROP COLUMN "has_stickers";
