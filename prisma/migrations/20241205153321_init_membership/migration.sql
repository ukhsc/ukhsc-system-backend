-- CreateEnum
CREATE TYPE "AuthenticationProvider" AS ENUM ('Password', 'Google');

-- CreateEnum
CREATE TYPE "MembershipPurchaseChannel" AS ENUM ('Personal', 'StudentCouncil');

-- CreateTable
CREATE TABLE "SchoolAccountConfig" (
    "username_format" TEXT NOT NULL,
    "domain_name" TEXT NOT NULL,
    "school_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "StudentMember" (
    "id" TEXT NOT NULL,
    "school_attended_id" INTEGER NOT NULL,
    "email" TEXT,
    "student_id" TEXT,
    "nickname" TEXT,
    "purchase_channel" "MembershipPurchaseChannel" NOT NULL,
    "has_stickers" BOOLEAN NOT NULL DEFAULT false,
    "auth_providers" "AuthenticationProvider"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" TIMESTAMP(3),
    "password_hash" TEXT,

    CONSTRAINT "StudentMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalMembershipOrder" (
    "id" SERIAL NOT NULL,
    "member_id" TEXT,
    "school_id" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "real_name" TEXT NOT NULL,
    "need_sticker" BOOLEAN NOT NULL,
    "is_paid" BOOLEAN NOT NULL,

    CONSTRAINT "PersonalMembershipOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAccountConfig_school_id_key" ON "SchoolAccountConfig"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentMember_email_key" ON "StudentMember"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalMembershipOrder_member_id_key" ON "PersonalMembershipOrder"("member_id");

-- AddForeignKey
ALTER TABLE "SchoolAccountConfig" ADD CONSTRAINT "SchoolAccountConfig_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "PartnerSchool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMember" ADD CONSTRAINT "StudentMember_school_attended_id_fkey" FOREIGN KEY ("school_attended_id") REFERENCES "PartnerSchool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalMembershipOrder" ADD CONSTRAINT "PersonalMembershipOrder_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "StudentMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalMembershipOrder" ADD CONSTRAINT "PersonalMembershipOrder_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "PartnerSchool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
