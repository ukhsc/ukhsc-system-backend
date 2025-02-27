-- CreateEnum
CREATE TYPE "UnionStaffRole" AS ENUM ('President', 'TechnicalDirector', 'Staff');

-- CreateEnum
CREATE TYPE "StaffPermission" AS ENUM ('membership:manage_eligibility');

-- CreateTable
CREATE TABLE "UnionStaff" (
    "user_id" INTEGER NOT NULL,
    "role" "UnionStaffRole" NOT NULL,
    "permissions" "StaffPermission"[],
    "real_name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UnionStaff_user_id_key" ON "UnionStaff"("user_id");

-- AddForeignKey
ALTER TABLE "UnionStaff" ADD CONSTRAINT "UnionStaff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
