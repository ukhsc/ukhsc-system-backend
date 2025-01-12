/*
  Warnings:

  - Added the required column `success` to the `LoginActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `UserDevice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginActivity" ADD COLUMN     "success" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "UserDevice" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "_StudentMemberToUserDevice" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StudentMemberToUserDevice_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StudentMemberToUserDevice_B_index" ON "_StudentMemberToUserDevice"("B");

-- CreateIndex
CREATE INDEX "LoginActivity_login_time_idx" ON "LoginActivity"("login_time" DESC);

-- AddForeignKey
ALTER TABLE "_StudentMemberToUserDevice" ADD CONSTRAINT "_StudentMemberToUserDevice_A_fkey" FOREIGN KEY ("A") REFERENCES "StudentMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentMemberToUserDevice" ADD CONSTRAINT "_StudentMemberToUserDevice_B_fkey" FOREIGN KEY ("B") REFERENCES "UserDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
