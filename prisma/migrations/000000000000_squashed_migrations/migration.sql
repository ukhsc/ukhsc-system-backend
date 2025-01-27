-- CreateEnum
CREATE TYPE "FederatedProvider" AS ENUM ('Google', 'GoogleWorkspace');

-- CreateEnum
CREATE TYPE "SystemServiceStatus" AS ENUM ('Normal', 'Maintenance');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('Browser', 'Mobile', 'Unknown');

-- CreateEnum
CREATE TYPE "DeviceOperatingSystem" AS ENUM ('Android', 'iOS', 'Unknown');

-- CreateTable
CREATE TABLE "FederatedAccount" (
    "id" SERIAL NOT NULL,
    "provider" "FederatedProvider" NOT NULL,
    "provider_identifier" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "FederatedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAccountConfig" (
    "username_format" TEXT NOT NULL,
    "student_username_format" TEXT NOT NULL,
    "password_format" TEXT NOT NULL,
    "domain_name" TEXT NOT NULL,
    "school_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "LoginActivity" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "ip_address" TEXT,
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "LoginActivity_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "StudentMember" (
    "id" TEXT NOT NULL,
    "school_attended_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "nickname" TEXT,
    "student_id_hash" TEXT,
    "password_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),

    CONSTRAINT "StudentMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerSchool" (
    "id" SERIAL NOT NULL,
    "short_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,

    CONSTRAINT "PartnerSchool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "primary_email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDevice" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL,
    "operating_system" "DeviceOperatingSystem" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FederatedAccount_provider_provider_identifier_idx" ON "FederatedAccount"("provider", "provider_identifier");

-- CreateIndex
CREATE INDEX "FederatedAccount_email_idx" ON "FederatedAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FederatedAccount_provider_provider_identifier_key" ON "FederatedAccount"("provider", "provider_identifier");

-- CreateIndex
CREATE UNIQUE INDEX "FederatedAccount_provider_user_id_key" ON "FederatedAccount"("provider", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAccountConfig_school_id_key" ON "SchoolAccountConfig"("school_id");

-- CreateIndex
CREATE INDEX "LoginActivity_login_time_idx" ON "LoginActivity"("login_time" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "StudentMember_user_id_key" ON "StudentMember"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerSchool_short_name_key" ON "PartnerSchool"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerSchool_full_name_key" ON "PartnerSchool"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_primary_email_key" ON "User"("primary_email");

-- AddForeignKey
ALTER TABLE "FederatedAccount" ADD CONSTRAINT "FederatedAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAccountConfig" ADD CONSTRAINT "SchoolAccountConfig_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "PartnerSchool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginActivity" ADD CONSTRAINT "LoginActivity_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "UserDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMember" ADD CONSTRAINT "StudentMember_school_attended_id_fkey" FOREIGN KEY ("school_attended_id") REFERENCES "PartnerSchool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMember" ADD CONSTRAINT "StudentMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDevice" ADD CONSTRAINT "UserDevice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
