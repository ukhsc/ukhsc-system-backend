-- CreateTable
CREATE TABLE "SchoolRepresentative" (
    "user_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "job_title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolRepresentative_user_id_key" ON "SchoolRepresentative"("user_id");

-- AddForeignKey
ALTER TABLE "SchoolRepresentative" ADD CONSTRAINT "SchoolRepresentative_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolRepresentative" ADD CONSTRAINT "SchoolRepresentative_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "PartnerSchool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
