/*
  Warnings:

  - You are about to drop the column `nickname` on the `StudentMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentMember" DROP COLUMN "nickname";

-- CreateTable
CREATE TABLE "MemberSettings" (
    "member_id" TEXT NOT NULL,
    "nickname" TEXT,
    "e_invoice_barcode" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberSettings_pkey" PRIMARY KEY ("member_id")
);

-- AddForeignKey
ALTER TABLE "MemberSettings" ADD CONSTRAINT "MemberSettings_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "StudentMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
