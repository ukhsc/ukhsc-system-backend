-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('Browser', 'Mobile', 'Unknown');

-- CreateEnum
CREATE TYPE "DeviceOperatingSystem" AS ENUM ('Android', 'iOS', 'Unknown');

-- CreateTable
CREATE TABLE "UserDevice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL,
    "operating_system" "DeviceOperatingSystem" NOT NULL,

    CONSTRAINT "UserDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginActivity" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "ip_address" TEXT,
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoginActivity" ADD CONSTRAINT "LoginActivity_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "UserDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
