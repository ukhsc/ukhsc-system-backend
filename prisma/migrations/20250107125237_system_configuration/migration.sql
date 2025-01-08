-- CreateEnum
CREATE TYPE "SystemServiceStatus" AS ENUM ('Normal', 'Maintenance');

-- AlterTable
ALTER TABLE "StudentMember" ADD COLUMN     "expired_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SystemConfigurationUpdates" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "service_status" "SystemServiceStatus" NOT NULL,
    "contract_start_date" TIMESTAMP(3) NOT NULL,
    "contract_end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfigurationUpdates_pkey" PRIMARY KEY ("id")
);
